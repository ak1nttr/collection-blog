import type { Post } from "@/types/post"
import Link from "next/link"

type PostPreviewProps = {
    post: Post
}

export default function PostPreview({ post }: PostPreviewProps) {
    return (
        <Link href={`/posts/${post.id}`}>
            <div className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl border border-gray-300 hover:border-yellow-400 transition-all duration-300 cursor-pointer w-70 flex-shrink-0 group">
                <img
                    src={post.images?.[0]}
                    alt={post.title}
                    className="h-40 w-full object-cover rounded-md"
                />
                <h3 className="text-lg font-bold mt-3 text-gray-800 group-hover:text-yellow-400 line-clamp-1 transition-colors duration-300">
                    {post.title}
                </h3>
                {post.price && (
                    <div className="mt-2 text-primary-600 group-hover:text-yellow-400 font-semibold transition-colors duration-300">{post.price} ₺</div>
                )}
            </div>
        </Link>
    )
}
