const model = require('./model')
const loginCreateUser = require('./dao').registerOrLogin
const sendMessage = require('./dao').sendMessage
const listMessages = require('./dao').listMessages


/**
 * 
 * Test cases 
 */

const test = async() => {


    const number = 2;

    switch(number){

        // creating a user or geting a user
        case 1:
            console.log("Login or Signup");
            const respo1 = await loginCreateUser('Mahoro', '123');
            console.log(respo1);
            break;

        // creating a message and siplaying all messages
        case 2:
            const respo2 = await loginCreateUser('Mahoro', '123')
            const message = new model.Message(respo2.username,'I am cool')
            const respoMessage =  await sendMessage(message);     
            const respo3 = await listMessages();
            console.log("Messages List");
            console.log(respo3);
            break;
        default:
            console.log("Pease choose a test case:\n");
       
    }
    // const respo = await loginCreateUser('Mahoro', '123')
    // const message = new model.Message(respo,'I am cool')
    // const respo2 =  await sendMessage(message);
}

test()