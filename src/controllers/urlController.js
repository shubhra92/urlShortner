const urlModel=require("../models/urlModel");
const shortid=require("shortid")
const validator=require("validator");
const { create, find } = require("../models/urlModel");

const isValid=(value)=>{
    if(typeof value === 'undefined' || value ===null)return false
    if(typeof value ==='string' && value.trim().length==0)return false
    return true
}
const createUrl= async function(req,res){
    try{
    let data=req.body;
    if(!Object.keys(data).length)return res.status(400).send({status:false,message:"Plz provied the url with key longUrl"})
    let {longUrl}=data;
    if(!isValid(longUrl))return res.status(400).send({status:false,message:"Plz provied the url"})

    var regex = /^(http(s)?:\/\/)?(www.)?([a-zA-Z0-9])+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/[^\s]*)?$/gm

    if(!regex.test(longUrl)){ return res.status(400).send({status:false,message:"the url is invalid"})}
  

    let checkUrl=await urlModel.findOne({longUrl})

   
    if(checkUrl){ return res.status(400).send({status:false,message:"the url already exists, add a new unique url"})}
    let urlCode=shortid.generate();
    let shortUrl="http://localhost:3000/"+urlCode;
    data.urlCode=urlCode;
    data.shortUrl=shortUrl; 
    const createData=await urlModel.create(data);
    let newData=await urlModel.findById(createData._id).select({_id:0,longUrl:1,shortUrl:1,urlCode:1})
  
    res.status(201).send({status:true,data:newData});
    }catch(err){return res.status(500).send({status:false,message: err.message})
    }}


const getUrl= async function(req,res){
try {
    let urlCode=req.params.urlCode
    let checkUrl=await urlModel.findOne({urlCode})
    if(!checkUrl){ return res.status(404).send({status:false,message:"url not found!"})}
    

    res.status(302).redirect(checkUrl.longUrl);

    } catch (error) {
    return res.status(500).send({status:false,message: error.message})
    
    }
    }



module.exports={createUrl,getUrl}
