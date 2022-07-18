const urlModel=require("../models/urlModel");
const shortid=require("shortid")
const validator=require("validator")

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

    //var regex = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    var regex = /^(http(s)?:\/\/)?(www.)?([a-zA-Z0-9])+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/[^\s]*)?$/gm

    if(!regex.test(longUrl)){ return res.status(400).send({status:false,message:"the url is invalid"})}
  

    let checkUrl=await urlModel.findOne({longUrl})

   
    if(checkUrl){ return res.status(400).send({status:false,message:"the url already exists, add a new unique url"})}
    let urlCode=shortid.generate();console.log(urlCode);
    let shortUrl="http://localhost:3000/"+urlCode;
    data.urlCode=urlCode;
    data.shortUrl=shortUrl;
    const createData=await urlModel.create(data)
    res.status(201).send({status:true,data:createData});


}catch(err){return res.status(500).send({status:false,message: err.message})
}}




// ### POST /url/shorten
// - Create a short URL for an original url recieved in the request body.
// - The baseUrl must be the application's baseUrl. Example if the originalUrl is http://abc.com/user/images/name/2 then the shortened url should be http://localhost:3000/xyz
// - Return the shortened unique url. Refer [this](#url-shorten-response) for the response
// - Ensure the same response is returned for an original url everytime
// - Return HTTP status 400 for an invalid request
// ### Url shorten response
// ```yaml
// {
//   "data": {
//     "longUrl": "http://www.abc.com/oneofthelongesturlseverseenbyhumans.com",
//     "shortUrl": "http://localhost:3000/ghfgfg",
//     "urlCode": "ghfgfg"
//   } 
// }


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
