import express, { NextFunction, Request, Response } from "express";
import logic from "../4-logic/match-logic";

const router = express.Router();


router.get("/matches/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id
        const matches = await logic.getMatchesByUser(_id)
        response.json(matches)
    }
    catch (err: any) { next(err); }
});

export default router;