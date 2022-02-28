const postgres = require('./database');
const bcrypt = require('bcrypt');
const User = require('./model').User;



const registerOrLogin = async(username, password)=>{
    
    try{
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const token = await bcrypt.hash(username, salt);
        const response = await postgres.query("SELECT username, password FROM users where username=$1",[username])
        if(response.rows.length > 0){
            if(await bcrypt.compare(password, response.rows[0].password)){
                // postgres.end()
                return new User(username, hashedPassword)

            }
        }
  

        const createUser = await postgres.query("INSERT INTO users (username, password) values($1,$2) RETURNING username, password",[username, hashedPassword]);
        const response2 = await postgres.query("INSERT INTO sessions (user, key) values($1,$2) ",[createUser.rows[0].username, token]);

        // await postgres.query(")     
        // postgres.end()
        return new User(createUser.rows[0].username, createUser.rows[0].password);
    }catch(e){
      
        throw e
    }
}


const sendMessage = async (message)=>{
    try{
        const response =  await postgres.query("INSERT INTO messages (author, message, time) values($1,$2,$3)",[message.author, message.message, message.time])
        // postgres.end()
        return response
    }catch(e){
        throw e
    }
}





const listMessages = async()=>{
    try{
        const respo = await postgres.query("SELECT * FROM messages");
        // postgres.end()
        return respo.rows
    }catch(e){

    }
}



module.exports = {registerOrLogin:registerOrLogin, sendMessage:sendMessage, listMessages:listMessages}