import { supabase } from "@/lib/supabaseClient";
import type { Post } from "@/types/post";

export const getPosts = async (): Promise<Post[]> => {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error;

    return data || [];
}


export const searchPosts = async (query: string): Promise<Post[]> => {
    if (query.trim() === '') {
        console.log('got here')
        return await getPosts();
    }
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,categories.cs.{${query}}`)
        .order('created_at', { ascending: false })

    if (error) throw error;
    return data || [];
}

export const getPostById = async (id: string): Promise<Post | null> => {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error

    return data
}

export const createPost = async (post: Partial<Post>): Promise<Post> => {
    const { data, error } = await supabase
        .from('posts')
        .insert([post])
        .single()

    if (error) throw error

    return data
}

export const updatePost = async (id: string, post: Partial<Post>): Promise<Post> => {
    const { data, error } = await supabase
        .from('posts')
        .update(post)
        .eq('id', id)
        .single()

    if (error) throw error

    return data
}

export const deletePost = async (id: string): Promise<void> => {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) throw error
}