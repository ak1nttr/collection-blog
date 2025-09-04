"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import type { Post } from "@/types/post"
import { getPostById } from "@/services/postService"
import PostCard from "@/components/PostCard"

export default function PostPage() {
    const params = useParams()
    const postId = typeof params.id === "string" ? params.id : undefined;

    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPost = async () => {
            if (!postId) {
                console.error("Post ID is missing or invalid.");
                setLoading(false);
                return;
            }
            try {
                const fetchedPost = await getPostById(postId)
                setPost(fetchedPost)
            } catch (error) {
                console.error("Error fetching post:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchPost()
    }, [postId])

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!post) {
        return <div>Post not found.</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FFDAB3] to-[#574964] py-5">
            <PostCard post={post} />
        </div>
    );
}