const express = require('express');
const router = express.Router();
const {createUrl,getUrl}=require("../controllers/urlController")

router.post("/url/shorten", createUrl)
router.get("/:urlCode", getUrl)

router.all("*",(req,res)=>{
    res.status(404).send({status:false,message:"Page not found! 👽"})
})
module.exports = router;