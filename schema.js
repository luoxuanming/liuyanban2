const mongoose=require("mongoose");

let RegisterSchema=new mongoose.Schema({
	Username:String,
	Password:String,
	Avatorurl:String
});

let publishSchema=new mongoose.Schema({
	Username:String,
	publishtime:String,
	Avatorurl:String,
	content:String,
	support:Number,
	unlike:Number,
	like:Number,
	response:[{
		OthersId:String,
		username:String,
		publishtime:String,
		Avatorurl:String,
		content:String,
		support:String,
		unlike:String,
		like:String
	}]
});

let CommentTable = mongoose.model("CommentTable",publishSchema);
let userData = mongoose.model("userInfo",RegisterSchema);
module.exports={
	CommentTable,
	userData
}
