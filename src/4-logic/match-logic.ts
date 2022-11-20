import ErrorModel from "../3-models/error-model";
import { IMatchModel, MatchModel } from "../3-models/match-model"
import { IUserModel, UserModel } from "../3-models/user-model"
import userLogic from "./user-logic";

async function checkIfMatch(likedUser: string, giveLikeUser: string): Promise<boolean> {

    const giveLikeUserArray = await UserModel.find({ _id: giveLikeUser, likes: { userId: likedUser } }).exec()
    if (giveLikeUserArray.length === 0) {
        return true
    }
    else {
        return false
    }
}


async function getMatchesByUser(_id: string): Promise<IUserModel[]> {
    const matches = await MatchModel.find({ $or: [{ userId1: _id }, { userId2: _id }] }).lean().exec()

    let data = []
    let testArr = []
    let filteredArr = []

    matches.forEach((i) => { 
        testArr.push(i.userId1.toString())
        testArr.push(i.userId2.toString())
    })

    testArr.forEach((i) => {
        if( i !== _id){
            data.push(i)
        }
    })
        for (let i of data){
            filteredArr.push(await userLogic.getUser(i))
        }

    return filteredArr
}

async function getMatchById(_id: string): Promise<IMatchModel> {
    const match = await MatchModel.findById({ _id }).exec()
    return match
}



export default {
    checkIfMatch,
    getMatchesByUser,
    getMatchById
}        