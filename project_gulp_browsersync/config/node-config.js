const {argv} = process;   //node进程  argv是一个数组形式返回  0:nodejs所在路径 1:该项目所在路径 之后2+为服务器外部写入参数
let getpath;
let path;

argv.forEach((item,index)=>{  //遍历argv数组   我们在这里第三个位置写入参数 所以取argv[2]   命令如 node node-main.js test =====> test 为测试环境  product 为生产环境
	if(index == 2){
		path = item;  //把传入的环境参数赋值给path
	}
})

if(path == "product"){   //匹配写入的参数，来按需require该环境的配置文件
	getpath = require("./product.js"); //生产环境的配置文件
}else{
	getpath = require("./test.js");   //测试环境的配置文件
}

module.exports.path = path;   //暴露path变量
module.exports.getpath = getpath;  //暴露getpath变量