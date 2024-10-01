import { API_URL } from "./api";

export async function getAll() {
    const response = await fetch(API_URL + "/blog", {
        method: "GET",
        headers: {
            'Content-Type': "application/json"
        }
    })

    const APIResponseObject = await response.json()

    return APIResponseObject.blogPosts
}

/**
 * GET /blog/top/:amount
 * 
 * @param {*} amount - the amount of top blog posts to fetch
 * @returns {Promise<Array<blogPosts>>}
 */
export async function getTop(amount) {
    const response = await fetch(API_URL + "/blog/top/" + amount, {
        method: "GET",
        headers: {
            'Content-Type': "application/json"
        }
    })

    const APIResponseObject = await response.json()

    // match what it's called in backend controller
    return APIResponseObject.blogPosts
}

export async function create(blogPost, authenticationKey) {
    const response = await fetch(
        API_URL + "/blog",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'X-AUTH-KEY': authenticationKey
            },
            body: JSON.stringify({ blogPost })
        }
    )

    const postBlogPostResult = await response.json()
    
    return postBlogPostResult
}