import React from 'react';
import { Post } from '../types/post';
import { useR2Images } from '../hooks/useR2Images';

interface PostDetailProps {
  post: Post;
}

const PostCard: React.FC<PostDetailProps> = ({ post }) => {
  const imageKeys = post.images || [];
  const { imageUrls, loading, error } = useR2Images(imageKeys);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-6">
      {/* Title and Price */}
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">{post.title}</h2>
        <span className="text-xl font-bold text-green-600">${post.price}</span>
      </div>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">{post.description}</p>

      {/* Images */}
      <div>
        {loading && <div className="text-blue-500">Loading images...</div>}
        {error && <div className="text-red-500">Error: {error}</div>}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {imageKeys.map((key) =>
            imageUrls[key] ? (
              <img
                key={key}
                src={imageUrls[key]}
                alt={post.title}
                className="rounded-lg shadow-sm object-cover w-full h-40 hover:scale-105 transition-transform"
              />
            ) : null
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="text-sm text-gray-500 border-t pt-4">
        <p>
          <span className="font-medium">Created:</span>{' '}
          {post.createdAt ? new Date(post.createdAt).toLocaleString() : 'N/A'}
        </p>
        <p>
          <span className="font-medium">Updated:</span>{' '}
          {post.updatedAt ? new Date(post.updatedAt).toLocaleString() : 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default PostCard;
