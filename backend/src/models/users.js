import { db } from "../database.js";

export function newUser(id, email, password, role, phone, first_name, last_name, address, authenticationKey) {
    return {
        id,
        email,
        password,
        role,
        phone,
        first_name,
        last_name,
        address,
        authenticationKey
    }
}

export async function getAll() {
    const [allUserResults] = await db.query("SELECT * FROM users")

    return await allUserResults.map((userResult) => 
        newUser(
            userResult.id.toString(),
            userResult.email,
            userResult.password,
            userResult.role,
            userResult.phone,
            userResult.first_name,
            userResult.last_name,
            userResult.address,
            userResult.authentication_key,
        ))
}

export async function getById(userId) {
    const [userResults] = await db.query(
        "SELECT * FROM users WHERE id = ?", userId
    )

    if (userResults.length > 0) {
        const userResult = userResults[0]
        return Promise.resolve(
            newUser(
                userResult.id.toString(),
                userResult.email,
                userResult.password,
                userResult.role,
                userResult.phone,
                userResult.first_name,
                userResult.last_name,
                userResult.address,
                userResult.authentication_key,
            )
        )
    } else {
        return Promise.reject("No results found")
    }
}

export async function getByEmail(email) {
    const [userResults] = await db.query(
        "SELECT * FROM users WHERE email = ?", email
    )
    
    if (userResults.length > 0) {
        const userResult = userResults[0]
        return Promise.resolve(
            newUser(
                userResult.id.toString(),
                userResult.email,
                userResult.password,
                userResult.role,
                userResult.phone,
                userResult.first_name,
                userResult.last_name,
                userResult.address,
                userResult.authentication_key,
            )
        )
    } else {
        return Promise.reject("No results found")
    }
}

export async function getByAuthenticationKey(authentication_key) {
    const [userResults] = await db.query(
        "SELECT * FROM users WHERE authentication_key = ?", authentication_key
    )

    if (userResults.length > 0) {
        const userResult = userResults[0]
        return Promise.resolve(
            newUser(
                userResult.id.toString(),
                userResult.email,
                userResult.password,
                userResult.role,
                userResult.phone,
                userResult.first_name,
                userResult.last_name,
                userResult.address,
                userResult.authentication_key,
            )
        )
    } else {
        return Promise.reject("no results found")
    }
}

export async function create(user) {

    return db.query(
        "INSERT INTO users (email, password, role, phone, first_name, last_name, address)"
        + "VALUE (?, ?, ?, ?, ?, ?, ?)",
        [
            user.email,
            user.password,
            user.role,
            user.phone,
            user.first_name,
            user.last_name,
            user.address
        ]
    ).then(([result]) => {
        return { ...user, id: result.insertId }
    })
}

// Dynamically generated sql query based on if the user object has an email field or not
export async function update(user) {
    // Extract the fields from the user object
    const { id, password, role, phone, first_name, last_name, address, authenticationKey } = user;

    // Build the SQL query dynamically based on the provided fields
    let sql = "UPDATE users SET ";
    let values = [];
    if (password !== undefined) {
        sql += "password = ?, ";
        values.push(password);
    }
    if (role !== undefined) {
        sql += "role = ?, ";
        values.push(role);
    }
    if (phone !== undefined) {
        sql += "phone = ?, ";
        values.push(phone);
    }
    if (first_name !== undefined) {
        sql += "first_name = ?, ";
        values.push(first_name);
    }
    if (last_name !== undefined) {
        sql += "last_name = ?, ";
        values.push(last_name);
    }
    if (address !== undefined) {
        sql += "address = ?, ";
        values.push(address);
    }
    if (authenticationKey !== undefined) {
        sql += "authentication_key = ?, ";
        values.push(authenticationKey);
    }

    // Remove the trailing comma and space from the SQL query
    sql = sql.slice(0, -2);

    // Add the WHERE clause to specify the user ID
    sql += " WHERE id = ?";
    values.push(id);

    // Execute the query
    return db.query(sql, values)
        .then(([result]) => {
            return { ...user, id: result.insertId };
        })
        .catch(error => {
            throw error;
        });
}

export async function deleteById(userId) {
    return db.query("DELETE FROM users WHERE id = ?", userId)
}