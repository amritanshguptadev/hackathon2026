import { supabase } from "../lib/supabase";
import { formatProduct } from "./productService";

/**
 * Favorite / Saved Products Service.
 */
export const favoriteService = {
  /**
   * Get all favorite products for the current user.
   */
  async getUserFavorites(userId) {
    if (!userId) return [];

    const { data, error } = await supabase
      .from("favorites")
      .select(`
        id,
        created_at,
        products (
          *,
          categories (
            id,
            name,
            slug
          ),
          profiles (
            id,
            name,
            college,
            campus_location,
            verified,
            profile_image
          ),
          product_images (
            id,
            image_path,
            sort_order
          )
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching favorites:", error);
      throw error;
    }

    return (data || [])
      .map((item) => (item.products ? formatProduct(item.products) : null))
      .filter(Boolean);
  },

  /**
   * Check if a specific product is favorited by user.
   */
  async isFavorite(userId, productId) {
    if (!userId || !productId) return false;

    const { data, error } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .maybeSingle();

    if (error) return false;
    return !!data;
  },

  /**
   * Add a product to favorites.
   */
  async addFavorite(userId, productId) {
    if (!userId || !productId) throw new Error("User ID and Product ID required");

    const { data, error } = await supabase
      .from("favorites")
      .insert({
        user_id: userId,
        product_id: productId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Remove a product from favorites.
   */
  async removeFavorite(userId, productId) {
    if (!userId || !productId) throw new Error("User ID and Product ID required");

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) throw error;
    return true;
  },

  /**
   * Toggle favorite status.
   */
  async toggleFavorite(userId, productId) {
    const isFav = await this.isFavorite(userId, productId);
    if (isFav) {
      await this.removeFavorite(userId, productId);
      return false;
    } else {
      await this.addFavorite(userId, productId);
      return true;
    }
  },
};

export default favoriteService;
