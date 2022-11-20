import { Document, model, Schema } from "mongoose";
import { UserModel } from "./user-model";


export interface IMessageModel extends Document {
    fromUser: string;
    toUser: string;
    timeStamp: Date;
    message: string;

}


const MessageSchema = new Schema<IMessageModel>({

    fromUser: {
        type: String
    },
    toUser: {
        type: String
    },

    timeStamp: {
        type: Date
    },

    message: {
        type: String
    },


}, { versionKey: false });

MessageSchema.virtual("users", {
    ref: UserModel,
    localField: "userId",
    foreignField: "_id",
    justOne: true
});


export const MessageModel = model<IMessageModel>("MessageModel", MessageSchema, "messages");
