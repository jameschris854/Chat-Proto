import mongoose from 'mongoose'
import Config from './Config/Config'
import {server} from './socket'

const port = process.env.port || Config.PORT

const mongoDbUri = "mongodb+srv://admin:<password>@cluster0.j8rto9i.mongodb.net/chat-app?retryWrites=true&w=majority"

mongoose.connect(mongoDbUri.replace("<password>","admin12345"),(err) => {
    if(err){
        console.log("DB connection failed!!",err)
    }else{
        console.log("DB connection establisbhed successfully!!")
    }
})

server.listen(port, () => {
    console.log(`listening on *:${port}`);
}); 

module.exports = server;