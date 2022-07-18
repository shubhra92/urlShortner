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
//     validate:{ validator: validator.isUrl,
//     message: "{VALUE} is not a valid url",
//     isAsync: false, 
//  }},
 },
 shortUrl:{
    type:String,
    require:true,
    unique:true
 },
},{timeStamps:true})
module.exports=mongoose.model("Url",urlSchema);
