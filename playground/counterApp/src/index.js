/*----------------------------------------------------------------------------------
|   Project     :-  Chat Application                                                |
|   Start Date  :-  11 March 2019                                                   |
|   source      :-  Udemy                                                           |
------------------------------------------------------------------------------------*/                   

/*---------------------------------------------------------------------------------------------------------------------------------------------
                                   
                                            LIBRARY AND LOCAL MODULES IMPORTS

---------------------------------------------------------------------------------------------------------------------------------------------*/

const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');


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
let publicDirectoryPath = path.join(__dirname,'../public')


app.use(express.static(publicDirectoryPath))

let count = 0;
io.on('connection',(socket)=>{
    console.log('New client connected');

    socket.emit('countUpdated',count); //sending event to specific client(client who made request)

    socket.on('increment', () =>{ //receiving events from specific client
        count++;
        io.emit('countUpdated',count); //sending events to all connected clients.
    })
});


//app.listen(PORT, () =>{ console.log(`Servar is up on port ${PORT}`); })

//now using server(core module) instead of app (express)
server.listen(PORT, () =>{ console.log(`Servar is up on port ${PORT}`); })

