import { API_URL } from "./api";

// Using
export async function displayAllUniqueClassesForWeek(weekStartDate, weekEndDate, authenticationKey) {
    try {
        const response = await fetch(`${API_URL}/classes?weekStartDate=${weekStartDate}&weekEndDate=${weekEndDate}`, {
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


export async function getById(classId) {
    // GET from the API /sightings/user-id/:id
    const response = await fetch(
        API_URL + "/classes/" + classId,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.classResult
}

export async function getKey() {

    const response = await fetch(
        API_URL + "/classes/key",
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.classes
}

export async function getByTrainerUserId(trainerUserId) {
    // GET from the API /sightings/user-id/:id
    const response = await fetch(
        API_URL + "/classes/trainer/" + trainerUserId,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.classes
}

export async function getByLocationId(locationId) {
    // GET from the API /sightings/user-id/:id
    const response = await fetch(
        API_URL + "/classes/location/" + locationId,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.classes
}

export async function getByActivityId(activityId) {
    // GET from the API /sightings/user-id/:id
    const response = await fetch(
        API_URL + "/classes/activity/" + activityId,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.classes
}