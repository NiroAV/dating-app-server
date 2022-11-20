import express, { NextFunction, Request, Response } from "express";
import { MessageModel } from "../3-models/message-model";
import logic from "../4-logic/message-logic";

const router = express.Router();


router.get("/messages/:matchId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const matchId = request.params.matchId
        const matches = await logic.getMessagesByMatch(matchId)
        response.json(matches)
    }
    catch (err: any) { next(err); }
});

router.post("/messages/:sendMessage/:receiveMessage", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const sendMessage = request.params.sendMessage
        const receiveMessage = request.params.receiveMessage
        const message = new MessageModel(request.body)
        message.fromUser = sendMessage;
        message.toUser = receiveMessage;
        const addedMessage = await logic.addMessage(message)
        response.json(addedMessage)
    }
    catch (err: any) { next(err); }
});

export default router;