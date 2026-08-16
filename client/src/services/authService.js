import { supabase } from "../lib/supabase";

/**
 * Converts Supabase technical Auth errors and HTTP 429 status codes into friendly user messages.
 */
export function formatAuthError(error) {
  if (!error) return "An unexpected error occurred during authentication.";

  const msg = (error.message || String(error)).toLowerCase();
  const status = error.status || error.statusCode || error.code;

  console.error("Supabase Auth technical error:", error);

  // 429 Too Many Requests / Email rate limits
  if (
    status === 429 ||
    status === "429" ||
    msg.includes("rate limit") ||
    msg.includes("too many requests") ||
    msg.includes("over_email_send_rate_limit")
  ) {
    return "Too many authentication attempts. Please wait a few minutes and try again.";
  }

  // Invalid credentials
  if (
    msg.includes("invalid login credentials") ||
    msg.includes("invalid grant") ||
    msg.includes("invalid credentials") ||
    msg.includes("user not found")
  ) {
    return "Incorrect email or password.";
  }

  // Existing email
  if (
    msg.includes("user already registered") ||
    msg.includes("already exists") ||
    msg.includes("email already in use") ||
    msg.includes("duplicate key")
  ) {
    return "An account with this email already exists.";
  }

  // Weak password
  if (
    msg.includes("password should be at least") ||
    msg.includes("weak password") ||
    msg.includes("password is too short")
  ) {
    return "Please choose a stronger password (at least 6 characters).";
  }

  // Network failure
  if (
    msg.includes("failed to fetch") ||
    msg.includes("networkerror") ||
    msg.includes("network request failed") ||
    msg.includes("connection refused")
  ) {
    return "Unable to connect to the authentication server. Please check your internet connection.";
  }

  return error.message || "Authentication failed. Please try again.";
}

/**
 * Authentication Service powered solely by Supabase Auth.
 */
export const authService = {
  /**
   * Register a new student account using Supabase Auth.
   * Attaches user metadata (name, college, student_id, campus_location).
   */
  async signUp({ email, password, name, college, campusLocation = "Campus Main", studentId = "" }) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanName = (name || "").trim();
    const cleanCollege = (college || "").trim();
    const cleanCampusLocation = (campusLocation || "Campus Main").trim();
    const cleanStudentId = (studentId || "").trim();

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          name: cleanName,
          college: cleanCollege,
          campus_location: cleanCampusLocation,
          student_id: cleanStudentId,
          role: "student",
          seller_enabled: true,
        },
      },
    });

    if (error) {
      const friendlyMessage = formatAuthError(error);
      const customErr = new Error(friendlyMessage);
      customErr.original = error;
      throw customErr;
    }

    // Try to ensure profile row exists if database trigger does not run
    if (data?.user) {
      try {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", data.user.id)
          .maybeSingle();

        if (!existingProfile) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            name: cleanName,
            college: cleanCollege,
            campus_location: cleanCampusLocation,
            student_id: cleanStudentId,
            role: "student",
            verified: false,
            seller_enabled: true,
            account_status: "active",
          });
        }
      } catch (profileErr) {
        console.warn("Notice: could not auto-create profile row:", profileErr?.message);
      }
    }

    return data;
  },

  /**
   * Sign in user with email and password via Supabase.
   */
  async signIn({ email, password }) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      const friendlyMessage = formatAuthError(error);
      const customErr = new Error(friendlyMessage);
      customErr.original = error;
      throw customErr;
    }

    return data;
  },

  /**
   * Sign out current user session.
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn("Notice during signout:", error.message);
    }
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
    const cleanEmail = (email || "").trim().toLowerCase();
    const { data, error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) {
      throw new Error(formatAuthError(error));
    }
    return data;
  },
};

export default authService;
