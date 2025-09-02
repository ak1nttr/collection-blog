import type { Post } from "@/types/post"
import Link from "next/link"

type PostPreviewProps = {
    post: Post
}

export default function PostPreview({ post }: PostPreviewProps) {
    return (
        <Link href={`/posts/${post.id}`}>
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition cursor-pointer w-70 flex-shrink-0">
                <img
                    src={post.images?.[0]}
                    alt={post.title}
                    className="h-40 w-full object-cover rounded-md"
                />
                <h3 className="text-lg font-semibold mt-3 text-gray-800 line-clamp-1">
                    {post.title}
                </h3>
                {post.price && (
                    <div className="mt-2 text-primary-600 font-medium">{post.price} ₺</div>
                )}
            </div>
        </Link>
    )
}
