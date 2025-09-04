import { supabase } from "@/lib/supabaseClient"
import type { Category } from "@/types/category"


export const getCategories = async (): Promise<Category[]> => {
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("title", { ascending: true });

    if (error) throw error;
    console.log(data);
    return buildCategoryTree((data || []) as Category[]);
};


export const getCategoryById = async (
    id: string
): Promise<Category | null> => {
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;

    return data as Category;
};


export const createCategory = async (
    category: Omit<Category, "id" | "children">
): Promise<Category> => {
    const { data, error } = await supabase
        .from("categories")
        .insert([
            {
                title: category.title,
                icon: category.icon || '🎖️',
                parent_id: category.parent_id || null,
            },
        ])
        .select()
        .single();

    if (error) throw error;

    return data as Category;
};


export const updateCategory = async (
    id: string,
    category: Partial<Omit<Category, "id" | "children">>
): Promise<Category> => {
    const { data, error } = await supabase
        .from("categories")
        .update({
            title: category.title,
            icon: category.icon,
            parent_id: category.parent_id ?? null,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return data as Category;
};


export const deleteCategory = async (id: string): Promise<void> => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
};


function buildCategoryTree(categories: Category[]): Category[] {
    const map = new Map<string, Category>();

    categories.forEach((cat) => {
        map.set(cat.id!, {
            ...cat,
            parent_id: cat.parent_id ?? null,
            children: []
        });
    });

    const roots: Category[] = [];

    categories.forEach((cat) => {
        const current = map.get(cat.id!)!;
        if (current.parent_id) {
            const parent = map.get(current.parent_id);
            if (parent) {
                parent.children?.push(current);
            }
        } else {
            roots.push(current);
        }
    });

    return roots;
}