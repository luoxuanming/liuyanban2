const express=require("express");
const xtpl=require("xtpl");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
//连接mongo数据库
mongoose.connect("mongodb://60.205.218.56:27017/lxm");

//初始化实例
const app=express();

app.set("views","./public/view");
app.set("view engine","html");
app.engine("html",xtpl.renderFile);

app.use(express.static("./public"));
app.use(bodyParser());

app.use(require("./apiServer.js"));
app.use("/api",require("./apiServer.js"));
app.use("/update.html",require("./apiServer.js"));

app.listen(8080,()=>{
	console.log("后台服务器已开启！")
});
