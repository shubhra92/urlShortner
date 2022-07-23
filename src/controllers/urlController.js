const urlModel=require("../models/urlModel");
const shortid=require("shortid")
const { create, find } = require("../models/urlModel");
const redis = require("redis");

const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    13517,
  "redis-13517.c212.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("vTkviCAYObTIEVtS0oOgcHhzGwSSKlyY", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);
const SET_EX=promisify(redisClient.setex).bind(redisClient);
const DEFAULT_EXPIRATION=1000;




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
    if(!isValid(longUrl))return res.status(400).send({status:false,message:"Plz provide the url"})

    var regex = /^(http(s)?:\/\/)?(www.)?([a-zA-Z0-9])+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/[^\s]*)?$/gm

    if(typeof longUrl !== 'string') return res.status(400).send({status: false, message: 'The URL must be in string form.'})
    longUrl = longUrl.trim();
    if(!regex.test(longUrl)){ return res.status(400).send({status:false,message:"the url is invalid"})}
  
    let  checkUrl = await GET_ASYNC(`${longUrl}`);
    checkUrl=JSON.parse(checkUrl)
    if(checkUrl){ return res.status(200).send({status:true,message:"this response came from redis",data:checkUrl})}
  
    let checkurl=await urlModel.findOne({longUrl}).select({_id:0,longUrl:1,shortUrl:1,urlCode:1})
    if(checkurl){ await SET_EX(`${checkurl.longUrl}`,  DEFAULT_EXPIRATION, JSON.stringify(checkurl))
    if(!checkUrl){ await SET_EX(`${checkurl.urlCode}`,  DEFAULT_EXPIRATION, JSON.stringify(checkurl))}
    return res.status(200).send({status:true,message:"this is a unique feild and send from database",data:checkurl})
    }


    let urlCode=shortid.generate().toLowerCase();
    let shortUrl="http://localhost:3000/"+urlCode;
    data.urlCode=urlCode;
    data.shortUrl=shortUrl; 
    const createData=await urlModel.create(data);
    let newData=await urlModel.findById(createData._id).select({_id:0,longUrl:1,shortUrl:1,urlCode:1})
    await SET_EX(`${longUrl}`,  DEFAULT_EXPIRATION, JSON.stringify(newData))
    await SET_EX(`${urlCode}`,  DEFAULT_EXPIRATION, JSON.stringify(newData))
   
   
    res.status(201).send({data:newData});
    }catch(err){return res.status(500).send({status:false,message: err.message})
    }}


const getUrl= async function(req,res){
try {
    let urlCode=req.params.urlCode
    let  checkLongUrl = await GET_ASYNC(`${urlCode}`)
    checkLongUrl=JSON.parse(checkLongUrl)
    if(checkLongUrl){return res.status(302).redirect(checkLongUrl.longUrl);}
    let checkUrl=await urlModel.findOne({urlCode})
    if(!checkUrl){ return res.status(404).send({status:false,message:"url not found!"})}
    await SET_EX(`${urlCode}`,  DEFAULT_EXPIRATION, JSON.stringify(checkUrl));
    res.status(302).redirect(checkUrl.longUrl);

    } catch (error) {
    return res.status(500).send({status:false,message: error.message})
    
    }
    }



module.exports={createUrl,getUrl}
