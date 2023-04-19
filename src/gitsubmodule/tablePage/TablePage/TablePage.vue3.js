
import { ref, reactive } from 'vue'
const filter = {
    pageSize: 10, // 每页条数
    pageNum: 1, // 当前页
    rowTotal: 0, // 总条数
    sortName: '',
    sortOrder: '',
    pageSizes: [10, 20, 50, 100]
}

const self = {
    multiData: ref([]),
    tableSelectAll: ref(false),
    filter: reactive(filter),
    getData() {

    },
    tableSelectionChange(selection) {
        // console.log('选择项改变', selection)
        self.multiData.value = selection
    },
    sizeChange(val) {
        self.filter.pageSize = val
        self.filter.pageNum = 1
        //   console.log('每页条数改变', val)
        self.getData()
    },
    currentChange(val) {
        // console.log('页码改变', val)
        self.filter.pageNum = val
        self.getData()
    },
    sortChange({ column, prop, order }) {
        console.log('列排序为', prop, order)
        if (!order) {
            self.filter.sortOrder = ''
            self.filter.sortName = ''
        } else {
            self.filter.sortOrder = order === 'ascending' ? 'ASC' : 'DESC'
            self.filter.sortName = prop
        }
        self.getData()
    },
    tableSelectAllStatus(value) {
        self.tableSelectAll.value = value
    },
    // 表头改变时，记录用户操作
    async setTableKeys(tableIndex) {
        // let id = self.$refs.table.id
        console.log('表头选择改变(js)', tableIndex)
    },
    headerDragend(Arguments) {
        console.log('表头拖拽', Arguments)
    },
    /**
             * ================================查询=================================
             */
    search(data) {
        let pageNum = self.filter.pageNum
        let pageSize = self.filter.pageSize
        let rowTotal = self.filter.rowTotal
        self.filter = self.$options.data().filter
        self.filter.pageNum = pageNum
        self.filter.pageSize = pageSize
        self.filter.rowTotal = rowTotal

        for (let i in data) {
            self.filter[i] = data[i]
        }
        self.filter.pageNum = 1
        self.getData()
    },
    /**
             *@Description:查询重置
             */
    resetSearch() {
        self.filter.pageNum = 1
        self.filter.sortName = ''
        self.filter.sortOrder = ''
        self.getData()
    }
}

export default self