import http from "http";
import { Server } from "socket.io";
import {app} from "../app.js";

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"*",
    }
})

//used to store online users

const userSocketMap ={};

io.on("connection",(socket)=>{
    console.log("A user is connected",socket.id);

    //Handshake="introduction + context Exchange"

    //Hey,I'm user A,and here's is my id please keep track on me
    const userId = socket.handshake.query.userId;

    if(userId){
        userSocketMap[userId] = socket.id;
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    }

    socket.on("disconnect",()=>{
        console.log("A user is disconnected ",socket.id);
        if(userId){
            delete userSocketMap[userId];
            io.emit("getOnlineUsers",Object.keys(userSocketMap));
        }
    })

    socket.on("sendMessage",({message,recipientId})=>{
        const recieverSocketId =userSocketMap[recipientId];
        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage",message);
        }
    })
})

function getReciverSocketId(userId){
    return userSocketMap[userId];
}

export {io,server,getReciverSocketId};