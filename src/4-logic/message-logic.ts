import { IMatchModel } from "../3-models/match-model";
import { IMessageModel, MessageModel } from "../3-models/message-model";
import matchLogic from "./match-logic";

async function getMessagesByMatch(match: string): Promise<IMessageModel[]> {
const matchById = await matchLogic.getMatchById(match)
const messages = await MessageModel.find({fromUser: matchById.userId1, toUser: matchById.userId2}).exec();
return messages;
}

async function addMessage(message: IMessageModel): Promise<IMessageModel> {
    const date = new Date();
    message.timeStamp = date;
    const addedMessage = await message.save();
    return addedMessage;
}



export default {
    getMessagesByMatch,
    addMessage
}