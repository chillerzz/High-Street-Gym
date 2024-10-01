import { db } from "../database.js"

export function newActivity(id, name, description, duration) {
    return {
        id,
        name,
        description,
        duration
    }
}

// USING
export async function getById(activityId) {
    const [activities] = await db.query(
        "SELECT * FROM activities WHERE id = ?", activityId
    )
    if (activities.length > 0) {
        const activity = activities[0]
        return Promise.resolve(
            newActivity(
                activity.id.toString(),
                activity.name,
                activity.description,
                activity.duration,
            )
        )
    } else {
        return Promise.reject("No results found")
    }
}

export async function getAll() {
    const [allActivityResults] = await db.query("SELECT * FROM activities")

    return await allActivityResults.map((activity) => 
        newActivity(
            activity.id.toString(),
            activity.name,
            activity.description,
            activity.duration,
        )
    )
}