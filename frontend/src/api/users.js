import { API_URL } from "./api";

export async function getAllUsers(authenticationKey) {
    // GET from the API /users
    const response = await fetch(
        API_URL + "/users",
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                'X-AUTH-KEY': authenticationKey
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.users
}


export async function getUserById(id) {
    const response = await fetch(
        API_URL + "/users/" + id,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            }
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.user
}


export async function getByAuthenticationKey(authenticationKey) {
    const response = await fetch(
        API_URL + "/users/authentication/" + authenticationKey,
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                'X-AUTH-KEY': authenticationKey
            },
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject.user
}

export async function create(user, authenticationKey) {
    const response = await fetch(
        API_URL + "/users",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'X-AUTH-KEY': authenticationKey
            },
            body: JSON.stringify({ user })
        }
    )

    const postUserResult = await response.json()

    return postUserResult
}


export async function deleteById(userId, authenticationKey) {
    const response = await fetch(
        API_URL + "/users/" + userId,
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


export async function update(formData, user, authenticationKey) {
    const response = await fetch(
        API_URL + "/users/" + user.id,
        {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json",
                'X-AUTH-KEY': authenticationKey
            },
            body: JSON.stringify({ formData })
        }
    )

    const patchUserResult = await response.json()

    return patchUserResult
}


export async function login(email, password) {
    const response = await fetch(
        API_URL + "/users/login",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                email,
                password,
            })
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject
}

export async function logout(authenticationKey) {
    const response = await fetch(
        API_URL + "/users/logout",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'X-AUTH-KEY': authenticationKey
            },
            body: JSON.stringify({})
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject
}

export async function registerUser(userData) {
    const response = await fetch(
        API_URL + "/users/register",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(userData)
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject
}