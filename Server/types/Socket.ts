import { Socket } from "socket.io"
import { Handshake } from "socket.io/dist/socket"
import IUserDoc from "./DBTypes"

export type AuthorizedHandShake = Handshake & {
    jwtPayload: IUserDoc
}

export type AuthorizedSocket = Socket & {
    handshake: AuthorizedHandShake
}

export type SocketMembers = {
    [userId: string]:{
        socketId: string
    }
}