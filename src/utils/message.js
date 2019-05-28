
const generateMessage = (text,name) =>{

    return {
      username:name,
      text:text, 
      createdAt: new Date().getTime()
    }
};

const generateLocation = (url,name) =>{
  return { 
    username:name,
    mapURL:url, 
    createdAt: new Date().getTime()
  }
};
module.exports = {
    generateMessage,
    generateLocation
}