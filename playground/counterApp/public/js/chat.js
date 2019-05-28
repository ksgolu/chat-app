const socket = io(); //initializating socket.io or socket.io constructor;
socket.on('countUpdated',(count) => { //receiving event from server
    console.log('the counter has been updated',count);
})

document.querySelector('#increment').addEventListener('click',() =>{
socket.emit('increment'); // sending event to server
});