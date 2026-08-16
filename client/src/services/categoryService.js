import { supabase } from "../lib/supabase";

export const FALLBACK_CATEGORIES = [
  { id: "cat-1", name: "Hostel Essentials", slug: "hostel-essentials", emoji: "🏠", color: "#fff3e0", sort_order: 1 },
  { id: "cat-2", name: "Electronics & Gadgets", slug: "electronics-gadgets", emoji: "💻", color: "#e8f0fe", sort_order: 2 },
  { id: "cat-3", name: "Textbooks & Notes", slug: "textbooks-notes", emoji: "📚", color: "#fef9e7", sort_order: 3 },
  { id: "cat-4", name: "Bicycles & Mobility", slug: "bicycles-mobility", emoji: "🚲", color: "#e8f5e9", sort_order: 4 },
  { id: "cat-5", name: "Furniture & Decor", slug: "furniture-decor", emoji: "🪑", color: "#fdf2f8", sort_order: 5 },
  { id: "cat-6", name: "Appliances", slug: "appliances", emoji: "🔌", color: "#e3f2fd", sort_order: 6 },
  { id: "cat-7", name: "Fashion & Clothing", slug: "fashion-clothing", emoji: "👕", color: "#f3e5f5", sort_order: 7 },
  { id: "cat-8", name: "Sports & Fitness", slug: "sports-fitness", emoji: "⚽", color: "#e8f5e9", sort_order: 8 },
  { id: "cat-9", name: "Lab & Stationary", slug: "lab-stationary", emoji: "🔬", color: "#e0f7fa", sort_order: 9 },
  { id: "cat-10", name: "Free / Giveaway", slug: "free-giveaway", emoji: "🎁", color: "#dcfce7", sort_order: 10 },
  { id: "cat-11", name: "Others", slug: "others", emoji: "📦", color: "#f1f5f9", sort_order: 11 },
];

/**
 * Category Service for retrieving marketplace categories from Supabase.
 */
export const categoryService = {
  /**
   * Fetch all active categories ordered by sort_order.
   */
  async getActiveCategories() {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.warn("Supabase categories fetch notice, using fallback set:", error.message);
        return FALLBACK_CATEGORIES;
      }

      return data && data.length > 0 ? data : FALLBACK_CATEGORIES;
    } catch (err) {
      console.warn("Error fetching categories from Supabase, using fallback set:", err);
      return FALLBACK_CATEGORIES;
    }
  },

  /**
   * Get category by slug or name.
   */
  async getCategoryBySlug(slugOrName) {
    if (!slugOrName) return null;
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .or(`slug.eq.${slugOrName},name.eq.${slugOrName}`)
      .single();

    if (error) return null;
    return data;
  },
};

export default categoryService;
