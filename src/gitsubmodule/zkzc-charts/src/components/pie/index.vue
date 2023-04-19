<script>
import Super from "../super/index.vue";
import { toArray } from "../../utils/tools";

export default {
  name: "PieIndex",
  components: {},
  extends: Super,
  data() {
    return {
      // 切换计时器
      titleClock: null,
      // 饼图项切换索引
      indexH: 0,
      // 饼图数据
      pieData: {
        total: 0,
        seriesData: [],
      },
    };
  },
  created() {
    this.colors = Object.freeze(this.theme.getColors({ random: false }));
  },
  mounted() {},
  beforeDestroy() {
    this.destroyClock();
  },
  methods: {
    render(data) {
      // 初始化饼图项切换索引
      this.indexH = 0;
      if (!data || !data.option) {
        return;
      }

      let newData = this.getCleanData(data);
      this.renderPie(newData);

      const instance = this.chart;
      this.changeTitle();
      instance.resize();

      // 鼠标移入
      instance.on("mouseover", (params) => {
        // 只有选中对应的饼图区域才能触发
        if (params.name !== "") {
          // 关闭定时
          clearInterval(this.titleClock);
          this.titleClock = null;
          // title文字转换为选中饼图区域的值
          const option = instance.getOption();
          const percent =
            ((params.value / this.pieData.total) * 100).toFixed(2) + "%";
          const name = params.name;
          option.series[0].data[0].name = `{a|${percent}}\n{b|${name}}`;
          instance.setOption(option, true);
          // 取消上次选中
          const lastIndexH =
            this.indexH === 0
              ? this.pieData.seriesData.length - 1
              : this.indexH - 1;
          instance.dispatchAction({
            type: "downplay",
            name: this.pieData.seriesData[lastIndexH].name,
          });

          // 触发选中
          instance.dispatchAction({
            type: "highlight",
            name,
          });
        }
      });
      // 鼠标移出
      instance.on("mouseout", (params) => {
        // 取消上次选中
        instance.dispatchAction({
          type: "downplay",
          name: params.name,
        });
        // clearInterval(this.titleClock);
        // this.titleClock = null;
        // this.changeTitle();
      });

      instance.on("selectchanged", () => {});

      instance.on("legendselectchanged", (params) => {
        const { legend } = this.chart.getOption();
        const { selected = {} } = params;


        const option = instance.getOption();

        // 过滤掉隐藏的series
        const sdata = option.series[1].data.filter((v) => {
          return selected[v.name] === undefined
            ? true
            : selected[v.name];
        });
        // 求总和
        this.pieData.total = sdata.reduce((a, b) => parseFloat(a) + parseFloat(b.value),0);

        // 关闭定时
        clearInterval(this.titleClock);
        this.titleClock = null;

        let isAllCancel = true;
        Object.values(selected).forEach((item) => {
          if (item) {
            isAllCancel = false;
            return false;
          }
        });
        // 若取消选择所有图例，中间文字不显示
        if (isAllCancel) {
          option.series[0].data[0].name = "";
          instance.setOption(option, true);
          return;
        }

        // 默认选择数值最大的区块高亮
        let targetIndex = 0
        let maxVal = 0

        this.pieData.seriesData.forEach((item,index) => {
            if(selected[item.name] !== false && parseFloat(item.value) > parseFloat(maxVal)) {
                maxVal = item.value
                targetIndex = index
            }
        })
        const percent = ((this.pieData.seriesData[targetIndex].value / this.pieData.total) * 100).toFixed(2) + "%";
        const name = this.pieData.seriesData[targetIndex].name
        option.series[0].data[0].name = `{a|${percent}}\n{b|${name}}`;
        instance.setOption(option, true);

         // 取消上次选中高亮
         const lastIndexH =
          this.indexH === 0
            ? this.pieData.seriesData.length - 1
            : this.indexH - 1;
        instance.dispatchAction({
          type: "downplay",
          name: this.pieData.seriesData[lastIndexH].name,
        });
      });
    },

    // 饼图加载
    renderPie({ legend, series }) {
      const { theme } = this;

      // 文字Series
      const seriesOut = [
        {
          name: "统计文字显示",
          type: "gauge",
          min: 0,
          max: 100,
          radius: "42%", // 图表尺寸
          center: theme.pie.pieCenter,
          startAngle: 90,
          endAngle: -269.9999,
          axisLine: {
            show: true,
            lineStyle: {
              color: [[1, theme.pie.routeRingColor]],
              width: 2,
              opacity: 1,
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          pointer: {
            // 仪表盘指针
            show: 0,
          },
          detail: {
            show: false,
          },
          title: {
            offsetCenter: ["0", "0"],
            show: true,
            rich: {
              a: {
                color: theme.textStyle.color,
                fontSize: 20,
                fontWeight: "Bold",
              },
              b: {
                color: theme.textStyle.color,
                fontSize: 14,
              },
            },
          },
          data: [
            {
              name: "",
              value: "0",
            },
          ],
        },
      ];

      this.chart.setOption({
        textStyle: theme.textStyle,
        color: this.colors,
        tooltip: {
          ...theme.tooltip,
        },
        legend: {
          ...theme.legend,
          show: true,
          padding: [10, 0],
          orient: "vertical",
          right: "5%",
          top: "middle",
          itemGap: 10,
          type: "scroll",
          icon: theme.icons.ring,
          align: "left",
          data: legend.data,
        },
        toolbox: {
          show: false,
        },
        series: [...seriesOut, ...this.getSeries(series)],
      });
    },

    // 切换中心区域文字
    changeTitle() {
      const t = this;
      const { pieData } = this;
      const instance = this.chart;
      const theme = this.getChartStyle();

      function setWord() {
        try {
          if (pieData.seriesData.length === 0) {
            return;
          }
          const option = instance.getOption();
          const percent =
            (
              (pieData.seriesData[t.indexH].value / pieData.total) *
              100
            ).toFixed(2) + "%";
          const name = pieData.seriesData[t.indexH].name;
          option.series[0].data[0].name = `{a|${percent}}\n{b|${name}}`;
          // 触发选中
          //   instance.dispatchAction({
          //     type: "highlight",
          //     name: pieData.seriesData[t.indexH].name,
          //   });
          // 取消上次选中
          const lastIndexH =
            t.indexH === 0 ? pieData.seriesData.length - 1 : t.indexH - 1;
          instance.dispatchAction({
            type: "downplay",
            name: pieData.seriesData[lastIndexH].name,
          });
          t.indexH = (t.indexH + 1) % pieData.seriesData.length;

          instance.setOption(option, true);
        } catch (error) {
          console.error("pie/index 定时文字渲染失败", error);
          t.destroyClock();
        }
      }

      // 定时切换
      if (this.clockEnable) {
        this.titleClock = setInterval(setWord, theme.pie.titleInterval);
      }

      setWord();
    },

    getSeries(series) {
      // debugger
      // series[0].data = series[0].data.slice(0, 7)

      const theme = this.getChartStyle();

      let res = series.map((item, index) => {
        return {
          name: "",
          type: "pie",
          clockwise: false,
          startAngle: 90,
          endAngle: "360",
          radius: ["60%", "75%"],
          animation: false,
          center: theme.pie.pieCenter,
          minAngle: 5,
          label: {
            ...theme.series.pie.label,
            show: false,
          },
          data: this.getSeriesData(item.data),
        };
      });

      return res;
    },

    getSeriesData(data) {
      const theme = this.getChartStyle();
      const res = [];

      // 清空pieData.seriesData
      const total = data.reduce(
        (a, b) => parseFloat(a) + parseFloat(b.value),
        0
      );

      this.pieData.seriesData = [];
      this.pieData.total = total;

      data.forEach((item, index) => {
        const color = this.colors[index % this.colors.length];

        // series的颜色
        const seriesColor = color;
        const itemSeries = {
          value: item.value,
          name: item.name,
          itemStyle: { color: seriesColor },

          emphasis: {
            color: seriesColor, // 背景色
            borderColor: color,
          },
        };
        res.push(itemSeries);
        this.pieData.seriesData.push(itemSeries);
      });
      return res;
    },

    // 清洗chartData
    // 返回清洗后的数据副本
    getCleanData(data) {
      let { legend, series } = data.option;

      // 为保证性能 最多允许20个几何块
      let sdata = toArray(series)[0]
        .data.filter((item) => parseFloat(item.value) > 0)
        .slice(0, 20);

      sdata = sdata.sort((a, b) => {
        return b.value - a.value;
      });

      let newLegend = {
        ...legend,
        data: sdata.map((v) => v.name),
      };
      let newSeries = [
        {
          name: series[0].name,
          data: sdata,
        },
      ];
      return {
        legend: newLegend,
        series: newSeries,
      };
    },

    destroyClock() {
      if (this.titleClock) {
        clearInterval(this.titleClock);
        this.titleClock = null;
      }
    },
  },
};
</script>

<style lang="scss" type="text/scss">
</style>
