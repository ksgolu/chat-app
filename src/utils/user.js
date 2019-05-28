//array of object. It will hold an object of users where key is id,username,room
const users=[];

//{id,username,room} is a destructuring not an object see the test case @ line 39
const addUser = ({id,username,room}) =>{ 
    
    //clear the data or making all data equal
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //validating the username and room (shuld not be null)
    if(!username && !room)
    {
        return {error:'usernmae and room is require'}
    }

    //looking for same username and room in users(object array)    
    const existinguser = users.find((user) =>{                  // /*array.find():- Returns the value of the first element in the array 
        return user.username===username && user.room === room;  //where predicate is true, and undefined otherwise.*/

    });

    //if user already in array then return
    if(existinguser)
    {
        return {error:'username is in use'}
    }

    //store user in array (defined above);
    const user = {id,username,room};
    users.push(user);
    return user;
};



const removeUser = (id)=>{
    //indexof takes 1 args but findIndex takes a callback function as argumnet both return the index
    let index = users.findIndex((user)=>user.id === id);
    if(index !== -1)
    {
        return users.splice(index,1)[0] //as we know splice return an array of deleted item,
                                    // here deleted item return like this -> [{id:20,username:satyam,room:room1}]  (array of object )                                
                                    //but after useing  [0], it will return an object {id:20, username:satyam, room:room1}
                                    //console.log(users.splice(index,1))//<-uncomment this to test
    }
};

const getUser = (id) =>{

    return users.find((user) => user.id===id)
}

const getUserInRoom = (room) =>{
    room = room.trim().toLowerCase();
   // let roomUsers =[];
   return  users.filter((user)=>{
       if(user.room === room)
       {     return user;     
           //roomUsers.push(user.username);
       }
   });
  //return roomUsers;
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}

//------------------------------------------------------------------------------------------------------------------------------------
//test case. run this file separetly to test and uncomment all
// addUser({ //sending an object
//     id:22,
//     username:'Satyam',
//     room:'Noida City'
// });
// addUser({ //sending an object
//     id:23,
//     username:'pukku',
//     room:'Noida City'
// });
// addUser({ //sending an object
//     id:25,
//     username:'pi',
//     room:'Noida'
// });
//console.log(users);

// let res = addUser({
//     id:23,
//     username:'',
//     room:''
// });
// console.log(res);

// let res = addUser({
//     id:24,
//     username:'satyam',
//     room:'noida'
// });
// console.log(res);
// console.log(removeUser(22));
// console.log(users);

// let res = getUser(5);
// console.log(res);

// let re = getUserInRoom('noida city');
// console.log(re);