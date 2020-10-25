<p align="center">
    <a href="https://github.com/NWYLZW/Quick-D" target="_blank" rel="noopener noreferrer">
        <img width="100" src="https://raw.githubusercontent.com/NWYLZW/Quick-D/master/logo.png" alt="Quick-D logo">
    </a>
</p>
<h1 align="center">Using Quick-D to develop</h1>

## 基于nodejs koa模块，对spring boot的拙劣模仿

* 非侵入式设计

## 如何使用

* 安装cli工具并使用
    * 全局安装
    ```shell script
    yarn gloabal add quick-d-cli
    mkdir project
    cd project
    quick-d-cli init
    # 输入你项目的相关信息
    ```
    * 非全局安装
    ```shell script
    mkdir quick-d
    cd quick-d
    yarn add quick-d-cli
    mkdir project
    cd project
    npx quick-d-cli init
    # 输入你项目的相关信息
    ```

* 启动项目
```shell script
npm run dev
```

* 浏览器访问 [hello world](http://localhost:12333/home/hello)

* 打包项目并运行
```shell script
npm run build
npm run production
```
