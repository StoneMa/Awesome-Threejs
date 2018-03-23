# ThreeJSPro
### 本工程实现了三维模型加载，热双击鼠标点动态生成，为热点添加描述，热点随模型旋转，热点信息存入数据库等功能。
##### 鼠标控制
##### 鼠标双击添加热点
##### 热点位置待更新

###使用方法:
* 环境：tomcat7.0+ , JDK1.8, Mysql5.1+, Chrome浏览器 
* ``src``目录下为java后台，需要编译。
* 在数据库创建一个名为annotation的数据库，运行annotation.sql脚本。
* 将编译后的java class 文件按照当前目录和前端文件一起放入到Tomcat webapps目录下。
* 启动tomcat ，访问localhost:8080/项目名/index.html