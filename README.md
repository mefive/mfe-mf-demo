# mfe-mf-demo

基于 Module Federation 的微前端 Demo

### 包含以下 package

-   host 静态基座，编译时确定子应用资源地址
-   dynamic-host 动态基座，从配置中心读取配置，动态加载子应用
-   app1 子应用 1
-   app2 子应用 2
-   shared 共享库，可以发 npm 包，也可以当做子应用加载
-   config 配置中心
