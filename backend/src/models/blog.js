import { db } from "../database.js";

export function newBlogPost(id, date, time, user_id, title, content) {
    return {
        id,
        date,
        time,
        user_id,
        title,
        content
    }
}

export async function getAll() {
    const [allBlogPostResults] = await db.query("SELECT * FROM blog")

    return await allBlogPostResults.map((blogPost) => 
        newBlogPost(
            blogPost.id.toString(),
            blogPost.date,
            blogPost.time,
            blogPost.user_id,
            blogPost.title,
            blogPost.content
        )
    )
}

export async function getById(blogId) {
    const [blogPosts] = await db.query(
        "SELECT * FROM blog WHERE id = ?", blogId
    )

    if (blogPosts.length > 0) {
        const blogPost = blogPosts[0]
        return Promise.resolve(
            newBlogPost(
                blogPost.id.toString(),
                blogPost.date,
                blogPost.time,
                blogPost.user_id,
                blogPost.title,
                blogPost.content
            )
        )
    } else {
        return Promise.reject("No results found")
    }
}

export async function getTop(amount) {
    // Get the collection of all blog posts
    const [allBlogPostResults] = await db.query(
        "SELECT * FROM blog ORDER BY date DESC, time DESC LIMIT ?",
        [amount]
    )
    // Convert the collection of results into a list of blog post objects
    return await allBlogPostResults.map((blogPost) => 
        newBlogPost(
            blogPost.id.toString(),
            blogPost.date,
            blogPost.time,
            blogPost.user_id,
            blogPost.title,
            blogPost.content
        ))
}

export async function getByUserId(userId) {
    // Get the collection of all blog posts with matching userId
    const [blogPostResults] = await db.query(
        "SELECT * FROM blog WHERE user_id = ?", userId
    )
    // Convert the result into a blog post object
    return await blogPostResults.map((blogPost) =>
    newBlogPost(
        blogPost.id.toString(),
        blogPost.date,
        blogPost.time,
        blogPost.user_id,
        blogPost.title,
        blogPost.content
    ))
}

export async function create(blogPost) {
    // Insert blog object and return resulting promise
    return db.query(
        "INSERT INTO blog (date, time, user_id, title, content) " +
        "VALUES (?, ?, ?, ?, ?)",
        [
            blogPost.date,
            blogPost.time,
            blogPost.user_id,
            blogPost.title,
            blogPost.content
        ]
    ).then(([result]) => {
        // Return a copy of the newly created blog with it's primary key
        return { ...blogPost, id: result.insertId }
    })
}

export async function update(blogPost) {
    return db.query(
        "UPDATE blog SET title = ?, content = ? WHERE id = ?",
        [blogPost.title, blogPost.content, blogPost.id]
    )
}

export async function deleteById(blogId) {
    return db.query("DELETE FROM blog WHERE id = ?", blogId)
}