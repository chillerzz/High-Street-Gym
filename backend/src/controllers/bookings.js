import { Router } from "express";
import * as Bookings from "../models/bookings.js"
import * as Classes from "../models/classes.js"
import auth from "../middleware/auth.js";


// TODO: Implement validation

const bookingController = Router()

bookingController.get("/", auth(["trainer"]), async (req, res) => {
    const bookings = await Bookings.getAll()

    res.status(200).json({
        status: 200,
        message: "All bookings retrieved",
        bookings
    })
})

// Using for trainer bookings - its basically a getAll
bookingController.get("/trainerBookingsList", auth(["trainer"]), async (req, res) => {
    const bookings = await Bookings.getAllFutureBookingsForTrainers()

    res.status(200).json({
        status: 200,
        message: "All bookings retrieved",
        bookings
    })
})

bookingController.get("/:id", auth(["guest", "trainer"]), (req, res) => {
    const bookingId = req.params.id

    Bookings.getById(bookingId).then(bookingResult => {
        res.status(200).json({
            status: 200,
            message: "Booking found",
            bookingResult
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to get booking by Id: " + {bookingId}
        })
    })
})


bookingController.get("/user/:id", auth(["guest", "trainer"]), async (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        return res.status(400).json({
            status: 400,
            message: "Invalid user ID provided"
        });
    }

    try {
        const bookings = await Bookings.getFutureBookingsById(userId);
        return res.status(200).json({
            status: 200,
            message: "Get all bookings by user ID",
            bookings: bookings,
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return res.status(500).json({
            status: 500,
            message: "Failed to get bookings"
        });
    }
});


bookingController.get("/:date/:id", auth(["guest", "trainer"]), async (req, res) => {
    const date = req.params.date
    const activity_id = req.params.id
    
    Classes.getClassesbyDateAndActivityId(date, activity_id).then(classes => {
        res.status(200).json({
            status: 200,
            message: "All classes retrieved",
            classes
        });
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to get data"
        })
    })
})


// bookingController.post("/", auth(["guest", "trainer"]), (req, res) => {
//     // Get the data out of the request
//     const bookingData = req.body.booking

//     const booking = Bookings.newBooking(
//         null,
//         bookingData.user_id,
//         bookingData.class_id,
//         bookingData.created_datetime
//     )

//     // Use the create model function to insert this into the DB
//     Bookings.create(booking).then(booking => {
//         res.status(200).json({
//             status: 200,
//             message: "Booking created",
//             booking
//         })
//     }).catch(error => {
//         res.status(500).json({
//             status: 500,
//             message: "Failed to create booking"
//         })
//     })
// })

// Create the booking
bookingController.post("/", auth(["guest", "trainer"]), async (req, res) => {
    try {
        // Get the data out of the request
        const bookingData = req.body.booking;

        // Check if there is already a conflicting booking
        const matchingBooking = await Bookings.getByUserClass(bookingData.user_id, bookingData.class_id);

        console.log(matchingBooking);

        if (matchingBooking) {
            return res.status(400).json({
                status: 400,
                message: "A matching booking has already been made"
            });
        }

        // Convert the booking data into an booking model object (and sanitise appropriate inputs)
        const bookingObject = Bookings.newBooking(
            null,
            bookingData.user_id,
            bookingData.class_id,
            bookingData.created_datetime
        );

        const booking = await Bookings.create(bookingObject);
        res.status(200).json({
            status: 200,
            message: "The booking has been created",
            booking
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Booking failed: " + error,
            error
        });
    }
});




bookingController.delete("/:id", auth(["guest", "trainer"]), (req, res) => {
    const bookingId = req.params.id

    // TODO: Implement request validation

    Bookings.deleteById(bookingId).then(result => {
        res.status(200).json({
            status: 200,
            message: "Booking deleted",
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to delete booking",
        })
    })
}
)

export default bookingController