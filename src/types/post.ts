export interface Post {
  id?: string;
  title: string;
  description: string;
  price: number;
  images?: string[];
  slug: string;
  categories?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UploadedImage {
  file: File;
  url: string | null;
  key: string | null;
  uploading: boolean;
  error: string | null;
}
