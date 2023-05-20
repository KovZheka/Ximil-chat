const http = require("http")
const path = require("path")
const fs = require ("fs")
const { Server } = require("socket.io")
 
const pathToIndex = path.join(__dirname, 'static', 'index.html')
const indexHtmlFile = fs.readFileSync(pathToIndex)
const pathToStyle = path.join(__dirname, 'static', 'style.css')
const styleHtmlFile = fs.readFileSync(pathToStyle)
const pathToScript = path.join(__dirname, 'static', 'script.js')
const scriptHtmlFile = fs.readFileSync(pathToScript)
const host = "localhost";
const port = "3000";

const server = http.createServer((req,res) => {
    if(req.url === "/" && req.method === "GET"){
        res.writeHead(200, {"Content-type":"text/html"})
        res.end(indexHtmlFile);
    }
    else if(req.url === "/style.css" && req.method === "GET"){
        res.writeHead(200, {"Content-type":"text/css"})
        res.end(styleHtmlFile);
    }
    else if(req.url === "/script.js" && req.method === "GET"){
        res.writeHead(200, {"Content-type":"text/js"})
        res.end(scriptHtmlFile);
    }
    else{
        res.writeHead(404, {"Content-type":"text/html"})
        res.end("<h1>Error 404. Invalid url</h1><img href='https://avatars.cloudflare.steamstatic.com/73e29258de68cdddd93d78bbf0aa66dd281ff84f_full.jpg'>")
    }
});
const io = new Server(server);
io.on('connection', (socket) => {
    let userNickname = "name";
    console.log(`a user connected. id - ${socket.id}`)
    socket.on('newMessage', (message) => {
       io.emit('message', `${userNickname}: ${message}`)
    })
    socket.on("userName", (name) =>{
        userNickname = name;
    })
    
})
server.listen(port, host, () => {
    console.log(`[Console] Server is running on http://${host}:${port}/`);
});