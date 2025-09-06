// pages/sustainability/edit/[id].tsx
"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import BlogForm from "@/src/components/blogForm";
import { getBlog } from "@/src/handlers/redux/slices/blogSlice";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/src/handlers/redux/hooks";
import BLOG_APIs from "@/src/handlers/apis/blog-apis";
import FILE_APIs from "@/src/handlers/apis/file-apis";

export default function EditBlog() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const {
    selectedBlog: blog,
    isLoading,
    error,
  } = useAppSelector((state: any) => state.blogs);
  const user = useAppSelector((state: any) => state.auth.user);

  useEffect(() => {
    if (id) {
      dispatch(getBlog(id as any) as any).then((action: any) => {
        if (!getBlog.fulfilled.match(action)) {
          toast.error("Failed to load blog.");
        }
      });
    }
  }, [id]);

  const handleSubmit = async (
    title: string,
    author: string,
    content: string,
    imageFile: any
  ) => {
    let imageFileResponse = undefined;

    if (imageFile instanceof File) {
      const fileFormData = new FormData();
      fileFormData.append("file", imageFile, imageFile.name);
      try {
        imageFileResponse = await FILE_APIs.uploadFile(fileFormData);
        if (imageFileResponse.status >= 400) {
          console.log(`ERROR: ${imageFileResponse.data.message}`);
          toast.error("Failed to upload blog image.");
          return;
        }
      } catch (e: any) {
        console.log(`ERROR: ${e.message}`);
        toast.error("Failed to upload blog image.");
        return;
      }
    }

    const updatedBlog = {
      title: title,
      author: author,
      imageFile: JSON.stringify(
        imageFileResponse?.data.file || blog?.imageFile || {}
      ),
      content: content,
      userId: user.id,
    };

    const response = await BLOG_APIs.updateBlog(blog.id, updatedBlog);
    if (response.status === 200 || response.status === 201) {
      toast.success("Blog saved successfully.");
      router.push("/sustainability");
    } else {
      toast.error("Failed to save blog.");
      if (imageFileResponse)
        await FILE_APIs.deleteFile(imageFileResponse?.data.file.filename);
    }
  };

  return (
    <div className="container min-h-screen mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Edit Blog</h1>
      {!isLoading && !error && (
        <BlogForm onSubmit={handleSubmit} initialData={blog} />
      )}
    </div>
  );
}
