// components/BlogForm.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IFile } from "../handlers/interfaces/blogs";

interface BlogFormProps {
  onSubmit: (
    title: string,
    author: string,
    content: string,
    imageFile: IFile | undefined
  ) => void;
  initialData?: {
    title: string;
    author: string;
    content: string;
    imageFile: IFile | undefined;
  };
}

const BlogForm: React.FC<BlogFormProps> = ({ onSubmit, initialData }) => {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [author, setAuthor] = useState(initialData?.author || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [imageFile, setImageFile] = useState<IFile | undefined>(
    initialData?.imageFile
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageFile?.imageUrl || ""
  );
  const [mounted, setMounted] = useState(false); // Track if component has mounted

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, author, content, imageFile);
  };

  // Handle image upload and preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: any = e.target.files?.[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!mounted) return null; // Avoid rendering mismatched HTML on the server

  return (
    <div className="container">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4 border border-gray-300 rounded-md max-w-xlg mx-auto"
      >
        {/* Back Button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 bg-gray-200 rounded-full hover:bg-green-100 transition duration-150"
        >
          <Image
            src="/images/back-arrow.png"
            alt="BACK"
            width={24}
            height={24}
          />
        </button>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          style={{ minHeight: "200px" }} // Minimum height for fixed size
        />

        {/* Image Upload */}
        <input
          type="file"
          accept="image/png, image/jpg, image/jpeg"
          onChange={handleImageUpload}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {imagePreview && (
          <div className="mt-4">
            <p className="text-gray-600 mb-2">Image Preview:</p>
            <Image
              src={imagePreview}
              alt="Preview"
              className="w-full h-100 object-cover rounded"
              width={120}
              height={100}
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded w-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
