export type Gist = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  image: string;
  imagePublicId?: string;
  author: string;
  publishedAt?: string;
  category: string;
  views: number;
  likes: number;
  comments: number;
  published: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
};
