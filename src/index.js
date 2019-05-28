//@ts-check
/*----------------------------------------------------------------------------------
|   Project     :-  Chat Application                                                |
|   Start Date  :-  11 March 2019                                                   |
|   source      :-  Udemy                                                           |
------------------------------------------------------------------------------------*/                   

/*---------------------------------------------------------------------------------------------------------------------------------------------
                                   
                                            LIBRARY AND LOCAL MODULES IMPORTS

---------------------------------------------------------------------------------------------------------------------------------------------*/

const express = require('express');
const path = require('path'); //core module
const http = require('http'); //core module
const socketio = require('socket.io');
const {generateMessage,generateLocation} = require('./utils/message.js') ;//user-defined module
const {addUser,removeUser,getUser,getUserInRoom} = require('./utils/user.js') // user-defined module
//const {generateLocation} = require('./utils/message.js'); //

/*_____________________________________________________________________________________________________________________________________________

                                        SETTING APP AND MIDDLEWARE

--------------------------------------------------------------------------------------------------------------------------------------*/
const app = express();

//internally express (work) create server like this. Here we are not changing 
//behaviour of program, we just changing the method, using the core functionality 
//of node to create server
const server = http.createServer(app);
const io = socketio(server);


let PORT = process.env.PORT || 3000;
let publicDirectoryPath = path.join(__dirname,'../public');


app.use(express.static(publicDirectoryPath))


io.on('connection',(socket)=>{
    console.log('New web socket connected');

    socket.on('join',({username,room},callback)=>{

        let user = addUser({id:socket.id,username,room});
        
        if(user.error)
        {
            return callback(user.error);
        }
        socket.join(user.room);
        
        //second parameter always catched in callback by listener
        // socket.emit('message','Welcome');

        //Now instead of sending a 'welcome' we are sending a function which is defined at src/utils/message.js
        //Actually message.js is a user-defined library, so we import it @ line 18
        socket.emit('message',generateMessage('welcome','Admin'));

        //send event to everyone except socket client
        socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined`,'Admin'));
        
        io.to(user.room).emit('roomData',{
            room:user.room,
            userList: getUserInRoom(user.room)
        });
        return callback();
    });


    socket.on('sendMessage',(text,callback) =>{
        let user = getUser(socket.id);
        if (user)
         {
            //let getuser = user.getUser(socket.id);
            io.to(user.room).emit('message',generateMessage(text,user.username));
            callback('delivered');
        }
        
    });
    
    socket.on('sendLocation',(loc,callback) =>{
        let user = getUser(socket.id);
        if(user)
        {
             //second parameter always catched in callback by listener
            io.to(user.room).emit('locationMessage',generateLocation(`https://google.com/maps?q=${loc.latitude},${loc.longitude}`,user.username));
            callback('delivered');
        }
       
    });

    socket.on('disconnect',() =>{
        const user = removeUser(socket.id);
        if(user)
        {
            //second parameter always catched in callback by listener
            io.to(user.room).emit('message',generateMessage(`${user.username}  left`,user.username));
        }
        io.to(user.room).emit('roomData',{
            room:user.room,
            userList: getUserInRoom(user.room)
        });
        
    })
});


//app.listen(PORT, () =>{ console.log(`Servar is up on port ${PORT}`); })

//now using server(core module) instead of app (express)
server.listen(PORT, () =>{ console.log(`Servar is up on port ${PORT}`); })

