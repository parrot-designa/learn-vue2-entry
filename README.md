🔥从零手写vue2 - 窥探入口 && 源码构建

[专栏文章一 - 🔥从零手写vue2 - 虚拟节点以及createElement函数](https://juejin.cn/post/7421103437607370806)

[专栏文章二 - 🔥从零手写vue2 - template模板解析](https://juejin.cn/post/7427468776995012627)

[专栏文章三 - 🔥从零手写vue2 - 源码目录结构](https://juejin.cn/spost/7428128754571116583)

本专栏是打算从零手写一个 vue2，并学习 vue2 中的一些核心理念。

目前我们已经实现了下面的目录。

```js
my-vue2
├─shared
|   └util.js 
├─platforms
|     ├─web
|     |  ├─compiler
|     |  |    └index.js
├─core
|  ├─vdom
|  |  ├─create-element.js
|  |  └vnode.js
|  ├─util
|  |  ├─index.js
|  |  └lang.js
├─compiler
|    ├─index.js
|    ├─parse
|    |   ├─html-parser.js
|    |   └index.js
|    ├─codegen
|    |    └index.js
```

# 一、Full（带编译器） && Runtime-Only（不带编译器） 模式

## 1.1 打包文件的讲究

在上一节课中，我们熟悉了 vue源码中的代码结构。

其中我们介绍了几个入口文件：

1. `entry-runtime.ts`
2. `entry-runtime-with-compiler.ts`
3. `entry-runtime-esm.ts`
4. `entry-runtime-with-compiler-esm.ts`

在我们开发项目结束后，最终部署到线上需要进行打包。

通常我们打包时需要一个入口文件，然后通过 webpack 递归文件进行依赖分析然后打包。

其实框架也一样，需要一个入口文件进行打包生成 js文件方便我们进行使用。

> vue是使用rollup进行打包的。
>
> 为了方便用户进行使用，vue在打包时根据`开发环境`和`开发模式`打包出了不同功能的文件，适用于不同的使用场景。

![a](./image.png)

总共打包生成 12 个文件，这些文件可以适用于不同的场景。

1. 打包的文件分为Full和Runtime-Only 2个版本。Full版本包含```编译器和运行时```的全部功能。Runtime-Only 仅含```运行时功能```。
2. 打包的文件根据使用场景分为 esm、cjs、umd三个版本。其中umd可以通过`<script>`标签引入直接在浏览器中使用，Vue会暴露一个全局变量 Windows.Vue。而 CommonJS适配`const Vue = require('vue')`这种 node式的模块系统。ES则适配`import Vue from 'vue'`这种es6格式。
3. 打包的文件根据环境分为 dev/prod，在开发环境中可以使用 dev版本的 js文件，而部署到客户生产环境就可以使用 prod版本的 js文件。 dev版本的文件有一些提示，会在开发者开发时便于调试。


## 1.2 带编译器版本的 vue到底是什么意思？

所谓编译器，就是在 vue内部的编译器可以将模板转化为对应的render函数。

就是我们在[专栏第二节](https://juejin.cn/post/7427468776995012627)实现的模板编译。

因为编译器代码体积比较大，而且如果在运行的时候进行模板编译，可能会消耗性能。

所以我们一般在开发项目时，在 webpack预编译阶段，就将`.vue文件`编译成render函数，在运行时直接运行 render函数就可以获取到对应的 vnode。

> 通过 runtime-only 和 esm很容易推测出来我们项目在开发阶段中使用的是`vue.runtime.esm.js`

## 1.3 是用 Full 还是用 Runtime-only ？

这需要依据具体情况进行具体分析。

倘若你需要用到 Vue 所提供的 html 模板功能，那就选用 Full 版本。

反之，最好采用 Runtime-only 版本，原因在于它比 Full 版本的文件体积大约小 30%。

值得一提的是，*.vue 单文件组件会被 vue-loader 直接构建成为 JavaScript，并未使用到 Vue 的编译器，所以可以使用 Runtime-only 版本。