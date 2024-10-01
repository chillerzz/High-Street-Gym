import { Router } from "express";
import * as Activities from "../models/activities.js"

// TODO: Implement input validation

const activityController = Router()

activityController.get("/", async (req, res) => {
    const activities = await Activities.getAll()

    res.status(200).json({
        status: 200,
        message: "Sucessfully retrieved all activities",
        activities
    })
})

activityController.get("/activity/:id", async (req, res) => {
    const activityId = req.params.id

    // TODO: Implement request validation

    // TODO: Enforce that users can only get themselves

    Activities.getById(activityId).then(activityResult => {
        res.status(200).json({
            status: 200,
            message: "Activity found",
            activityResult
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to get activity by Id: " + {activityId}
        })
    })
})

export default activityController