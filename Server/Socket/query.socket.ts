import { AuthorizedSocket, SocketMembers } from "./../types/Socket";
import Conversations from "../Model/conversationsModel";
import Users from "../Model/userModel";
import { AuthorizedHandShake } from "../types/Socket";
import AppError from "../Utils/AppError";
import Message from "../Model/messageModel";
import IUserDoc from "../types/DBTypes";
import { io } from "../socket";
import { createConversation } from "../Service/ConversationService";

/**
 * @param members [SocketMembers]
 * @param socket [AuthorizedSocket]
 * @param userState [string]
 * @description sends event to client about change on user state.
 */
const NotifyOnline = (
  members: SocketMembers,
  socket: AuthorizedSocket,
  userState: "ONLINE" | "OFFLINE"
) => {
  socket.handshake.jwtPayload.friends.forEach((friend) => {
    if (members[`${friend._id}`]) {
      io.of("v1/chat")
        .to(members[`${friend._id}`].socketId)
        .emit("USER_STATE_UPDATE", {
          id: socket.handshake.jwtPayload._id,
          status: userState,
        });
    }
  });
};

/**
 *
 * @param req [handshake]
 *
 * @description gets all conversations of a user
 */
const queryConversationsByUser = async (
  req: AuthorizedHandShake
): Promise<any> => {
  const userId = req?.jwtPayload?.id;
  try {
    return await Conversations.find({ userId })
      .populate("recentConversations")
      .populate("members");
  } catch (e: any) {
    return e;
  }
};

type Body = {
  content: string;
  recipientEmail: string;
  type: string;
  conversationId: string;
};

/**
 *
 * @param req [AuthorizedHandShake]
 * @param body [Body]
 * @param callback [Function]
 * @returns returns message document created by mongo
 */
const sendMessage = async (
  req: AuthorizedHandShake,
  body: Body,
  callback: Function
): Promise<Function | AppError> => {
  let { content, recipientEmail, type, conversationId } = body;

  // check if conversation already exist.
  const senderId = req?.jwtPayload?.id;

  let recepientData;

  if (recipientEmail) {
    recepientData = { email: recipientEmail };
  } else if (!conversationId) {
    return new AppError("recipient data to correct.", 403);
  }

  let getRecipient = await Users.findOne(recepientData);

  let recipientIds: any[] = [];

  if (getRecipient) {
    recipientIds = [getRecipient._id];
  } else {
    return new AppError("Recepient not found.", 404);
  }

  if (!conversationId) {
    console.log("creating new converation between user");
    let conversation = await Conversations.create({
      members: [senderId, ...recipientIds],
    });
    conversationId = conversation.id;
  }
  let doc;

  if (conversationId) {
    doc = await Message.create({
      content,
      status: "SENT",
      sender: senderId,
      recipients: [...recipientIds],
      type: type,
      conversationId,
    });
  } else {
    return new AppError("could not create conversation", 422);
  }

  if (doc) {
    return callback(doc);
  } else {
    return new AppError("could not send message", 422);
  }
};

const forwardMessageToRecipient = (doc: IUserDoc) => {
  return "SUCCESS";
};

const findMessageAndUpdateStatus = (id: string, status: string) => {
  return Message.findByIdAndUpdate(id, { status }, { new: true });
};

const findMessageById = (id: string) => {
  return Message.findById(id);
};

export default {
  queryConversationsByUser,
  sendMessage,
  forwardMessageToRecipient,
  NotifyOnline,
  findMessageAndUpdateStatus,
  findMessageById,
};
