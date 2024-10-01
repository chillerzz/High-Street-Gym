import cors from "cors"
import express from "express"
import fileUpload from "express-fileupload"
import userController from "./controllers/users.js"
import blogController from "./controllers/blog.js"
import bookingController from "./controllers/bookings.js"
import classesController from "./controllers/classes.js"
import activityController from "./controllers/activities.js"
import locationController from "./controllers/locations.js"

// Create express application
const port = 8080
const app = express()


// Enable cross-origin resources sharing (CORS)
app.use(cors({
    // Allow all origins
    origin: true,
}))


// Enable JSON request parsing middleware. Must be done before endpoints are defined.
//
// If a request with a `Content-Type: application/json` header is
// made to a route, this middleware will treat the request body as
// a JSON string. It will attempt to parse it with `JSON.parse()`
// and set the resulting object (or array) on a `body` property of
// the request object, which you can access in your route endpoints,
// or other general middleware.
app.use(express.json())

// Enable file upload support
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}))

// Import and use the route defined by the controller
app.use("/users", userController)
app.use("/classes", classesController)
app.use("/bookings", bookingController)
app.use("/blog", blogController)
app.use("/activities", activityController)
app.use("/locations", locationController)

// Catch errors raised by endpoints and respond with JSON error object
app.use((err, req, res, next) => {
    // format error
    res.status(err.status || 500).json({
        status: err.status,
        message: err.message,
        errors: err.errors,
    })
})

// Start listening for API requests
app.listen(
    port,
    () => console.log(`Express started on http://localhost:${port}`),
)