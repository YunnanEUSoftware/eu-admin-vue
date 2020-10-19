## eu-admin-vue
基础平台项目针对后台管理系统中的登录、组织架构、权限管理、系统配置等功能给出了解决方案，开箱即用，如有其他业务需求，在此模板上新增即可。

前端项目基于ivew-admin，除了view-design大量用到外，antv与elementUI都是按需引入的，使用时请引入具体组件。


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

## DEMO
待补充