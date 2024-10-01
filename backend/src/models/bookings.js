import { db } from "../database.js"

export function newBooking(
    id,
    user_id,
    class_id,
    created_datetime
) {
    return {
        id,
        user_id,
        class_id,
        created_datetime
    
    }
}

export function newBigBooking(
    id,
    user_id,
    class_id,
    created_datetime,
    date,
    time,
    location_name,
    activity_name,
    first_name,
    last_name,
    booking_id
) {
    return {
        id,
        user_id,
        class_id,
        created_datetime,
        date,
        time,
        location_name,
        activity_name,
        first_name,
        last_name,
        booking_id
    }
}


export function getByUserClass(userId, classId) {
    return db.query(`
        SELECT * FROM bookings
        WHERE 
            bookings.user_id = ?
            AND bookings.class_id = ?
        `, [userId, classId])
        .then(([queryResult]) => {
            return queryResult.length > 0 ? queryResult[0] : null;  // Return the first matching booking or null
        })
        .catch(error => {
            console.log(`Error getting the booking: ` + error);
            throw error;  // Propagate the error
        });
}



// Using for trainers to get bookings
export async function getAllFutureBookingsForTrainers() {
    const [allBookings] = await db.query(`
    SELECT 
    *,
    location.name AS location_name,
    activities.name AS activity_name,
    classes.time AS class_time,
    bookings.id AS booking_id
FROM 
    bookings
    JOIN classes ON bookings.class_id = classes.id
    JOIN location ON classes.location_id = location.id
    JOIN activities ON classes.activity_id = activities.id
    JOIN users ON classes.trainer_user_id = users.id
WHERE 
    classes.date >= CURDATE()
    `,)

    return await allBookings.map((booking) => {
        return newBigBooking(
            booking.id,
            booking.user_id,
            booking.class_id,
            booking.created_datetime,
            booking.date,
            booking.time,
            booking.location_name,
            booking.activity_name,
            booking.first_name,
            booking.last_name,
            booking.booking_id
        )
    })
}

// Using for /bookings-list page
export async function getFutureBookingsById(userId) {
    const [allBookings] = await db.query(`SELECT 
    *,
    location.name AS location_name,
    activities.name AS activity_name,
    classes.time AS class_time,
    bookings.id AS booking_id
FROM 
    bookings
    JOIN classes ON bookings.class_id = classes.id
    JOIN location ON classes.location_id = location.id
    JOIN activities ON classes.activity_id = activities.id
    JOIN users ON classes.trainer_user_id = users.id
WHERE 
    classes.date >= CURDATE() 
    AND bookings.user_id = ?
;    
    `, [userId])

    return await allBookings.map((booking) => {
        return newBigBooking(
            booking.id,
            booking.user_id,
            booking.class_id,
            booking.created_datetime,
            booking.date,
            booking.time,
            booking.location_name,
            booking.activity_name,
            booking.first_name,
            booking.last_name,
            booking.booking_id
        )
    })
}

export async function getAll() {
    const [allBookings] = await db.query("SELECT * FROM bookings")

    return await allBookings.map((booking) => 
        newBooking(
            booking.id.toString(),
            booking.user_id,
            booking.class_id,
            booking.created_datetime
        ))
}

export async function getById(bookingId) {
    const [bookings] = await db.query(
        "SELECT * FROM bookings WHERE id = ?", bookingId
    )

    if (bookings.length > 0) {
        const booking = bookings[0]
        return Promise.resolve(
            newBooking(
                booking.id.toString(),
                booking.user_id,
                booking.class_id,
                booking.created_datetime
            )
        )
    } else {
        return Promise.reject("No results found")
    }
}

export async function getByUserId(userId) {
    // Get the collection of all bookings with matching userID
    const [bookingResults] = await db.query(
        "SELECT * FROM bookings WHERE user_id = ?", userId
    )
    // Convert the result into a Sighting object
    return await bookingResults.map((bookingResult) =>
        newBooking(
            bookingResult.id,
            bookingResult.user_id,
            bookingResult.class_id,
            bookingResult.created_datetime,
        ))
}

// Using
export async function create(booking) {
    // Insert blog object and return resulting promise
    return db.query(
        `
        INSERT INTO bookings (user_id, class_id, created_datetime)
        VALUES (?, ?, ?)
        `,
        [
            booking.user_id,
            booking.class_id,
            booking.created_datetime
        ]
    ).then(([result]) => {
        // Return a copy of the newly created blog with it's primary key
        return { ...booking, id: result.insertId }
    })
}

export async function update(booking) {
    return db.query(
        "UPDATE bookings SET user_id = ?, class_id = ?, created_datetime = ? WHERE id = ?",
        [booking.user_id, booking.class_id, booking.created_datetime]
    )
}

// Using
export async function deleteById(bookingId) {
    return db.query("DELETE FROM bookings WHERE id = ?", bookingId)
}