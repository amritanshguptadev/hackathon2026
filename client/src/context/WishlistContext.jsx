import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { favoriteService } from "../services/favoriteService";
import { useAuth } from "./AuthContext";
import { DEMO_LISTINGS } from "../data/images";

const WishlistContext = createContext();

const STORAGE_KEY = "buykaro_favorites";

export function WishlistProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      // Provide an initial favorite default so the page looks great immediately on first load
      return [
        DEMO_LISTINGS[0], // HP ProBook
        DEMO_LISTINGS[1], // Hero Sprint Mountain Bike
        DEMO_LISTINGS[2], // Studio Headphones
      ];
    } catch {
      return [DEMO_LISTINGS[0], DEMO_LISTINGS[1], DEMO_LISTINGS[2]];
    }
  });

  const [loading, setLoading] = useState(false);

  // Sync with Supabase when user logs in
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      setLoading(true);
      favoriteService
        .getUserFavorites(user.id)
        .then((remoteFavs) => {
          if (Array.isArray(remoteFavs) && remoteFavs.length > 0) {
            setFavorites(remoteFavs);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteFavs));
          }
        })
        .catch((err) => {
          console.warn("Could not load remote favorites, using local storage:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, user?.id]);

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error("Error saving favorites to localStorage:", e);
    }
  }, [favorites]);

  const isFavorite = (productId) => {
    if (!productId) return false;
    return favorites.some(
      (item) => String(item._id) === String(productId) || String(item.id) === String(productId)
    );
  };

  const addFavorite = async (product) => {
    if (!product) return;
    const prodId = product._id || product.id;
    if (isFavorite(prodId)) return;

    const updated = [product, ...favorites];
    setFavorites(updated);
    toast.success(`❤️ Added "${product.title?.slice(0, 32)}..." to Liked Items!`);

    if (isAuthenticated && user?.id && !String(prodId).startsWith("bk-") && !String(prodId).startsWith("custom-")) {
      try {
        await favoriteService.addFavorite(user.id, prodId);
      } catch (err) {
        console.warn("Error syncing favorite to server:", err);
      }
    }
  };

  const removeFavorite = async (productId) => {
    if (!productId) return;
    const item = favorites.find(
      (p) => String(p._id) === String(productId) || String(p.id) === String(productId)
    );
    const updated = favorites.filter(
      (p) => String(p._id) !== String(productId) && String(p.id) !== String(productId)
    );
    setFavorites(updated);
    if (item) {
      toast.info(`Removed "${item.title?.slice(0, 32)}..." from Liked Items`);
    }

    if (isAuthenticated && user?.id && !String(productId).startsWith("bk-") && !String(productId).startsWith("custom-")) {
      try {
        await favoriteService.removeFavorite(user.id, productId);
      } catch (err) {
        console.warn("Error removing favorite from server:", err);
      }
    }
  };

  const toggleFavorite = async (product) => {
    if (!product) return;
    const prodId = product._id || product.id;
    if (isFavorite(prodId)) {
      await removeFavorite(prodId);
      return false;
    } else {
      await addFavorite(product);
      return true;
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
    toast.info("Cleared all liked items");
  };

  return (
    <WishlistContext.Provider
      value={{
        favorites,
        favoriteCount: favorites.length,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        clearFavorites,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    return {
      favorites: [],
      favoriteCount: 0,
      isFavorite: () => false,
      addFavorite: () => {},
      removeFavorite: () => {},
      toggleFavorite: () => {},
      clearFavorites: () => {},
      loading: false,
    };
  }
  return context;
}

export default WishlistContext;
