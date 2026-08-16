import { supabase } from "../lib/supabase";

/**
 * User Profile Service managing the `profiles` table.
 */
export const profileService = {
  /**
   * Fetch user profile by Auth user ID.
   */
  async getProfile(userId) {
    if (!userId) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching profile:", error);
      throw error;
    }

    return data;
  },

  /**
   * Update student profile fields.
   */
  async updateProfile(userId, updates) {
    if (!userId) throw new Error("User ID is required for profile update");

    const cleanUpdates = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // Ensure users cannot self-promote to admin or change account status directly
    delete cleanUpdates.id;
    delete cleanUpdates.role;
    delete cleanUpdates.account_status;

    const { data, error } = await supabase
      .from("profiles")
      .update(cleanUpdates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Admin-only: Update user status or verification.
   */
  async updateProfileAdmin(userId, adminUpdates) {
    const { data, error } = await supabase
      .from("profiles")
      .update(adminUpdates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

export default profileService;
