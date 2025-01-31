import { warn } from "../util";

function Vue(options) { 
    if(__DEV__ && !(this instanceof Vue)){
        warn('Vue是一个构造函数，你应该使用 “new“ 关键字来调用')
    }
}

// 使用 initMixin 注入了 初始化有关的属性如：Vue.prototype.$init
// 使用 stateMixin 注入了 跟状态有关的属性如：Vue.prototype.$set、Vue.prototype.$watch、Vue.prototype.$delete
// 使用 eventsMixin 注入了 跟事件有关的属性如：Vue.prototype.$on、Vue.prototype.$off、Vue.prototype.$once
// 使用 lifecycleMixin 注入了 跟整个 vue生命周期更新有关的属性如：Vue.prototype.$update
// 使用 renderMixin 注入了 跟渲染相关的属性如：Vue.prototype._render

export default Vue;
  