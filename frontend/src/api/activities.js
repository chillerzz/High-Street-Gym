import { API_URL } from "./api";

export async function getAllActivites() {
    const response = await fetch(API_URL + "/activities", {
        method: "GET",
        headers: {
            'Content-Type': "application/json"
        }
    })

    const APIResponseObject = await response.json()

    return APIResponseObject.activities
}

export async function getById(activityId) {
    // GET from the API /sightings/user-id/:id
    const response = await fetch(
        API_URL + "/activities/" + activityId,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.activityResult
}