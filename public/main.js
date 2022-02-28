
const socket = io()
// some styles
let width = screen.width;
let height = screen.height;
const main = document.querySelectorAll('.main')[0];
main.style.height = height;
main.style.width = width;



// js to display the message card


const messageScreen = document.getElementById('screen');
const messageButton = document.getElementById('submitMessageBtn');
const textArea = document.getElementById('textArea');

(async () => {
    let username = await localStorage.getItem('username')


    if (username == null) {
        document.getElementById('logout').hidden = true;
    } else {
        let password = await localStorage.getItem('password')

        socket.emit('login', username, password, (respose) => {
            if (respose.loggedIn) {
                chatRoomPage.style.display = 'flex';
                loginPage.style.display = 'none';
                populateScreen(respose.messages)

            }
        })

    }
})()


messageButton.addEventListener('click', async () => {
    // console.log(textArea);
    const userName = await localStorage.getItem('username');

    if (textArea.value == '') {

        return
    }

    socket.emit('chat', { message: textArea.value, user: userName })

    console.log(textArea.outerHTML)
    messageScreen.innerHTML += `
    <div class="messageCard">
        <div class="messageHeader">
            <p class="messageAuthor">${"You"}</p>
            <p class="messageTimestamp">${getFormattedDate(new Date())}</p>
         </div>
         <div class="messageContent">
            ${textArea.value}     
         </div>
    </div>
    
    `;
    textArea.value = "";
});




// authentication

const chatRoomPage = document.getElementById('chatroomPage');
const loginPage = document.getElementById('loginPage');
const loginButton = document.getElementById('loginButton');
const username = document.getElementById('username');
const password = document.getElementById('password');
const logoutBtn = document.getElementById('logout');

loginButton.addEventListener('click', async () => {
    if (username.value == '' | username.value == null | password.value == null | password.value == '' | password.value.length < 3) {
        alert("Credetials not correct!");
        return;
    }

    socket.emit('login', username.value, password.value, async (respo) => {
        if (respo.loggedIn) {

            await localStorage.setItem('username', username.value);
            await localStorage.setItem('password', password.value);
            chatRoomPage.style.display = 'flex';
            loginPage.style.display = 'none';
            // console.log(textArea)
            document.getElementById('logout').hidden = false;

            populateScreen(respo.messages)
        } else {
            // console.log(respo.message)
            alert(respo.message.detail)
        }
    })
})

logoutBtn.addEventListener('click', async () => {
    let name = await localStorage.getItem('username');

    const response = confirm('Are you sure ' + name);
    if (response) {
        chatRoomPage.style.display = 'none';
        loginPage.style.display = 'flex';
        await localStorage.removeItem('username');
        document.getElementById('logout').hidden = true;
        messageScreen.innerHTML = "";
    }
})






socket.on('message', (message) => {
    // alert(message)
    let date = new Date(message.time);

    messageScreen.innerHTML += `
    <div class="messageCard">
        <div class="messageHeader">
            <p class="messageAuthor">${message.author}</p>
            <p class="messageTimestamp">${getFormattedDate(date)}</p>
         </div>
         <div class="messageContent">
            ${message.message}     
         </div>
    </div>
    
    `
})


const getFormattedDate = (date) => {

    let year, month, day, hour, min;

    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    hour = date.getHours();
    min = date.getMinutes();
    return day + "/" + month + "/" + year + " - " + hour + " : " + min;
}


const populateScreen = (messages) => {
    messages.forEach(async (message) => {
        let date = new Date(message.time);
        let loggedInUser = await localStorage.getItem('username');
        let author = message.author.toUpperCase() == loggedInUser ? loggedInUser : message.author;

        messageScreen.innerHTML += `
    <div class="messageCard">
        <div class="messageHeader">
            <p class="messageAuthor">${author}</p>
            <p class="messageTimestamp">${getFormattedDate(date)}</p>
         </div>
         <div class="messageContent">
            ${message.message}     
         </div>
    </div>
    
    `

    })
}