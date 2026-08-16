import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/authService";
import { profileService } from "../services/profileService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile from profiles table
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
          verified: false,
          account_status: "active",
        };
        setProfile(synthetic);
        return synthetic;
      }
    } catch (err) {
      console.warn("Notice: could not load profile, falling back to auth metadata:", err.message);
      if (fallbackUser?.user_metadata) {
        const meta = fallbackUser.user_metadata;
        setProfile({
          id: userId,
          name: meta.name || "Student",
          college: meta.college || "Campus",
          role: "student",
        });
      }
    }
    return null;
  }, []);

  // Initialize session and listen to Auth state changes
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
        console.error("Auth initialization error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    // Subscribe to auth changes (login, logout, token refresh)
    const { data: authListener } = authService.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;

      setSession(currentSession);
      const currentUser = currentSession?.user || null;
      setUser(currentUser);

      if (currentUser) {
        // Sync legacy localStorage keys for existing UI compatibility
        localStorage.setItem("token", currentSession.access_token);
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

  // Sign in
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await authService.signIn({ email, password });
      setUser(data.user);
      setSession(data.session);
      await fetchProfile(data.user.id, data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  // Sign up
  const signup = async (params) => {
    setLoading(true);
    try {
      const data = await authService.signUp(params);
      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        await fetchProfile(data.user.id, data.user);
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const logout = async () => {
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
    if (!user?.id) throw new Error("No authenticated user");
    const updated = await profileService.updateProfile(user.id, updates);
    setProfile(updated);
    return updated;
  };

  const isAdmin = profile?.role === "admin" || user?.user_metadata?.role === "admin";
  const isAuthenticated = !!user;

  const value = {
    user,
    session,
    profile,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    signup,
    logout,
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
