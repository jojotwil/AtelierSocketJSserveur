var express= require("express")
var router= express.Router()
const { showChats }= require('../controller/chatService')
router.get('/', showChats)
module.exports= router