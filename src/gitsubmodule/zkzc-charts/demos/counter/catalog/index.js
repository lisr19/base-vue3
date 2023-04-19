const app = new Vue({
  el: '#container',
  data: {
    chartData: {
      name: 'foobar',
      option: {
        title: {
          text: '数据统计'
        },
        series: [{
          name: '物联网设备数量统计',
          data: [
            {name: '摄像头', value: 5410},
            {name: '单灯节点', value: 20130},
            {name: '气象站', value: 65},
            {name: '充电桩', value: 120}
          ]
        }]
      }
    }
  }
})
