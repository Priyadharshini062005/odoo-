"use client";
import axios from "axios";

const uploadFile = async (file: any) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/file/upload`,
    file,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

const deleteFile = async (filename: string) => {
  return await axios.delete(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/file/${filename}`,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

const FILE_APIs = {
  uploadFile,
  deleteFile,
};

export default FILE_APIs;
