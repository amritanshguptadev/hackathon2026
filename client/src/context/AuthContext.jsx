import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/authService";
import { profileService } from "../services/profileService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile from Supabase profiles table
  const fetchProfile = useCallback(async (userId, fallbackUser = null) => {
    if (!userId) {
      setProfile(null);
      return null;
    }

    try {
      const data = await profileService.getProfile(userId);
      if (data) {
        setProfile(data);
        return data;
      }

      // If profile row doesn't exist yet, synthesize from Auth user metadata
      if (fallbackUser?.user_metadata) {
        const meta = fallbackUser.user_metadata;
        const synthetic = {
          id: userId,
          name: meta.name || fallbackUser.email?.split("@")[0] || "Student",
          college: meta.college || "Campus Community",
          campus_location: meta.campus_location || "Campus Main",
          student_id: meta.student_id || "",
          role: meta.role || "student",
          seller_enabled: meta.seller_enabled !== false,
          verified: false,
          account_status: "active",
          created_at: fallbackUser.created_at,
        };
        setProfile(synthetic);
        return synthetic;
      }
    } catch (err) {
      console.warn("Notice: could not load profile, falling back to auth metadata:", err.message);
      if (fallbackUser?.user_metadata) {
        const meta = fallbackUser.user_metadata;
        const fallbackProfile = {
          id: userId,
          name: meta.name || fallbackUser.email?.split("@")[0] || "Student",
          college: meta.college || "Campus",
          campus_location: meta.campus_location || "Campus Main",
          student_id: meta.student_id || "",
          role: meta.role || "student",
          seller_enabled: meta.seller_enabled !== false,
          verified: false,
          account_status: "active",
          created_at: fallbackUser.created_at,
        };
        setProfile(fallbackProfile);
        return fallbackProfile;
      }
    }
    return null;
  }, []);

  // Initialize session from Supabase on startup and subscribe to auth state changes
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const initialSession = await authService.getSession();
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user || null);
          if (initialSession?.user) {
            await fetchProfile(initialSession.user.id, initialSession.user);
          }
        }
      } catch (err) {
        console.error("Auth initialization notice:", err?.message || err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    // Subscribe to Supabase auth events (login, logout, token refresh, user update)
    const { data: authListener } = authService.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;

      setSession(currentSession);
      const currentUser = currentSession?.user || null;
      setUser(currentUser);

      if (currentUser) {
        // Sync legacy localStorage keys for backward UI compatibility
        if (currentSession?.access_token) {
          localStorage.setItem("token", currentSession.access_token);
        }
        if (currentUser.user_metadata?.name) {
          localStorage.setItem("loggedInUser", currentUser.user_metadata.name);
        }
        if (currentUser.user_metadata?.college) {
          localStorage.setItem("college", currentUser.user_metadata.college);
        }
        if (currentUser.user_metadata?.student_id) {
          localStorage.setItem("studentId", currentUser.user_metadata.student_id);
        }
        await fetchProfile(currentUser.id, currentUser);
      } else {
        setProfile(null);
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("college");
        localStorage.removeItem("studentId");
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign In with email & password
  const signIn = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await authService.signIn({ email, password });
      setUser(data.user);
      setSession(data.session);
      if (data.user) {
        await fetchProfile(data.user.id, data.user);
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  // Sign Up with email, password, and metadata
  const signUp = async (params) => {
    setLoading(true);
    try {
      const data = await authService.signUp(params);
      if (data.user) {
        setUser(data.user);
        setSession(data.session || null);
        await fetchProfile(data.user.id, data.user);
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  // Sign Out
  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Refresh current user profile
  const refreshProfile = async () => {
    if (user?.id) {
      return fetchProfile(user.id, user);
    }
  };

  // Update profile
  const updateProfile = async (updates) => {
    if (!user?.id) throw new Error("No authenticated user session");
    const updated = await profileService.updateProfile(user.id, updates);
    setProfile(updated);
    return updated;
  };

  const isAdmin = profile?.role === "admin" || user?.user_metadata?.role === "admin";
  const isSeller = profile?.seller_enabled !== false;
  const isAuthenticated = !!user;

  const value = {
    user,
    session,
    profile,
    loading,
    isAuthenticated,
    isSeller,
    isAdmin,
    signUp,
    signIn,
    signOut,
    // Aliases for compatibility
    signup: signUp,
    login: signIn,
    logout: signOut,
    refreshProfile,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
