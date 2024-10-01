import { API_URL } from "./api";

// Using
export async function create(booking, authenticationKey) {
    const response = await fetch(
        API_URL + "/bookings",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'X-AUTH-KEY': authenticationKey
            },
            body: JSON.stringify(booking)
        }
    );

    if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "An error occurred while creating the booking");
    }

    const postCreateBookingResponse = await response.json();
    return postCreateBookingResponse;
}


export async function getAll() {
    const response = await fetch(API_URL + "/bookings", {
        method: "GET",
        headers: {
            'Content-Type': "application/json"
        }
    })
    
    const APIResponseObject = await response.json()

    return APIResponseObject.bookings
}

// Using for bookingslist
export async function getByUserId(userId, authenticationKey) {

    const response = await fetch(
        API_URL + "/bookings/user/" + userId,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                'X-AUTH-KEY': authenticationKey
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.bookings
}

// Using for bookingslist
export async function getTrainerBookingsList(authenticationKey) {

    const response = await fetch(
        API_URL + "/bookings/trainerbookingslist",
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                'X-AUTH-KEY': authenticationKey
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.bookings
}

// Using for bookingslist
export async function deleteById(bookingId, authenticationKey) {
    const response = await fetch(
        API_URL + "/bookings/" + bookingId,
        {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json",
                'X-AUTH-KEY': authenticationKey
            },
            body: JSON.stringify({})
        }
    )

    const deleteResult = await response.json()

    return deleteResult
}



export async function getClassesbyDateAndActivityId(date, activity_id, authenticationKey) {
    try {
        const response = await fetch(`${API_URL}/bookings/${date}/${activity_id}`, {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                'X-AUTH-KEY': authenticationKey
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch classes');
        }

        const data = await response.json();
        return data.classes;
    } catch (error) {
        throw new Error('Error fetching classes: ' + error.message);
    }
}