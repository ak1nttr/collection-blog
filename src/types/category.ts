export interface Category {
  id?: string;
  title: string;
  icon: string;
  subcategories?: string[];
  parent_id?: string | null;
  children?: Category[];
}