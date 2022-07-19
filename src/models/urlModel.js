const mongoose= require("mongoose")
//const validator = require("validator");

//require('mongoose-type-url')

const urlSchema= new mongoose.Schema({
 urlCode:{
    type: String,
    require:true,
    unique:true,
    lowercase:true,
    trim:true

 },
 longUrl:{
    type: String,
    require:true,
 },
 shortUrl:{
    type:String,
    require:true,
    unique:true
 },
},{timestamps:true})
module.exports=mongoose.model("Url",urlSchema);
