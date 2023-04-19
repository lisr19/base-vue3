<template>
  <div class="data-adorn" v-show="isError||isEmpty||isLoading" >
    <div class="error" v-if="isError">
      <i class="el-icon-circle-close"></i>
      <p>图表加载失败</p>
    </div>
    <div class="error" v-if="isEmpty">
      <i class="el-icon-folder-opened"></i>
      <p>当前无数据</p>
    </div>
    <transition name="fade" mode="out-in">
      <loading-index v-if="isLoading"/>
    </transition>
  </div>
</template>

<script>
import LoadingIndex from '../loading/index.vue'
export default {
  name: 'DataAdorn',
  components: {
    LoadingIndex
  },
  props: {
    isError: {
      type: Boolean,
      default: false
    },
    isEmpty: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      theme: {}
    }
  },
  created(){
    // this.theme = Object.freeze(this.getChartStyle())
  },
  mounted () {
  },
  methods: {}
}
</script>

<style lang="scss" type="text/scss">
.data-adorn {
  position: absolute;
  z-index: 9;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255,255,255,0.8);
  text-align: center;
}
</style>
