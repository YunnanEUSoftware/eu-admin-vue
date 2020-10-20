<p align="center"><img src="https://github.obs.cn-north-1.myhuaweicloud.com/static/logo.png" title="" width="250px" /> </p>

<h1 align="center">eu-admin-vue</h1>
基础平台项目针对后台管理系统中的登录、组织架构、权限管理、系统配置等功能给出了解决方案，开箱即用，如有其他业务需求，在此模板上新增即可。

前端项目基于ivew-admin，除了view-design大量用到外，antv与elementUI都是按需引入的，使用时请引入具体组件。

![License](https://img.shields.io/npm/l/package.json.svg?style=flat) ![](https://img.shields.io/badge/2.5.10-vue-brightgreen) ![](https://badgen.net/badge/icon/Ant%20Design?icon=https://gw.alipayobjects.com/zos/antfincdn/Pp4WPgVDB3/KDpgvguMpGfqaHPjicRK.svg&label) ![](https://img.shields.io/badge/-iView%20Admin-blue) ![](https://img.shields.io/badge/chart-ECharts-brightgreen) ![](https://img.shields.io/badge/4.0.0-view--design-green) ![](https://img.shields.io/badge/1.6.5-ant--design--vue-green) ![](https://img.shields.io/badge/2.13.0-element--ui-green) ![](https://img.shields.io/badge/0.18.1-axios-yellowgreen)

<p><img src="https://github.obs.cn-north-1.myhuaweicloud.com/static/CHRS.png" title="" /> </p>

* 预览：https://demo.yneusoft.com/hroStaffPc/login?companyCode=null
* 公司官网：http://www.yneusoft.com/

## 快速开始
>方法一 

从GitHub直接获取代码，使用如下命令获取最新代码

`git clone https://github.com/YunnanEUSoft/eu-admin-vue.git`

然后进入项目根目录

```
cd eu-admin-vue
```

安装依赖并运行项目

```javascript
npm install
npm run dev
```


>方法二

使用npm安装脚手架

```
npm install -g eu-admin-cli
```

查看模板列表

```javascript
$ eusoft list

可用的模版列表：

  ★  eu-admin-server - null
  ★  eu-admin-vue - 基础平台项目
```

创建项目

```javascript
$ eusoft init

? 请选择模版
  eu-admin-server
> eu-admin-vue

? 请选择模版 eu-admin-vue
? 请输入项目名字 // 输入你的项目名称

 开始生成项目，请等待...

  √ admin-test 项目生成完毕!

 cd admin-test && npm install
```

运行项目

```
npm eun dev
```

## 资源链接
* <p><a href="http://admin.iviewui.com/home">iVew-admin</a></p>
* <p><a href="https://iviewui.com/docs/introduce">iVew UI 组件库</a></p>
* <p><a href="https://www.antdv.com/docs/vue/introduce-cn/">Ant Design Vue 组件库</a></p>
* <p><a href="https://element.eleme.cn/#/zh-CN/component/installation">Element UI 组件库</a></p>
* <p><a href="https://echarts.apache.org/examples/zh/index.html">echarts 图表实例</a></p>
