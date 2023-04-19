import BarIndex from './components/bar/index.vue'
import BarCube from './components/bar/cube.vue'
import BarColumn from './components/bar/column.vue'
import BarStack from './components/bar/stack.vue'

import PieIndex from './components/pie/index.vue'
import PieSolid from './components/pie/solid.vue'

import LineIndex from './components/line/index.vue'
import LineArea from './components/line/area.vue'

import CounterIndex from './components/counter/index.vue'
import CounterCatalog from './components/counter/catalog.vue'

import MeterIndex from './components/meter/index.vue'
import MeterRing from './components/meter/ring.vue'

import PatternIndex from './components/pattern/index.vue'

const components = [
  BarIndex,
  BarCube,
  BarColumn,
  BarStack,
  PieIndex,
  PieSolid,
  LineIndex,
  LineArea,
  CounterIndex,
  CounterCatalog,
  MeterIndex,
  MeterRing,
  PatternIndex
]
const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

// for single js file
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// to allow use as module
export default { install }

export {
  BarIndex,
  BarCube,
  BarColumn,
  BarStack,
  PieIndex,
  PieSolid,
  LineIndex,
  LineArea,
  CounterIndex,
  CounterCatalog,
  MeterIndex,
  MeterRing,
  PatternIndex
}

