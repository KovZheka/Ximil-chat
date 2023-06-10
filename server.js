const http = require("http")
const path = require("path")
const fs = require ("fs")
const { Server } = require("socket.io")
const db = require('./database')

const pathToIndex = path.join(__dirname, 'static', 'index.html')
const indexHtmlFile = fs.readFileSync(pathToIndex)
const pathToStyle = path.join(__dirname, 'static', 'style.css')
const styleHtmlFile = fs.readFileSync(pathToStyle)
const pathToScript = path.join(__dirname, 'static', 'script.js')
const scriptHtmlFile = fs.readFileSync(pathToScript)
const pathToReg = path.join(__dirname, 'static', 'register.html')
const regHtmlFile = fs.readFileSync(pathToReg)
const pathToScriptReg = path.join(__dirname, "static", "auth.js")
const regJSFile = fs.readFileSync(pathToScriptReg)
const pathToStyleReg = path.join(__dirname, "static", "register.css")
const styleHtmlFileReg = fs.readFileSync(pathToStyleReg)
const host = "localhost";
const port = "3000";

const server = http.createServer(async(req,res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
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
    else if(req.url === "/start" && req.method === "GET"){
        try{
            const message = JSON.stringify(await db.getMessage())
            res.writeHead(200, {"Content-type":"text/html"});
            res.end(message);
        }catch(error) {
            res.writeHead(500);
            res.end();
        }
    }
    else if(req.url === '/register' && req.method === "GET"){
        res.writeHead(200, {"Content-type":"text/html"})
        res.end(regHtmlFile);
    }
    else if (req.url === "/auth.js" && req.method === "GET"){
        res.writeHead(200, {"Content-type":"text/js"})
        res.end(regJSFile);
    }
    else if (req.url === "/register.css" && req.method === "GET"){
        res.writeHead(200, {"Content-type":"text/css"})
        res.end(styleHtmlFileReg);
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

    socket.on("userName", (name) =>{
        userNickname = name;
    })

    socket.on('newMessage', async (msg) => {
        console.log("1")
       db.addMessage(msg, 1);
       io.emit('message', `${userNickname}: ${msg}`)
    })
    
    
})
server.listen(port, host, () => {
    console.log(`[Console] Server is running on http://${host}:${port}/`);
});