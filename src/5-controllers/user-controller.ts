import express, { NextFunction, Request, Response } from "express";
import { UserModel } from "../3-models/user-model";
import logic from "../4-logic/user-logic";
import path from 'path';

const router = express.Router();

router.get("/users/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id
        const user = await logic.getUser(_id)
        response.json(user)
    }
    catch (err: any) { next(err); }
});

router.get("/filtered-users/:gender/:minAgePreference/:maxAgePreference", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const gender = request.params.gender
        const minAgePreference = +request.params.minAgePreference
        const maxAgePreference = +request.params.maxAgePreference
        const users = await logic.getUsersByGenderAndAge(gender, minAgePreference, maxAgePreference)
        response.json(users)
    }
    catch (err: any) { next(err); }
});

router.post("/register", async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body.image = request.files?.image;
        const user = new UserModel(request.body)
        const token = await logic.register(user)
        response.status(201).json(token)
    }
    catch (err: any) { next(err); }
});


router.post("/login", async (request: Request, response: Response, next: NextFunction) => {
    try {
        
        const user = new UserModel(request.body)
        const token = await logic.login(user)
        response.status(201).json(token)
    }
    catch (err: any) { next(err); }
});


router.get('/users/images/:imageName', async (request, response, next: NextFunction) => {
    try{
        const imageName = request.params.imageName;
        const absolutePath = path.join(__dirname, "..", "assets", "images", imageName);
        response.sendFile(absolutePath);

    }
    catch(err:any){
        next(err);
    }
    
});

router.put("/users/:_id",  async (request: Request, response: Response, next: NextFunction) => {
    try {
       request.body.image = request.files?.image;
       request.body._id = request.params._id
       const user = new UserModel(request.body)
       const updatedUser = await logic.updateUser(user)
       response.json(updatedUser)
    }
    catch (err: any) {
        next(err);
    }
});

router.delete("/users/:_id",  async (request: Request, response: Response, next: NextFunction) => {
    try {
       const _id = request.params._id
       await logic.deleteUser(_id)
       response.sendStatus(204)
    }
    catch (err: any) {
        next(err);
    }
});


router.post("/add-like/:receiveLike/:giveLike", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const receiveLike = request.params.receiveLike
        const giveLike = request.params.giveLike
        const updatedUser = await logic.addLike(receiveLike,giveLike)
        response.json(updatedUser)
    }
    catch (err: any) { next(err); }
});



export default router;