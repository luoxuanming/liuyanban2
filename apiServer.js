const express=require("express");
const router=express.Router();
const db = require("./schema.js");
const formidable=require("formidable");
const fs=require("fs");

var resOthersId;
//请求首页
router.get("/",(req,res)=>{
//	console.log(req.query.OthersId);
	resOthersId=req.query.OthersId;
	db.CommentTable.find({},(err,data)=>{
		res.render("index",{array:data},(err,data)=>{
			if(err){
				console.log(err);
				return;
			}
			res.end(data);
		})
	});
//	fs.readFile("./photo.html",(err,data)=>{
//		res.end(data);
//	})
})

//登录
router.post("/register",(req,res)=>{
	db.userData.find({"Username":req.body.username},(err,data)=>{
		if(err){
			console.log(err);
			return;
		}
		if(data.length){
			res.end(JSON.stringify({code:0}));
			return;
		}else{
			db.userData.create({"Username":req.body.username,"Password":req.body.password,"Avatorurl":"./images/default.jpg"},(err,data)=>{
				if(err){
					console.log(err);
					return;	
				}
				res.end(JSON.stringify({code:1,username:req.body.username}));
			})
		}
	})
});

//注册
router.post("/login",(req,res)=>{
	db.userData.find({"Username":req.body.username,"Password":req.body.password},(err,data)=>{
		if(err){
			console.log(err);
			return;
		}
		if(!data.length){
			res.end(JSON.stringify({code:0}));
			return;
		}else{
			res.end(JSON.stringify({code:"ok","username":req.body.username,Avatorurl:"./images/default.jpg"}));
		}
		
	});
});

//更换头像
var username;
router.post("/photo",(req,res)=>{
//	console.log(req.body.username);
	username=req.body.username
	let form=formidable.IncomingForm();
	form.parse(req,(err,fields,files)=>{
		console.log(username);
//		let reader = fs.createReadStream(files.photo.path);
//      let writer = fs.createWriteStream("./public/avator/"+files.photo.name);
//      reader.pipe(writer);
//		var Avatorurl="./public/avator/"+files.photo.name;
//		console.log(Avatorurl);
//		//更新数据表
//		db.userData.find({"Username":username},(err,data)=>{
//			if(err){
//				console.log(err);
//				return;
//			}
//			db.userData.update({"Username":username},{"$set":{"Avatorurl":Avatorurl}},(err,data)=>{
//				if(err){
//					console.log(err);
//					return;
//				}
////				res.end(Avatorurl);
//				console.log(data);
//			});
//		});
	});
});

//支持
router.post("/support",(req,res)=>{
	console.log(req.body);
	db.CommentTable.find({"_id":req.body.OthersId},(err,data)=>{
		if(err){
			console.log(err);
			return;
		}
		var support=data[0].support+1;
		db.CommentTable.update({"_id":req.body.OthersId},{"$set":{"support":support}},(err,data)=>{
			if(err){
				console.log(err);
				return;
			}
			res.end(support.toString());
		});
		
	});
});

//反对
router.post("/unlike",(req,res)=>{
	db.CommentTable.find({"_id":req.body.OthersId},(err,data)=>{
		if(err){
			console.log(err);
			return;
		}
		var unlike=data[0].unlike+1;
		console.log(unlike);
		db.CommentTable.update({"_id":req.body.OthersId},{"$set":{"unlike":unlike}},(err,data)=>{
			if(err){
				console.log(err);
				return;
			}
			res.end(unlike.toString());
		});
		
	});
});

//喜欢
router.post("/like",(req,res)=>{
	db.CommentTable.find({"_id":req.body.OthersId},(err,data)=>{
		if(err){
			console.log(err);
			return;
		}
		var like=data[0].like+1;
		console.log(like);
		db.CommentTable.update({"_id":req.body.OthersId},{"$set":{"like":like}},(err,data)=>{
			if(err){
				console.log(err);
				return;
			}
			res.end(like.toString());
		});
		
	});
});

//评论回复
router.post("/res",(req,res)=>{
	console.log(req.body.OthersId);
		db.CommentTable.find({"_id":req.body.OthersId},(err,data)=>{
//			console.log(data[0].response);
			data[0].response.push(
				{
					OthersId:req.body.OthersId,
					username:req.body.username,
					publishtime:req.body.publishtime,
					Avatorurl:req.body.Avatorurl,
					content:req.body.content,
					support:req.body.support,
					unlike:req.body.unlike,
					like:req.body.like
				}
			);
			db.CommentTable.update({"_id":req.body.OthersId},{"$set":{response:data[0].response}},()=>{
				db.CommentTable.find({"_id":req.body.OthersId},(err,data)=>{
//					console.log(data[0].response);
					res.json(data);
				})
			})
		})
});

//更新留言板
router.get("/update.html",(req,res)=>{
//	console.log(resOthersId);
	db.CommentTable.find({"_id":resOthersId},(err,data)=>{
		console.log(data[0].response);
		res.render("update",{array:data[0].response,otherId:resOthersId},(err,data)=>{
			if(err){
				console.log(err);
				return;
			}
			res.end(data);
		});
	});
});

//发表留言
router.post("/publish",(req,res)=>{
	db.CommentTable.create({"Username":req.body.username,"publishtime":req.body.Ptime,"Avatorurl":req.body.Avatorurl,"content":req.body.content,"support":"0","unlike":"0","like":"0","response":[]},(err,data)=>{
		if(err){
			res.end(JSON.stringify({code:0}));
			return;
		}else{
			res.end(JSON.stringify({code:1}));
		}
	});
});


module.exports = router;