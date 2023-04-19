# 介绍

中科智城统一图表UI zkzc-charts，本工程可构建npm包。
如果有定制需求，也可以作为submodule子工程供主工程调用并按项目需要调整代码，调整前记得先开分支。
组件api文档使用[vue-styleguidist](https://vue-styleguidist.github.io/docs/GettingStarted.html#_1-install)自动生成。

### 组件演示文档
~~https://lbs.iot-cas.com/zkzc-charts/docs/demos/index.html~~

### 组件开发文档
https://lbs.iot-cas.com/zkzc-charts/docs/api/index.html


## 访问地址
[https://lbs.iot-cas.com/zkzc-charts/index.html](https://lbs.iot-cas.com/zkzc-charts/index.html)

## 分支说明
| 分支名称 | 项目 | 备注 |
| --- | --- | --- |
| main | 无 | 主干仅提供npm |
| island | 灯杆云 | 使用submodule |

## 图表类型声明

| 类型     | 类型名    | 外观     | 外观名     | 适用场景                       |
| -------- | --------- | -------- | ---------- | ------------------------------ |
| 柱状图   | bar       | 默认2d   | index      | 一到多维数组                   |
| 柱状图   | bar       | 圆柱     | column     |                                |
| 柱状图   | bar       | 立方体   | cube       | 一维数组，做数据对比的二维数组 |
| 柱状图   | bar       | 堆叠图   | stack      |                                |
| 折线图   | line      | 默认     | index      |                                |
| 折线图   | line      | 面积     | area       |                                |
| 饼图     | pie       | 默认2d   | index      |                                |
| 饼图     | pie       | 3d       | solid      |                                |
| 条纹图   | stripe    | 默认     | index      |                                |
| 翻牌器   | flopper   | 默认     | index      |                                |
| 计数器   | counter   | 默认     | index      | 条状计数器                     |
| 计数器   | counter   | 默认     | catalog    | 图标计数器                     |
| 计数器   | counter   | 默认     | catalog    | 奖杯状计数器                   |
| 仪表盘   | dashboard | 默认     | index      |                                |
| 仪表盘   | dashboard | 立体环状 | ring       |                                |
| 占比图   | percent   | 默认     | index      |                                |
| 占比图   | percent   | 水球     | water-ball |                                |
| 文字列表 | list      | 默认     | index      |                                |


# 常用指令

## 安装npm
`npm i @zkzc/zkzc-charts --registry http://192.168.1.106:4873`

## 构建包
本工程使用了rollup作为打包器
```
npm run build
```

## 查看演示
```
npm run api:dev // 本地调试演示页面
npm run api:prod // 构建静态演示页面
```

## 发布包
```
// 1.修改package.js 版本号，更新描述
// 2.发布指令
npm publish --registry=http://192.168.1.106:4873
```

# npm包开发教程

[从零开始发布自己的NPM包](https://juejin.cn/post/7052307032971411463)

[逐步实现组件库打包](https://juejin.cn/post/6990648688590716941)
