<template>
  <div @mouseover="mouseover" @mouseleave="mouseleave">
    <el-input :value="valueTitle" :disabled="disabled" placeholder="请选择" ref="input" class="select-group-tree-input" :size="size">
        <template v-slot:suffix>
            <el-icon v-show="mouse!=='over'" style="cursor: pointer;"><ArrowDown /></el-icon>
            <el-icon v-show="mouse" style="cursor: pointer;" @click="clearInput"><CircleClose /></el-icon>
        </template>
    </el-input>
    <el-popover :virtual-ref="input" :width="inputWidth" trigger="click" ref="popover" v-if="!disabled" v-model:visible="popoverShow" popper-class="SelectGroupTree">
        <el-tree id="tree-option" ref="selectTree" :data="options" :props="props" :node-key="props.value" @node-click="handleNodeClick" :show-checkbox="multiple" @check="handleCheckChange" class="tree"></el-tree>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ElInput } from 'element-plus'
import { watch, onMounted, ref } from 'vue'

const propsObject = defineProps({
    // 配置项
    props:{
        type: Object,
        default: () => {
            return {
            value: 'id', // ID字段名
            label: 'name', // 显示名称
            children: 'children' // 子级字段名
            }
        }
    },
    // 选项列表数据(树形结构的对象数组)
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 当前选中名称
    valueModel: { type: String, default: '' },
    disabled: {
        type: Boolean,
        default:false
    },
    size: {
      type: String,
      default: 'default'
    },
    value: {
      type: String,
      default:''
    },
    dicts: {
      type: Object,
      default:{}
    },
    // 多选模式
    multiple: {
      type: Boolean,
      default: () => {
        return false
      }
    }

})

// const {} = toRefs(props)
const valueModel = ref('')
watch(valueModel,(newValue)=>{
    valueModel.value = newValue
})
const valueTitle = ref(propsObject.valueModel)

watch(()=>propsObject.value,(newValue:string)=>{
    if(newValue){
        valueTitle.value = newValue
    }
},{deep:true})

const valueId = ref('')
const popoverShow = ref(false)
const emit = defineEmits(["getValue"])

// 切换选项
const handleNodeClick = (node:Recordable) => {
    // console.log(node)
    if (node.disabled || propsObject.multiple) {
    return
    }
    valueTitle.value = node[propsObject.props.label]
    valueId.value = node[propsObject.props.value]
    if (!node.children.length) {
    popoverShow.value = false
    }
    emit('getValue', node)
}
const handleCheckChange = (
    data:any,
    { checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys }:any
) => {
    valueTitle.value = checkedNodes.map((v:any) => v.name).join(',')
    valueId.value = checkedKeys
    emit('getValue', checkedNodes)
}

const selectTree = ref<Recordable>({})

// 外部有调用，勿删
const rest = () => {
    valueTitle.value = ''
    valueId.value = ''
    selectTree.value.setCheckedKeys([])
}

const clearInput = () => {
    // this.clickClose = true
    rest()
    emit('getValue', null)
}

const mouse = ref('')

const mouseover = () => {
    mouse.value = 'over'
}
const mouseleave = () => {
    mouse.value = ''
}

const inputWidth = ref(150)
const input = ref<InstanceType<typeof ElInput> | null>()

onMounted(()=>{
    inputWidth.value = input.value?.$el.clientWidth
    setTimeout(() => {
      if (input.value) {
        inputWidth.value = input.value.$el.clientWidth
      }
    }, 1000)
    window.onresize = () => {
      inputWidth.value = input.value.$el.clientWidth
    }
})

</script>
<style lang="scss" rel="stylesheet/scss">
.tree {
  max-height: 300px;
  overflow: auto;
}
.SelectGroupTree {
  padding: 0px !important;
  z-index: 9999 !important;
}
.SelectGroupTree .el-tree-node__content {
  padding: 20px;
}
.none {
  display: none;
}
.select-group-tree-input {
  .el-input__inner {
    cursor: pointer !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.el-input__suffix-inner>:first-child {
    margin-left: 0;
}
</style>
