const io=require("socket.io")(9696,{
    cors:{
        origin:"http://localhost:3000",
    }
})

var  userlist=[]; 



io.on("connection",(socket) => {
    console.log("a user connected")
    // console.log({socket_id:socket.id})
    socket.on("addUser",(loggeduser)=>{
        // console.log(loggeduser)
        // console.log(socket.id)
        addUserTolist(loggeduser,socket.id);
        io.emit("getAllUsers",userlist)
    })

    socket.on("sendMessage",({senderId,receiverId,text})=>{
        console.log({senderId})
        console.log({receiverId})
        console.log({text})
        const user=getUser(receiverId);
        console.log("messagebeen send")
        console.log(user)
        if (user)
        {
        io.to(user.socket).emit("getMessage",{
            senderId,
            text,
        })
        }
    })


    socket.on("disconnect",()=>{
        console.log("a user disconnected")
        removeUserFromList(socket.id)
        io.emit("getAllUsers",userlist)
    })
})

function addUserTolist(user,socket){
    if(!userlist.some((e)=>e.user===user))
    {
        userlist.push({user,socket})
    }
    console.log(userlist)
}

function removeUserFromList(socket){
    userlist=userlist.filter((e)=>e.socket!=socket)
    console.log(userlist)
}

function getUser(userId){
    return userlist.find((e)=>e.user==userId)
}