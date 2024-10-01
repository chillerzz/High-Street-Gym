import { Router } from "express";
import * as Blog from "../models/blog.js"
import auth from "../middleware/auth.js";
import validator from "validator";


// TODO: Implement input validation

const blogController = Router()

blogController.get("/", async (req, res) => {
    const blogPosts = await Blog.getAll()

    res.status(200).json({
        status: 200,
        message: "Sucessfully retrieved all blog posts",
        blogPosts: blogPosts
    })
})

blogController.get("/top/:amount", async (req, res) => {
    const amount = parseInt(req.params.amount)
    
    // TODO: Implement request validation

    const blogPosts = await Blog.getTop(amount)

    res.status(200).json({
        status: 200,
        message: "Get top blog posts",
        blogPosts: blogPosts
    })
})

blogController.get("/page/:page", async (req, res) => {
    const pageSize = 5;
    const page = parseInt(req.params.page);
    
    // TODO: Implement request validation

    const blogPosts = await Blog.getByPage(page, pageSize);

    res.status(200).json({
        status: 200,
        message: "Get paginated sightings on page " + page,
        blogPosts
    })
})

blogController.get("/user/:id", async (req, res) => {
    const userId = req.params.id

    // TODO: Implement request validation

    const blogPosts = await Blog.getByUserId(userId)

    res.status(200).json({
        status: 200,
        message: "Get all blog posts by user ID",
        blogPosts
    })
})

blogController.get("/:id", (req, res) => {
    const blogPostId = req.params.id

    Blog.getById(blogPostId).then(blogPost => {
        res.status(200).json({
            status: 200,
            message: "Get blog post by ID",
            blogPost
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to get blog post by ID",
        })
    })
})

blogController.post("/", auth(["guest", "trainer"]), (req, res) => {

    const blogPostDataObject = req.body
    const blogPostData = blogPostDataObject.blogPost

    if (!/([^\s])/.test(blogPostData.content)) {
        res.status(400).json({
          status: 400,
          message: "content is empty",
        });
        return;
      }
    
      if (!/([^\s])/.test(blogPostData.title)) {
        res.status(400).json({
          status: 400,
          message: "title is empty",
        });
        return;
      }

    const blogPost = Blog.newBlogPost(
        null,
        blogPostData.date,
        blogPostData.time,
        blogPostData.user_id,
        validator.escape(blogPostData.title),
        validator.escape(blogPostData.content)
    )

    Blog.create(blogPost).then(blogPost => {
        res.status(200).json({
            status: 200,
            message: "Post created!",
            blogPost
        })
    }).catch(error => {
        console.log(error)
        res.status(500).json({
            status: 500,
            message: `Failed to create new blog / ${error}`,
        })
    })
})

// Have not implemented yet
blogController.delete("/:id", auth(["guest", "trainer"]), (req, res) => {
    const blogPostId = req.params.id

    // TODO: Implement request validation

    // TODO: If the role is guest then we should also check that
    // the post they are deleting was created by them.
    blogController.deleteById(blogPostId).then(result => {
        res.status(200).json({
        status: 200,
        message: "Post deleted",
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to delete post",
        })
    })
}
)

export default blogController