import { db } from "../database.js"

export function newLocation(id, name) {
    return {
        id,
        name,
    }
}

export async function getAll() {
    const [allLocationResults] = await db.query("SELECT * FROM location")

    return await allLocationResults.map((location) => 
        newLocation(
            location.id.toString(),
            location.name,
        )
    )
}