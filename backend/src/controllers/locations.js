import { Router } from "express";
import * as Locations from "../models/locations.js";
import auth from "../middleware/auth.js";

const locationController = Router()

locationController.get("/", async (req, res) => {
    const locations = await Locations.getAll()

    res.status(200).json({
        status: 200,
        message: "Sucessfully retrieved all locations",
        locations
    })
})


export default locationController