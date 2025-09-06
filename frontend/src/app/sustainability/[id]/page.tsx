// pages/sustainability/[id].tsx
"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getBlog } from "@/src/handlers/redux/slices/blogSlice";
import { toast } from "react-toastify";
import { useAppSelector } from "@/src/handlers/redux/hooks";
import Image from "next/image";
import BLOG_APIs from "@/src/handlers/apis/blog-apis";
import BLOD_DEFAULT_IMAGE from "@/public/images/default-blog.jpg";

export default function Blog() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  const { selectedBlog: blog } = useAppSelector((state: any) => state.blogs);
  const user = useAppSelector((state: any) => state.auth.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(getBlog(id as any) as any).then((action: any) => {
        if (!getBlog.fulfilled.match(action)) {
          toast.error("Failed to load blog.");
        }
      });
    }
  }, [id]);

  const handleDeleteBlog = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete this blog? This action cannot be undone."
    );

    if (confirmed) {
      try {
        const response = await BLOG_APIs.deleteBlog(id as any);
        if (response.status >= 200 && response.status < 400) {
          toast.success("Blog deleted successfully!");
          router.push("/sustainability");
        }
      } catch (error: any) {
        console.log(`ERROR: ${error?.message}`);
        toast.error("Failed to delete blog.");
      }
    }
  };

  if (!mounted) return <div className="min-h-screen bg-gray-50"></div>;

  return (
    <div className="min-h-screen py-10 from-green-100 via-white to-green-100 flex items-center justify-center">
      <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-2xl">
        {/* Toolbar Section for Action Buttons */}
        <div className="flex justify-between items-center p-6 bg-white rounded-t-xl">
          <button
            onClick={() => router.push("/sustainability")}
            className="p-2 bg-gray-200 rounded-full hover:bg-green-100 transition duration-150"
            title="Back"
          >
            <Image
              src="/images/back-arrow.png"
              alt="BACK"
              width={24}
              height={24}
            />
          </button>

          {user?.id == blog?.authorId && (
            <div className="flex space-x-4 text-gray-600">
              <button
                onClick={() => router.push(`/sustainability/${id}/edit-blog`)}
                className="p-3 bg-gray-200 rounded-full hover:bg-blue-100 hover:text-blue-600 transition duration-150"
                title="Edit Blog"
              >
                <Image
                  src="/images/edit.png"
                  alt="EDIT"
                  width={24}
                  height={24}
                />
              </button>
              <button
                onClick={handleDeleteBlog}
                className="p-3 bg-gray-200 rounded-full hover:bg-red-100 hover:text-red-600 transition duration-150"
                title="Delete Blog"
              >
                <Image
                  src="/images/delete.png"
                  alt="DELETE"
                  width={24}
                  height={24}
                />
              </button>
            </div>
          )}
        </div>

        {/* Blog Content */}
        <div className="p-10">
          <h1 className="text-5xl font-extrabold mb-4 text-gray-800 leading-tight">
            {blog?.title}
          </h1>
          <div className="text-gray-500 text-sm flex space-x-4 mb-6">
            <span className="flex items-center space-x-1">
              <Image
                src="/images/calendar.png"
                alt="Published Date"
                width={16}
                height={16}
              />
              <span>Published: {blog?.publishedDate}</span>
            </span>
            {blog?.updatedDate && (
              <span className="flex items-center space-x-1">
                <Image
                  src="/images/updated.png"
                  alt="Updated Date"
                  width={16}
                  height={16}
                />
                <span>Updated: {blog.updatedDate}</span>
              </span>
            )}
          </div>
          <p className="text-green-600 font-semibold text-lg mb-6">
            By: {blog?.author}
          </p>
          <div className="relative h-96 mb-6 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={blog?.imageFile?.imageUrl || BLOD_DEFAULT_IMAGE}
              alt={blog?.title}
              className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
              width={100}
              height={100}
            />
          </div>
          <div className="prose prose-lg text-gray-700 leading-relaxed max-w-none text-justify">
            {blog?.content}
          </div>
        </div>
      </div>
    </div>
  );
}
