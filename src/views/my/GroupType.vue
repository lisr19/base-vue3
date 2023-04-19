<template>
  <el-dialog :title="title" :visible="true" :append-to-body="true" :close-on-click-modal="false" @close="$emit('close')" width="600px" top="15vh" class="linkageConfig">
    <el-form ref="form" :rules="rules" :model="form" label-width="110px">
      <el-form-item label="分组名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    deviceTypeCode: {
      type: String,
      default: ''
    },
    deviceTypeEnum: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  // watch: {
  //   data (val) {
  //     this.$nextTick(() => {
  //       console.log('val',val)
  //       this.form = {
  //         id: val.id,
  //         name: val.deviceTypeName,
  //         remark: val.remark
  //       }
  //     })
  //   }
  // },
  computed: {
    title () {
      return this.form.id ? '编辑分组' : '新增分组'
    },
  },
  mounted () {
    this.$nextTick(() => {
      console.log('val', this.data)
      // 二级
      if (this.data && this.data.deviceTypeEnum) {
        this.form = {
          id: this.data.id,
          name: this.data.name,
          remark: this.data.remark
        }
      }
    })
  },

  data () {
    return {
      form: {
        id: '',
        name: '',
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入分组名称', trigger: 'blur' },
          { min: 2, max: 30, message: '名称长度在2到30个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    save () {
      let pass
      this.$refs['form'].validate((valid) => {
        if (valid) {
          pass = true
        } else {
          return false
        }
      })
      if (!pass) {
        return
      }
      let data = {
        name: this.form.name,
        remark: this.form.remark,
        deviceTypeCode: this.deviceTypeCode,
        deviceTypeEnum: this.deviceTypeEnum
      }
      let request = window.$Api().GroupManageController.post_group
      // 编辑时
      let path = {}
      if (this.form.id) {
        data = JSON.parse(JSON.stringify(this.form))
        request = window.$Api().GroupManageController.put_group
        path = {
          id:this.form.id
        }
      }
      request.request({
        data,
        path
      }).then((res) => {
        this.$emit('close')
        this.$emit('refreshTree', this.deviceTypeCode)
      })
    }
  }
}
</script>

<style>
</style>
