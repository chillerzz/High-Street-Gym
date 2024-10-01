import { API_URL } from "./api";


export async function getAllLocations() {
    const response = await fetch(API_URL + "/locations", {
        method: "GET",
        headers: {
            'Content-Type': "application/json"
        }
    })

    const APIResponseObject = await response.json()

    return APIResponseObject.locations
}