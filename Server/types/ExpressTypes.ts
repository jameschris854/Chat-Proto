import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongoose";

type IjwtPayload = {jwtPayload?:JwtPayload & {id?: ObjectId}}

export type IAuthenticatedRequest = Request & IjwtPayload;