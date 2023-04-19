const app = new Vue({
  el: '#container',
  data: {
    chartData: {
      name: 'foobar',
      option:{
        series:[{
          data: [78],
          name: '设备在线率',
          suffix: '%'
        }]
      }
    }
  }
})
