import { Application, NextFunction, Request, Response } from "express";

import express from 'express';
import cors from "cors";
const app : Application = express();
import chatRouter from "./Routes/chatRouter";
import accountsRouter from "./Routes/accountsRouter";

app.use(express.static(`${__dirname}/public`));

app.use(express.json());

app.use(cors());

app.options('*', cors());

app.use("/api/v1/accounts",accountsRouter)
app.use("/api/v1/chat",chatRouter)


app.all("*",(req:Request,res:Response,next:NextFunction) => {
  res.status(404).send('Sorry, cant find that')
  next()
})

export default app;