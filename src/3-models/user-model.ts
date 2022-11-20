import mongoose from "mongoose";
import { UploadedFile } from "express-fileupload";

export interface IUserModel extends mongoose.Document {
    username: string;
    password: string;
    name: string;
    birthDate: Date;
    age: number;
    gender: string;
    genderInterest: string;
    city: string;
    imageName: string;
    image: UploadedFile;
    about: string;
    minAgePreference: number;
    maxAgePreference: number;
    likes: Array<Object>;


}

const UserSchema = new mongoose.Schema<IUserModel>({
    username:{
        type: String,
        required: [true, "Missing username"],
        minlength: [4, "username too short"],
        maxlength: [30, "username too long"],
        trim: true,
        unique: true
    },

    password:{
        type: String,
        required: [true, "Missing password"],
        minlength: [6, "password too short"],
        trim: true
    },

    name: { 
        type: String,
        required: [true, "Missing name"],
        minlength: [2, "Name too short"],
        maxlength: [50, "Name too long"],
        trim: true
    },

   birthDate:{

    type: Date,
    required: [true, "Missing birthdate"]
   },

   age: {
    type: Number,
    min: [18, "Must Be 18 Years Old"],
    max: [100, "Must Be Younger Than 100"]
   },

   gender: {
    type: String,
    required:[true, "Missing gender"],
    trim: true
   },

   genderInterest:{
    type: String,
    required:[true, "Missing gender interest"],
    trim: true
   },

   city:{
    type: String,
    required: [true, "Missing city"],
    trim: true
   },

   imageName: {
    type: String,
   },

   image : {
    type: Object
},

about: {
    type: String,
    maxlength: [1000, "Too many characters"],
    trim: true
},

minAgePreference: {
    type: Number
},

maxAgePreference: {
    type: Number
},

likes: {
    type: [Object],
}

}, { versionKey: false });

export const UserModel = mongoose.model<IUserModel>("UserModel", UserSchema, "users");
