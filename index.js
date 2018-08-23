
const mongoose = require("mongoose");
mongoose.connect("mongodb://60.205.218.56:27017/dada");
let schema = mongoose.Schema({
    id:Number,
    name:[{
        age:Number,
        info:String
    }]
})
let user = mongoose.model("user",schema);
user.create({id:1,name:[{age:16,info:"lisi"},{age:16,info:"lisi"}]},(err,data)=>{
    console.log(data);
})
