import { supabase } from "../lib/supabase";

/**
 * Authentication Service powered by Supabase Auth.
 */
export const authService = {
  /**
   * Register a new student account using Supabase Auth.
   * Attaches user metadata (name, college, studentId, campus_location) which can automatically
   * populate or sync with the `profiles` table.
   */
  async signUp({ email, password, name, college, campusLocation = "Campus Main", studentId = "" }) {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          name: name.trim(),
          college: (college || "").trim(),
          campus_location: (campusLocation || "Campus Main").trim(),
          student_id: (studentId || "").trim(),
          role: "student",
        },
      },
    });

    if (error) throw error;

    // Ensure a corresponding row exists in the profiles table
    if (data?.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: data.user.id,
            name: name.trim(),
            college: (college || "").trim(),
            campus_location: (campusLocation || "Campus Main").trim(),
            role: "student",
            verified: false,
            account_status: "active",
          },
          { onConflict: "id" }
        );

      if (profileError) {
        console.warn("Profile creation warning during signup:", profileError.message);
      }
    }

    return data;
  },

  /**
   * Sign in user with email and password.
   */
  async signIn({ email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign out current user session.
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get active session.
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * Get current authenticated user.
   */
  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  /**
   * Listen to auth state changes.
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },

  /**
   * Password reset request.
   */
  async resetPassword(email) {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw error;
    return data;
  },
};

export default authService;
