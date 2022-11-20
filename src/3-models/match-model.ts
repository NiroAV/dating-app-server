import { Document, model, Schema } from "mongoose";
import { UserModel } from "./user-model";


export interface IMatchModel extends Document {
    userId1: Schema.Types.ObjectId;
    userId2: Schema.Types.ObjectId;

}


const MatchSchema = new Schema<IMatchModel>({
   
    userId1:{
        type: Schema.Types.ObjectId
    },
    userId2: {
        type: Schema.Types.ObjectId
    }


}, { versionKey: false });

MatchSchema.virtual("users", {
    ref: UserModel,
    localField: "userId",
    foreignField: "_id",
    justOne: true
});


export const MatchModel = model<IMatchModel>("MatchModel", MatchSchema, "matches");
