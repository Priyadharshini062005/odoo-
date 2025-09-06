export interface IFile extends File {
  imageUrl: string;
}

export interface IBlog {
  id: string;
  title: string;
  author: string;
  imageFile: IFile;
  publishedDate: string;
  updatedDate: string;
  content: string;
}

export interface IBlogRequest {
  id: string;
  title: string;
  author: string;
  imageFile: IFile;
  content: string;
  userId: string;
}

export interface IBlogResponse {
  id: string;
  title: string;
  author: string;
  imageFile: IFile;
  publishedDate: string;
  updatedDate: string;
  content: string;
}

export interface IBlogState {
  blogs: IBlog[]; // List of blogs
  selectedBlog: IBlog | null; // Single blog details
  isLoading: boolean; // Loading state
  error: string | null; // Error message
}
