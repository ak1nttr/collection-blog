import React, { useState } from 'react';
import { Post } from '../types/post';

interface PostDetailProps {
  post: Post;
}
// TODO: foto siyah görünüyo onu düzelt

const PostCard: React.FC<PostDetailProps> = ({ post }) => {
  const images = post.images || [];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const mainImage = images[mainImageIndex] || null;

  return (
    <div className="max-w-6xl mx-auto bg-[#f8f8f8df] shadow-xl rounded-3xl overflow-hidden border border-yellow-400">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        
        {/* Image Gallery Section */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative">
            {images.length === 0 && (
              <div className="flex items-center justify-center h-96 bg-gray-100 rounded-2xl">
                <div className="text-gray-500">No images available</div>
              </div>
            )}
            {mainImage && (
              <div 
                className="relative group cursor-zoom-in"
                onClick={() => setSelectedImage(mainImage)}
              >
                <img
                  src={mainImage}
                  alt={post.title}
                  className="w-full h-96 object-cover rounded-lg shadow-lg shadow-gray-500 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-transparent group-hover:bg-gray-900/60 rounded-lg transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto p-1">
              {images.map((imageUrl: string, index: number) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`${post.title} - Image ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer flex-shrink-0 transition-all duration-200 ${
                    index === mainImageIndex 
                      ? 'ring-2 ring-[#6C5D7C] ring-offset-1' 
                      : 'hover:opacity-80'
                  }`}
                  onClick={() => setMainImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          {/* Title and Price */}
          <div className="space-y-3">
            <h1 className="text-5xl lg:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
              {post.title}
            </h1>
            {post.price && (
              <div className="flex items-center gap-2">
                <span className="text-4xl font-extrabold text-yellow-600 font-['Arial','sans-serif']">
                  {post.price} ₺
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="prose prose-gray max-w-none">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-700 text-lg font-medium leading-relaxed whitespace-pre-line">
              {post.description || 'Bu ürün için bir açıklama yok.'}
            </p>
          </div>

          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="space-y-3 pt-10">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">Kategoriler</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-[#6C5D7C] text-white hover:bg-[#574964] cursor-pointer transition-colors duration-200"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-gray-900/60 bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt={post.title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
