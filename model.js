const bcrypt = require('bcrypt');


class User{
    #password;
    constructor(username, password){
        
        if(password == undefined){
        this.#password = ''
        }else{
        this.#password = password;
        }
        this.username = username;
    }

    getPassword(){
        return this.#password;
    }

}


class Message{
    constructor(author, message){
        this.id = null;
        this.author = author;
        this.message = message;
        this.time = new Date();
    }
}


module.exports = {Message:Message,User:User}