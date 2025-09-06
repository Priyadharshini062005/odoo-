"use client";
import axios from "axios";

const getBlogs = async () => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs`, {
    headers: { "Content-Type": "application/json" },
  });
};

const getBlog = async (blogId: string) => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs/${blogId}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};

const createBlog = async (blog: any) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs/create`,
    blog,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};

const updateBlog = async (blogId: string, blog: any) => {
  return await axios.put(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs/${blogId}`,
    blog,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};

const deleteBlog = async (blogId: string) => {
  return await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs/${blogId}`,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};

const BLOG_APIs = {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
};

export default BLOG_APIs;
