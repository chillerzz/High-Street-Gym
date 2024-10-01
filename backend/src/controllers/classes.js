import { Router } from "express";
import * as Classes from "../models/classes.js"
import xml2js from "xml2js"
import auth from "../middleware/auth.js";

// TODO: Implement validation

const classesController = Router()


// Using
classesController.get("/", auth(["guest", "trainer"]), async (req, res) => {
    try {
        const { weekStartDate, weekEndDate } = req.query;
        
        if (!weekStartDate || !weekEndDate) {
            return res.status(400).json({
                status: 400,
                message: "Both weekStartDate and weekEndDate are required query parameters."
            });
        }

        const classes = await Classes.displayAllUniqueClassesForWeek(weekStartDate, weekEndDate);

        res.status(200).json({
            status: 200,
            message: "Unique classes found",
            classes: classes,
        });
    } catch (error) {
        console.error("Error fetching unique classes:", error);
        res.status(500).json({
            status: 500,
            message: "Failed to fetch unique classes",
            error: error.message,
        });
    }
});


classesController.post("/upload-xml", auth(["trainer"]), (req, res) => {
    if (req.files && req.files["xml-file"]) {
        // Access the XML file as a string
        const XMLFile = req.files["xml-file"]
        const file_text = XMLFile.data.toString()

        // Set up XML parser
        const parser = new xml2js.Parser();
        parser.parseStringPromise(file_text)
            .then(data => {
                const classUpload = data["class-upload"]
                const classUploadAttributes = classUpload["$"]
                const operation = classUploadAttributes["operation"]
                // Slightly painful indexing to reach nested children
                const classesData = classUpload["classes"][0]["class"]

                if (operation == "insert") {
                    Promise.all(classesData.map((classData) => {
                        // Convert the xml object into a model object
                        const classModel = Classes.newClass(
                            null, 
                            classData.date,
                            classData.location_id.toString(),
                            classData.activity_id.toString(),
                            classData.trainer_user_id.toString(),
                            classData.time
                        )
                        // Return the promise of each creation query
                        return Classes.create(classModel)
                    })).then(results => {
                        res.status(200).json({
                            status: 200,
                            message: "XML Upload insert successful",
                        })
                    }).catch(error => {
                        res.status(500).json({
                            status: 500,
                            message: "XML upload failed on database operation - " + error,
                        })
                    })
                } else if (operation == "update") {
                    Promise.all(classesData.map((classData) => {
                        // Convert the xml object into a model object
                        const classModel = newClass(
                            classData.id.toString(),
                            classData.date,
                            classData.location_id.toString(),
                            classData.activity_id.toString(),
                            classData.trainer_user_id.toString(),
                            classData.time                        )
                        // Return the promise of each creation query
                        return Classes.update(classModel)
                    })).then(results => {
                        res.status(200).json({
                            status: 200,
                            message: "XML Upload update successful",
                        })
                    }).catch(error => {
                        res.status(500).json({
                            status: 500,
                            message: "XML upload failed on database operation - " + error,
                        })
                    })

                } else {
                    res.status(400).json({
                        status: 400,
                        message: "XML Contains invalid operation attribute value",
                    })
                }
            })
            .catch(error => {
                res.status(500).json({
                    status: 500,
                    message: "Error parsing XML - " + error,
                })
            })


    } else {
        res.status(400).json({
            status: 400,
            message: "No file selected",
        })
    }
})

classesController.get("/id/:id", (req, res) => {
    const classId = req.params.id

    // TODO: Implement request validation

    // TODO: Enforce that users can only get themselves

    Classes.getById(classId).then(classResult => {
        res.status(200).json({
            status: 200,
            message: "Class found",
            classResult,
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to get class by Id: " + {classId}
        })
    })
})

classesController.get("/:datetime", (req, res) => {
    const classDateTime = decodeURIComponent(req.params.datetime);
    const sql = classDateTime.toISOString()
    console.log(sql)

    // TODO: Implement request validation

    // TODO: Enforce that users can only get themselves

    Classes.getByDateTime(sql).then(classResult => {
        res.status(200).json({
            status: 200,
            message: "Class found",
            classResult,
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to get class by datetime: " + classDateTime
        })
    })
})

classesController.delete("/:id", auth(["trainer"]), (req, res) => {
    const classId = req.params.id

    // TODO: Implement request validation

    Classes.deleteById(classId).then(result => {
        res.status(200).json({
            status: 200,
            message: "Class deleted",
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to delete class",
        })
    })
})

export default classesController