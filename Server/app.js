const express = require('express');
const cors = require("cors");
const app = express();
const userRouter = require("./Routes/userRouter")
const accountsRouter = require("./Routes/accountsRouter")

app.use(express.static(`${__dirname}/public`));

app.use(express.json());

app.use(cors());

app.options('*', cors());

app.use("/api/v1/users",userRouter)
app.use("/api/v1/accounts",accountsRouter)

app.all("*",(req,res,next) => {
  res.status(404).send('Sorry, cant find that')
  next()
})

module.exports = app;