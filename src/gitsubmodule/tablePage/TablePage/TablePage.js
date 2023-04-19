export default {
  data () {
    return {
      multiData: [],
      tableSelectAll: false,
      filter: {
        pageSize: 10, // 每页条数
        pageNum: 1, // 当前页
        rowTotal: null, // 总条数
        sortName: '',
        sortOrder: '',
        pageSizes: [10, 20, 50, 100]
      },
      cacheInit: false
    }
  },
  watch: {
    'tableListData.tableKeys': {
      async handler (val, oldval) {
        // 限制只获取一次缓存
        if (this.cacheInit) {
          return
        }
        // if (this.$refs.table && this.$refs.table.id) {
        //   this.cacheInit = true
        //   let id = this.$refs.table.id
        //   // 表格缓存字段排序
        //   let res = await this.$Api().UserCommonCacheController.get_cache.request(
        //     {
        //       path: { type: `tableIndex_` + id }
        //     }
        //   )
        //   if (!res.content) {
        //     return
        //   }
        //   console.log('获取缓存', res.content.tableIndex.map(v => v.id).join(','), res.content.tableIndex)
        //   console.log('tableIndex变化(js)')
        //   this.$refs.table.setTableKeys(res.content.tableIndex)
        // }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    tableSelectionChange (selection) {
      // console.log('选择项改变', selection)
      this.multiData = selection
    },
    sizeChange (val) {
      this.filter.pageSize = val
      this.filter.pageNum = 1
      //   console.log('每页条数改变', val)
      this.getData()
    },
    currentChange (val) {
      //   console.log('页码改变', val)
      this.filter.pageNum = val
      this.getData()
      },
    sortChange ({ column, prop, order }) {
      console.log('列排序为', prop, order)
      if (!order) {
        this.filter.sortOrder = ''
        this.filter.sortName = ''
      } else {
        this.filter.sortOrder = order === 'ascending' ? 'ASC' : 'DESC'
        this.filter.sortName = prop
      }
      this.getData()
    },
    tableSelectAllStatus (value) {
      this.tableSelectAll = value
    },
    // 表头改变时，记录用户操作
    async setTableKeys (tableIndex) {
      let id = this.$refs.table.id
      console.log('表头选择改变(js)', tableIndex, id)
      if (id) {
        // await this.$Api().UserCommonCacheController.post_cache.request({
        //   data: {
        //     type: `tableIndex_` + id,
        //     content: {
        //       tableIndex
        //     }
        //   },
        //   headers: {
        //     hideNotify: true,
        //     hideLoading: true
        //   }
        // })
      }
      },
      headerDragend(Arguments) {
          console.log('表头拖拽', Arguments)
      },
    /**
             * ================================查询=================================
             */
    search (data) {
      let pageNum = this.filter.pageNum
      let pageSize = this.filter.pageSize
      let rowTotal = this.filter.rowTotal
      this.filter = this.$options.data().filter
      this.filter.pageNum = pageNum
      this.filter.pageSize = pageSize
      this.filter.rowTotal = rowTotal

      for (let i in data) {
        this.filter[i] = data[i]
      }
      this.filter.pageNum = 1
      this.getData()
    },
    /**
             *@Description:查询重置
             */
    resetSearch () {
      let pageNum = this.filter.pageNum
      let pageSize = this.filter.pageSize
      let rowTotal = this.filter.rowTotal
      this.filter = this.$options.data().filter
      this.filter.pageNum = pageNum
      this.filter.pageSize = pageSize
      this.filter.rowTotal = rowTotal
      this.getData()
    }
  }
}
