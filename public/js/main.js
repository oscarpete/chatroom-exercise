const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');//this will help to scrolldown
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


//get user name and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

//console.log(username, room);

const socket = io();

//user joined chatroom
socket.emit('joinRoom', { username , room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});


socket.on('mensaje', message => { //here is where the server is output
    console.log(message);
    outputMessage(message);

    //allows to scroll down
chatMessages.scrollTop = chatMessages.scrollHeight;
});

//message submited to public chat
chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); //this prevent resend message

    //this gets the text from user input
    const msg = e.target.elements.msg.value;
console.log(msg);
    // msg = msg.trim();
    // if (!msg) {
    //     return false;
    // }

    // emit/send to server
    socket.emit('chatMessage',msg);

    //clear input after send
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('mensaje'); //this take the div with id "message"

    div.innerHTML= `<p class="meta">Brad <span>${message.time}</span></p>
						<p class="text">
							${message}
						</p>`;

    // const p = document.createElement('p');
    // p.classList.add('meta');
    // p.innerText = message.username;
    // p.innerHTML += `<span>${message.time}</span>`;
    // div.appendChild(p);
    // const para = document.createElement('p');
    // para.classList.add('text');
    // para.innerText = message.text;
    // div.appendChild(para);

    document.querySelector('.chat-messages').appendChild(div);//this creates a new div everytime
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location = '../index.html';
    } else {
    }
});