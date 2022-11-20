import cyber from "../1-utils/cyber";
import ErrorModel from "../3-models/error-model";
import { IUserModel, UserModel } from "../3-models/user-model";
import path from 'path';
import  fs  from 'fs';
import {v4 as uuid} from "uuid";
import { IMatchModel, MatchModel } from "../3-models/match-model";
import matchLogic from "./match-logic"

async function register(user: IUserModel): Promise<string>{

    const usernameTaken = await isUsernameTaken(user.username)
    if(usernameTaken.length !== 0){
        throw new ErrorModel(400, `Username ${user.username} is already taken.`)
    }
    user.password = cyber.hash(user.password)
    const age = getAge(user.birthDate)
    user.age = age
    if(user.image){
        const extension =  user.image.name.substring(user.image.name.lastIndexOf('.'));
        user.imageName = uuid() + extension;
        await user.image.mv('./src/assets/images/' + user.imageName);
        delete user.image;
    }
    const errors = user.validateSync();
    if (errors) throw new ErrorModel(400, errors.message);
    const newUser = await user.save()
    newUser.password = null
    newUser._id = null
    const token = cyber.getNewToken(user)
    return token
}

function getAge(dateString) 
{
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    {
        age--;
    }
    return age;
}

async function isUsernameTaken(username: string): Promise<IUserModel[]>{
    const existUsername = await UserModel.find({username}).exec()
    return existUsername
}

async function login(user: IUserModel): Promise<string>{
    
        user.password = cyber.hash(user.password)
        const userDetails = await UserModel.find({username: user.username, password: user.password})
        if(userDetails.length === 0){
            throw new ErrorModel(401, "Incorrect email or password")
        }
        const oneUser = userDetails[0]
        oneUser.password = null
        const token = cyber.getNewToken(oneUser)
        return token
}


async function getUser(_id: string): Promise<IUserModel>{
    const user = await UserModel.findById({_id}).exec()
    return user
}

async function getUsersByGenderAndAge(genderType: string, minAgePreference: number, maxAgePreference: number): Promise<IUserModel[]>{
    const users = await UserModel.find({gender: genderType}).where('age').gt(minAgePreference).lt(maxAgePreference).exec()
    return users
}


async function addLike(likedUser: string , giveLikeUser: string): Promise<Object>{

    const updateDoc = {$push: {likes: {userId:giveLikeUser}}}
    const query = {_id: likedUser}
    const likedUserArray = await UserModel.find({_id: likedUser, likes: {userId:giveLikeUser}}).exec()
    if(likedUserArray.length === 0){
        const userToUpdate = await UserModel.updateOne(query, updateDoc).exec()
       const matchCheck = await matchLogic.checkIfMatch(likedUser,giveLikeUser)
       if(matchCheck){
            const newMatch = new MatchModel({userId1: likedUser,userId2: giveLikeUser})
           await newMatch.save()
       }
        return userToUpdate
    } 
}


async function updateUser(user: IUserModel): Promise<IUserModel>{
    const errors = user.validateSync();
    if (errors) throw new ErrorModel(400, errors.message);
    const oldUser = await getUser(user._id);
    const imageInData = oldUser.imageName;

    if(imageInData && user.image){
        const absolutePath = path.join(__dirname, "..", "assets", "images", imageInData);
        fs.unlinkSync(absolutePath);
    }


    if(user.image){
        const extension =  user.image.name.substring(user.image.name.lastIndexOf('.'));
        user.imageName = uuid() + extension;
        await user.image.mv('./src/assets/images/' + user.imageName);
        delete user.image;
       }
    const updatedUser = await UserModel.findByIdAndUpdate(user._id,user ,{returnOriginal: false}).exec()
    return updatedUser
}

async function deleteUser(_id: string): Promise<void>{
    const user = await getUser(_id);
    const imageInData = user.imageName;
    const absolutePath = path.join(__dirname, "..", "assets", "images", imageInData);
    fs.unlinkSync(absolutePath);

    await UserModel.findByIdAndDelete(_id).exec()
}





export default{
    register,
    login,
    getUser,
    getUsersByGenderAndAge,
    updateUser,
    deleteUser,
    addLike,
    getAge
}