const express = require('express')
const path = require('path')
const http = require('http')
const sock = require('socket.io')
const sendMessage = require('./dao').sendMessage
const listMessages = require('./dao').listMessages
const model = require('./model')
const loginCreateUser = require('./dao').registerOrLogin


const app = express();
// express serving
app.use(express.static(path.join(__dirname, "public")))

const server = http.createServer(app) 

io = sock(server);


// sockets connectivity
io.on('connection', async (socket)=>{
        
    socket.on('login', async (username, password, callBack)=>{
         const user = new model.User(username, password);
         try{
            const respo = await loginCreateUser(user.username, user.getPassword())
            const messages = await listMessages()
            
            callBack({loggedIn:true, messages:messages})
           
            // console.log(respo)
           
         }catch(e){
             
            callBack({message:e})

         }


    })
    socket.on('chat', message=>{
        // const user = new model.User(message.user);
        const theMessage = new model.Message(message.user,message.message);
        // console.log(theMessage)

        socket.broadcast.emit('message', theMessage)

        sendMessage(theMessage)
    })
})

const port = process.env.PORT || 3031

server.listen(port, ()=>{
    console.log("visit : http://localhost:"+port)
})



module.exports = server



