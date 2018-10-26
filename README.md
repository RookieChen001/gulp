# gulp
gulp通用配置：代理、实时刷新浏览器、静态资源压缩添加版本号、根据测试生产环境读取配置参数  
npm install //安装依赖    
gulp //开发环境执行该默认任务  
gulp test //测试环境执行,会执行node node-main.js test命令读取测试配置文件config下的test.js参数，输出到app\js\common\front-config.js  
gulp product//生产环境执行，会执行node node-main.js product命令读取生产配置文件config下的product.js参数，输出到app\js\common\front-config.js  
文件描述：front-config.js全局配置文件，config全局环境参数文件夹，node-main.js通过node命令写入文件，node-config.js读取文件.  
