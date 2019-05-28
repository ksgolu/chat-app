window.onload = () =>{
const socket = io();

//getting all elements from html
let form = document.getElementById('form');
let sendBtn = document.getElementById('sendBtn');
const locationBtn = document.getElementById('share-location');
const $blankSpace = document.getElementById('messageSpace');
const $sidebar = document.querySelector('#sideBar');

//getting all templets from html
const messageTemplate = document.getElementById('message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const roomTemplate = document.querySelector('#room-template').innerHTML;


//getting string from browser address bar and parsing it with 3rd paty module QS
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true});
console.log(username,room);

//event handler for message
socket.emit('join',{username,room},(error) =>{
    if(error)
    {
        location.href='/'; 
        return alert(error)
    }
});

socket.on('roomData',(roomData) =>{

    //console.log(roomData);
    let html = Mustache.render(roomTemplate,{
        roomName: roomData.room,
    user:roomData.userList
    });
    $sidebar.innerHTML = html;
});

const autoscroll = () =>{
   //getting new message from $blnakspace
   const $newMessage = $blankSpace.lastElementChild; 

   //height of the new message
    const newMessageStyle = getComputedStyle($newMessage); //getting css property of new message element
    const newMessageMargin = parseInt((newMessageStyle.marginBottom)); //now getting css marginBottom property
 console.log('newMsgMargin',newMessageMargin);
 
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin; //Adding viewable height + new message margin
   console.log('newMessageOffset', $newMessage.offsetHeight)
    console.log('newMessageHeight',newMessageHeight);
   

    //visible height
     /*The offsetHeight property returns the viewable height of an element in pixels, including padding, border and scrollbar, but not the margin */    
    const visibleHeight = $blankSpace.offsetHeight; 
    console.log('visibleHeight',visibleHeight);
    //height of blankspace container
    const containerHeight = $blankSpace.scrollHeight;
    console.log('containerHeight',containerHeight);
    //how far i have scrolled
    const scrollOffset = $blankSpace.scrollTop + visibleHeight;
    console.log('blankSpaceTop',$blankSpace.scrollTop)
    console.log('scrollOffset',scrollOffset)
    if(containerHeight-newMessageHeight <= scrollOffset)
    {
        $blankSpace.scrollTop = $blankSpace.scrollHeight;
    }
}
socket.on('message',(msg) =>{
    
   // console.log(msg);
    //it takes two arguments 1 is a template and 2nd is an object where key is a template injection name
    const html = Mustache.render(messageTemplate,{
        username:msg.username,
        message:msg.text,
        time:moment(msg.createdAt).format('h:mma')});
    
    $blankSpace.insertAdjacentHTML('beforeend',html);
    autoscroll();
})


//event listener for location
socket.on('locationMessage',(mapLocation) =>{
    //console.log(mapURL);
    let html = Mustache.render(locationTemplate,{
        username:msg.username,
        url:mapLocation.mapURL,
        time:moment(mapLocation.createdAt).format('h:mm a'),
    })
    $blankSpace.insertAdjacentHTML('beforeend',html);
    autoscroll();
});

form.addEventListener('submit',(e) =>{
e.preventDefault();
    let text = form.txt.value;
     myMsg = true;
    /*let dv = document.createElement('div');
    dv.style.border = 'solid green 1px'
    dv.style.backgroundColor = 'lime'
    dv.style.width = '50%';
    dv.style.height = 'auto'
    dv.style.margin = '10px';
    //dv.style.cssFloat = 'right'
    dv.innerHTML=`Me: ${text}`;
    space.appendChild(dv);*/

    sendBtn.setAttribute('disabled','disabled'); //disabled the button once the button is clicked
 
    //second parameter of event always catched in callback by listener
     // and here we are excepting a callback from listner
    socket.emit('sendMessage',text,(deliveryReport) =>{      
        sendBtn.removeAttribute('disabled');
        form.txt.value = '';
        form.txt.focus();
        console.log(deliveryReport);
    });
  
});


 document.querySelector('#share-location').addEventListener('click',()=>{
 
    locationBtn.setAttribute('disabled','disabled');
    if(!navigator.geolocation)
    {
        return alert('Geolocation not supported by browser');
    }
    navigator.geolocation.getCurrentPosition((pos)=>{
         //second parameter of event always catched in callback by listener     
        socket.emit('sendLocation', //1st param
         { //2nd param is an object
            latitude:pos.coords.latitude, 
            longitude:pos.coords.longitude
        },
        (deliveryReport)=>{ // and here we are excepting a callback from listner
            locationBtn.removeAttribute('disabled')
            console.log(deliveryReport);
        });
    });
   
   
});
}