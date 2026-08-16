import { supabase } from "../lib/supabase";

export const PRODUCT_IMAGES_BUCKET = "product-images";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Storage Service for uploading and resolving images via Supabase Storage.
 */
export const storageService = {
  /**
   * Validate image before uploading.
   */
  validateImage(file) {
    if (!file) throw new Error("No file provided");
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error(`Unsupported image type "${file.type}". Allowed: JPG, PNG, WEBP.`);
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds 5MB limit.`);
    }
    return true;
  },

  /**
   * Upload single product photo to `product-images` bucket.
   * Path: userId/productId/timestamp-sanitizedName
   */
  async uploadProductImage(userId, productId, file) {
    this.validateImage(file);

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${userId}/${productId}/${timestamp}-${sanitizedName}`;

    const { data, error } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Storage upload error:", error);
      throw error;
    }

    return {
      path: data.path || filePath,
      fullPath: data.fullPath,
      publicUrl: this.getPublicImageUrl(data.path || filePath),
    };
  },

  /**
   * Upload multiple images for a product.
   */
  async uploadMultipleProductImages(userId, productId, files) {
    if (!Array.isArray(files) || files.length === 0) return [];
    if (files.length > 5) throw new Error("Maximum 5 photos allowed per listing.");

    const uploadPromises = files.map((file) =>
      this.uploadProductImage(userId, productId, file)
    );
    return Promise.all(uploadPromises);
  },

  /**
   * Get public or resolved URL for a stored image path.
   */
  getPublicImageUrl(imagePath) {
    if (!imagePath) return "/images/products/desk-lamp.png";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
      return imagePath;
    }

    const { data } = supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .getPublicUrl(imagePath);

    return data?.publicUrl || imagePath;
  },

  /**
   * Delete single image from storage.
   */
  async deleteProductImage(imagePath) {
    if (!imagePath) return;
    const cleanPath = imagePath.replace(/^.*\/product-images\//, "");
    const { error } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .remove([cleanPath]);
    if (error) console.warn("Storage image removal notice:", error.message);
  },

  /**
   * Delete multiple images from storage.
   */
  async deleteProductImages(imagePaths) {
    if (!Array.isArray(imagePaths) || imagePaths.length === 0) return;
    const cleanPaths = imagePaths
      .map((p) => (typeof p === "string" ? p.replace(/^.*\/product-images\//, "") : p?.image_path))
      .filter(Boolean);

    if (cleanPaths.length > 0) {
      const { error } = await supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .remove(cleanPaths);
      if (error) console.warn("Storage batch removal notice:", error.message);
    }
  },
};

export default storageService;
