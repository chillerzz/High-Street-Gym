import { db } from "../database.js"

export function newClass(
    id,
    date,
    location_id,
    activity_id,
    trainer_user_id,
    time
) {
    return {
        id,
        date,
        location_id,
        activity_id,
        trainer_user_id,
        time
    }
};

export function newClassLocationActivityTrainer(
    id,
    date,
    time,
    location_id,
    trainer_user_id,
    activity_id,
    name,
    description,
    duration,
    location_name,
    user_id,
    first_name,
    last_name
) {
    return {
        id,
        date,
        time,
        location_id,
        trainer_user_id,
        activity_id,
        name,
        description,
        duration,
        location_name,
        user_id,
        first_name,
        last_name
    }
};

export async function getClassByTimeTrainerLocation(date, time, trainer_user_id, location_id) {
    const [results] = await db.query(`
    SELECT * 
    FROM classes 
    WHERE classes.date = ? AND classes.time = ? AND classes.trainer_user_id = ? AND classes.location_id = ?
    `
    , [date, time, trainer_user_id, location_id]);

    return await classResults.map((classResult) => 
    newClassLocationActivityTrainer(
        classResult.id.toString(),
        classResult.date,
        classResult.time,
        classResult.location_id.toString(),
        classResult.trainer_user_id.toString(),
        classResult.activity_id.toString(),
        classResult.name,
        classResult.description,
        classResult.duration,
        classResult.location_name,
        classResult.user_id,
        classResult.first_name,
        classResult.last_name
    ))
}

// Usage
// const weekStartDate = '2024-04-01'; // Example week start date (Monday)
// const weekEndDate = '2024-04-07';   // Example week end date (Sunday)

// displayAllUniqueClassesForWeek(weekStartDate, weekEndDate)
//     .then(result => console.log(result))
//     .catch(error => console.error('Error fetching classes for the week:', error));


export const displayAllUniqueClassesForWeek = async (weekStartDate, weekEndDate) => {
    const [results] = await db.query(`
        SELECT DISTINCT classes.date, activity_id, activities.name, activities.description
        FROM classes
        JOIN activities ON classes.activity_id = activities.id
        WHERE classes.date BETWEEN ? AND ?
        ORDER BY classes.date
        `
    , [weekStartDate, weekEndDate]);


    return results.reduce((classesByDate, classInfo) => {
        const { date, ...classData } = classInfo;
        if (!classesByDate[date]) {
            classesByDate[date] = [];
        }
        classesByDate[date].push(classData);
        return classesByDate;
    }, {});
};

// Usage
// const weekStartDate = '2024-04-01'; // Example week start date (Monday)
// const weekEndDate = '2024-04-07';   // Example week end date (Sunday)

// displayAllUniqueClassesForWeek(weekStartDate, weekEndDate)
//     .then(result => console.log(result))
//     .catch(error => console.error('Error fetching classes for the week:', error));

export async function getClassesbyDateAndActivityId(date, id) {
    const [classResults] = await db.query(`
    SELECT classes.id, classes.date, classes.time, classes.location_id, classes.trainer_user_id, classes.activity_id, 
    activities.name, activities.description, activities.duration,
    location.name AS 'location_name',
	users.first_name, users.last_name
        FROM classes
        JOIN activities ON classes.activity_id = activities.id
        JOIN users ON classes.trainer_user_id = users.id
        JOIN location ON classes.location_id = location.id
        WHERE classes.date = ? AND classes.activity_id = ?
    `, [date, id])

    return await classResults.map((classResult) => 
    newClassLocationActivityTrainer(
        classResult.id.toString(),
        classResult.date,
        classResult.time,
        classResult.location_id.toString(),
        classResult.trainer_user_id.toString(),
        classResult.activity_id.toString(),
        classResult.name,
        classResult.description,
        classResult.duration,
        classResult.location_name,
        classResult.user_id,
        classResult.first_name,
        classResult.last_name
    ))
}


// Usage
// const date = '2024-04-22'; // Example week start date (Monday)
// const id = '2';   // Example week end date (Sunday)

// getClassesbyDateAndActivityId(date, id)
//     .then(result => console.log(result))
//     .catch(error => console.error('Error fetching classes for the week:', error));

export async function getKey() {
    const [classResults] = await db.query(`
    SELECT classes.id, classes.date, classes.time, classes.location_id, classes.trainer_user_id, classes.activity_id, 
    activities.name, activities.description, activities.duration,
    location.name AS 'location_name',
	users.first_name, users.last_name
        FROM classes
        JOIN activities ON classes.activity_id = activities.id
        JOIN users ON classes.trainer_user_id = users.id
        JOIN location ON classes.location_id = location.id
    `,)

    return await classResults.map((classResult) => 
    newClassLocationActivityTrainer(
        classResult.id.toString(),
        classResult.date,
        classResult.time,
        classResult.location_id.toString(),
        classResult.trainer_user_id.toString(),
        classResult.activity_id.toString(),
        classResult.name,
        classResult.description,
        classResult.duration,
        classResult.location_name,
        classResult.user_id,
        classResult.first_name,
        classResult.last_name
    ))
}

// Dont think this will work - Think i need a few getAll()
// SELECT 
// location.id AS location_id,
// location.name AS location_name,
// activities.id AS activity_id,
// activities.name AS activity_name,
// users.id AS user_id,
// users.first_name,
// users.last_name
// FROM 
// classes
// JOIN
// locations ON classes.location_id = locations.id
// JOIN
// activities ON classes.activity_id = activities.id
// JOIN
// users ON classes.trainer_user_id = users.id;








export async function create(classes) {
    // Insert trail object and return resulting promise
    return db.query(
        "INSERT INTO classes (date, location_id, activity_id, trainer_user_id, time) VALUES (?, ?, ?, ?, ?)",
        [classes.date, classes.location_id, classes.activity_id, classes.trainer_user_id, classes.time]
    ).then(([result]) => {
        // Return a copy of the newly trail sighting with it's primary key
        return { ...classes, id: result.insertId }
    })
}

export async function update(classes) {
    return db.query(
        "UPDATE classes SET date = ?, location_id = ?, activity_id = ?, trainer_user_id = ?, time = ?",
        [classes.id]
    )
}

export async function deleteById(classId) {
    return db.query("DELETE FROM classes WHERE id = ?", classId)
}