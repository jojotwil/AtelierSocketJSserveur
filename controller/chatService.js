var socketIo = require('socket.io')
 
﻿function socketIO(server) {
 
    const io = socketIo(server);
       io.on("connection",(socket)=>{
           console.log("user connected with socket id"+socket.id);
           // emit event
           io.emit("msg","msg from serveur")
         })
       
    return io;
   }
 
  function showChats(req,res,next){
    res.render('chats',{ title: 'My chats'})
    }
 
module.exports= { socketIO, showChats }