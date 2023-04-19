import {computed,ref} from 'vue'

const authMap = computed(()=>{
    return (window as any).$SDK.auth.authMap()
})

// 验证用户应有功能权限
export let authTableFunctions = ref([])
      // 所有功能权限
export let allTableFunction = ref<Recordable>([])

export function has(id:string,tag:string='func') {
    return authMap.value[tag] !== undefined &&
      authMap.value[tag][id] !== undefined
}
interface itemAllFn {
    id?:string
}
// 获得表格功能操作栏权限
export function getAuthTableFunctions(allFn:Array<Recordable>){
    let auth:Array<Recordable> = []
      allFn.forEach((item:itemAllFn, i:number) => {
        if (!item.id || has(item.id)) {
          auth.push(allFn[i])
        }
      })
    return auth
}
