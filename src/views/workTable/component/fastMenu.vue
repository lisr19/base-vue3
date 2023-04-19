<template>
    <div class="worktable_wrap">
        <h2 class="worktable_panel_title">快捷菜单</h2>
        <div class="main">
            <el-row :gutter="17">
                <el-col :span="6" v-for="(item,index) in menuList" :key="index">
                    <div class="real">
                        <span class="content" @click="routerLink(item)" :title="(item.cascade?item.cascade+'-':'')+item.caption">{{item.caption}}</span>
                        <div class="del_btn" @click="delItem(item)">
                            <i class="el-icon-error"></i>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="real">
                        <div class="content btn" @click="handleTree">
                            <i class="el-icon-plus"></i> 添加快捷菜单
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-dialog title="选择快捷菜单"  v-model="showTree" width="400px" append-to-body :close-on-click-modal="false" @close="showTree = false">
            <el-tree :data="treeData" :props="defaultProps" show-checkbox node-key="id" @check="handleCheck" :default-checked-keys="defaultChecked"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showTree=false">取 消</el-button>
                <el-button type="primary" size="small" @click="save">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {onMounted,ref,getCurrentInstance} from 'vue'
import { ElMessage } from 'element-plus'
import {useRouter} from 'vue-router'
import Api from '@/api/api'
import {auth } from '@/utils/dgySdk/index'
// 路由
let router = useRouter()
// proxy
const proxy = getCurrentInstance() as any

let showTree = ref<boolean>(false)
const treeData = ref<Recordable[]>([])
interface treeDefaultProps {
    children:string,
    label:string
}
const defaultProps = ref<treeDefaultProps>({
    children: 'children',
    label: 'name'
})
const menuList = ref<Recordable>([])
const checkedNodes = ref<Recordable>([])
const defaultChecked = ref<Recordable>([])

onMounted(()=>{
    getData()
    treeData.value = auth.menuData()

})
const handleTree=()=>{
  showTree.value = true
}
const routerLink = (data:Recordable) =>{
    let { menuId, caption, openType, url, cascade } = data
    router.push(url)
    // 记录访问过的地址

    let params = {
        cascade,
        caption,
        appName: 'pc',
        menuId,
        openType,
        url
    }
    let headers = { hideNotify: true }
    Api().WorkBenchController.post_recent.request({
        data: params,
        headers
    })
}
const getData = ()=> {
    Api()
        .WorkBenchController.get_quick.request()
        .then((res:Recordable) => {
            res = res || []
            res.sort((a:Recordable, b:Recordable) => {
                return parseInt(a.position) - parseInt(b.position)
            })
            checkedNodes.value = menuList.value = res
            defaultChecked.value = res.map((v:Recordable) => v.menuId)
        })
}
const handleCheck =(tag:any, data:Recordable) =>{
    let filters = data.checkedNodes.filter((v:Recordable) => {
        return !v.children || !v.children.length
    })
    checkedNodes.value = filters.map((v:Recordable, index:number) => {
        let { id, name, openType, path, parentNmae } = v
        return {
            cascade: parentNmae,
            caption: name,
            appName: 'pc',
            menuId: id,
            openType,
            url: path,
            position: index + 1
        }
    })
}
const delItem = (data:Recordable) => {
    let index = menuList.value.findIndex((v:Recordable) => v.menuId === data.menuId)
    menuList.value.splice(index, 1)
    menuList.value.forEach((v:Recordable, index:number) => {
        v.position = index + 1
    })
    Api()
        .WorkBenchController.post_quick.request({ data: menuList.value })
        .then(() => {
            showTree.value = false
            getData()
        })
}
const save = () => {
    if (checkedNodes.value.length > 11) {
        ElMessage({
            message: '超过最大数量了',
            type: 'warning',
            duration: 1500
        })
        return
    }
    Api()
        .WorkBenchController.post_quick.request({ data: checkedNodes.value })
        .then(() => {
            showTree.value = false
            getData()
        })
}

</script>

<style lang="scss" scoped>
.main {
  padding: 24px;
  .tip {
    font-size: 14px;
    color: #4b5869;
    margin-bottom: 8px;
  }
  .content {
    display: block;
    height: 36px;
    line-height: 36px;
    padding-left: 16px;
    margin-bottom: 16px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .real {
    position: relative;
    color: #0c1014;
    font-size: 14px;
    background-color: #f4f5f8;
    border-radius: 4px;
    .del_btn {
      display: none;
      position: absolute;
      right: -13px;
      top: -10px;
      font-size: 20px;
      color: #c3c5ce;
      cursor: pointer;
      height: 22px;
      line-height: 22px;
      &:hover {
        color: #adadad;
      }
    }
    &:hover {
      background-color: #345ef0;
      color: #fff;
      .del_btn {
        display: block;
      }
    }
  }
}
</style>
