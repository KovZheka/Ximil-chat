const socket = io();

const submit = document.getElementById("enter");
const input = document.getElementById("input")
const message = document.getElementById('messages')
const button = document.getElementById("changeNickname")
const send = document.getElementById("test")
const text = document.getElementById("input2")

submit.addEventListener("submit", function (event) {
    event.preventDefault()
    console.log('test');
    if(input.value){
        socket.emit('newMessage', input.value)
    }
});

send.addEventListener('click', function (event){
    event.preventDefault()
    if(input2.value){
        socket.emit('userName', input2.value)
    }
    
})

socket.on('message', function(msg){
    const item = document.createElement(`li`);
    item.textContent = msg
    message.appendChild(item);
    window.scrollTo[0, document.body.scrollHeight]
})

