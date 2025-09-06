const Blog = require("../models/BlogModel");


const convertToDateFormat = (timestamp) => {
    if(timestamp == "") return timestamp;
    const date = new Date(parseInt(timestamp));
    const formattedDate = date.toLocaleDateString();
    return String(formattedDate);
}

const shortContent = (content) => {
   return content.substr(0, Math.min(content.length, 300));
}

exports.getBlogs = async (req, res) => {
  try {
        const blogResponse = await Blog.find({});
        let blogs = [];
        for(let blog of blogResponse){
            blogs.push({
                id: blog._id,
                title: blog.title,
                author: blog.author,
                imageFile: blog.imageFile,
                publishedDate: convertToDateFormat(blog.publishedDate),
                updatedDate: convertToDateFormat(blog.updatedDate),
                authorId: blog.authorId,
                content: shortContent(blog.content)
            })
        }
        res.status(200).json(blogs);
    } catch(error){
        console.log(`Error: ${error.message}`);
        res.status(500).json({message: "Failed to get blogs"});
    }
};

exports.getBlog = async (req, res) => {
    const blogId = req.params.blogId;
    try {
        const blogResponse = await Blog.findById({_id: blogId});
        const blog ={
            id: blogResponse._id,
            title: blogResponse.title,
            author: blogResponse.author,
            imageFile: blogResponse.imageFile,
            publishedDate: convertToDateFormat(blogResponse.publishedDate),
            updatedDate: convertToDateFormat(blogResponse.updatedDate),
            authorId: blogResponse.authorId,
            content: blogResponse.content
        }

        res.status(200).json(blog);
    } catch(error){
        console.log(`Error: ${error.message}`);
        res.status(500).json({message: "Failed to get blog."});
    }
};

exports.createBlog = async (req, res) => {
    const {title, author, imageFile, content, userId} = req.body;
    const publishedDate = Date.now();
    const updatedDate = "";
    
    const blog = new Blog({title, author, content, imageFile, content, publishedDate, updatedDate, authorId: userId});
    
    try {
        const blogRes = await blog.save()
        res.status(200).json(blogRes);
    } catch(error){
        console.log(`Error: ${error.message}`);
        res.status(500).json({message: "Failed to create blog."});
    }
};

exports.updateBlog = async (req, res) => {
    const {title, author, imageFile, content} = req.body;
    const blogId = req.params.blogId;
    const updatedDate = Date.now();
    try {
        const blogResponse = await Blog.findByIdAndUpdate({ "_id": blogId }, { "$set": {"title": title, "author": author, "imageFile": imageFile, "content": content, "updatedDate": updatedDate}});
        res.status(200).json(blogResponse);
    } catch(error){
        console.log(`Error: ${error.message}`);
        res.status(500).json({message: "Failed to update blog."});
    }
};

exports.deleteBlog = async (req, res) => {
    const blogId = req.params.blogId;    
    try {
        const blogResponse = await Blog.findByIdAndDelete({_id: blogId});
        res.status(200).json({ message: "Blog deleted successfully", blog: blogResponse });
    } catch(error){
        console.log(`Error: ${error.message}`);
        res.status(500).json({message: "Failed to delete blog."});
    }
};
