// pages/sustainability/createBlog.tsx
"use client";
import BlogForm from "@/src/components/blogForm";
import BLOG_APIs from "@/src/handlers/apis/blog-apis";
import FILE_APIs from "@/src/handlers/apis/file-apis";
import { useAppSelector } from "@/src/handlers/redux/hooks";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CreateBlog() {
  const router = useRouter();

  const user = useAppSelector((state: any) => state.auth.user);

  const handleSubmit = async (
    title: string,
    author: string,
    content: string,
    imageFile: any
  ) => {
    const fileFormData = new FormData();

    fileFormData.append("file", imageFile, imageFile?.name);

    const imageFileResponse = await FILE_APIs.uploadFile(fileFormData);
    if (imageFileResponse.status >= 400) {
      toast.error("Failed to upload blog image.");
      return;
    }

    const newBlog = {
      title: title,
      author: author,
      imageFile: JSON.stringify(imageFileResponse.data.file),
      content: content,
      userId: user.id,
    };

    const response = await BLOG_APIs.createBlog(newBlog);
    if (response.status === 200 || response.status === 201) {
      toast.success("Blog saved successfully.");
      router.push("/sustainability");
    } else {
      toast.error("Failed to save blog.");
      await FILE_APIs.deleteFile(imageFileResponse.data.file.filename);
    }
  };

  return (
    <div className="min-h-screen container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Create New Blog</h1>
      <BlogForm onSubmit={handleSubmit} />
    </div>
  );
}
