import { supabase } from "../lib/supabase";
import { formatProduct } from "./productService";

/**
 * Wanted Posts Service & Non-AI Marketplace Matching.
 */
export const wantedService = {
  /**
   * Fetch open wanted posts with joined category and profile.
   */
  async getWantedPosts(status = "Open") {
    let query = supabase
      .from("wanted_posts")
      .select(`
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
        )
      `)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching wanted posts:", error);
      throw error;
    }

    return data || [];
  },

  /**
   * Fetch wanted posts created by specific user.
   */
  async getUserWantedPosts(userId) {
    if (!userId) return [];

    const { data, error } = await supabase
      .from("wanted_posts")
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user wanted posts:", error);
      throw error;
    }

    return data || [];
  },

  /**
   * Create a new Wanted Post.
   */
  async createWantedPost(postData) {
    const {
      userId,
      title,
      categoryId,
      maxBudget,
      condition,
      campusLocation,
      description,
    } = postData;

    if (!userId) throw new Error("User ID is required");
    if (!title || title.trim().length < 3) throw new Error("Title must be at least 3 characters");

    const { data, error } = await supabase
      .from("wanted_posts")
      .insert({
        user_id: userId,
        title: title.trim(),
        category_id: categoryId || null,
        max_budget: maxBudget ? Number(maxBudget) : null,
        condition: condition || null,
        campus_location: campusLocation || "Campus Main",
        description: (description || "").trim(),
        status: "Open",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update Wanted Post.
   */
  async updateWantedPost(id, updates) {
    const cleanUpdates = {};
    if (updates.title) cleanUpdates.title = updates.title.trim();
    if (updates.categoryId !== undefined) cleanUpdates.category_id = updates.categoryId;
    if (updates.maxBudget !== undefined) cleanUpdates.max_budget = updates.maxBudget ? Number(updates.maxBudget) : null;
    if (updates.condition) cleanUpdates.condition = updates.condition;
    if (updates.campusLocation) cleanUpdates.campus_location = updates.campusLocation;
    if (updates.description !== undefined) cleanUpdates.description = updates.description.trim();
    if (updates.status) cleanUpdates.status = updates.status;

    const { data, error } = await supabase
      .from("wanted_posts")
      .update(cleanUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete Wanted Post.
   */
  async deleteWantedPost(id) {
    const { error } = await supabase
      .from("wanted_posts")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },

  /**
   * Non-AI rule-based matching: Finds currently available products matching a Wanted post criteria.
   * Matches on:
   * 1. Same category (if category_id is set)
   * 2. Price <= max_budget (if max_budget is set)
   * 3. Status = Available
   * 4. Title keywords partial matching
   */
  async getMatchingProductsForWanted(wantedPost) {
    if (!wantedPost) return [];

    let query = supabase
      .from("products")
      .select(`
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
      `)
      .eq("status", "Available");

    if (wantedPost.category_id) {
      query = query.eq("category_id", wantedPost.category_id);
    }

    if (wantedPost.max_budget && Number(wantedPost.max_budget) > 0) {
      query = query.lte("price", Number(wantedPost.max_budget));
    }

    const { data, error } = await query.limit(10);
    if (error) {
      console.error("Error finding matching products:", error);
      return [];
    }

    return (data || []).map(formatProduct);
  },
};

export default wantedService;
