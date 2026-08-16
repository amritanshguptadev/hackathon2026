import { supabase } from "../lib/supabase";
import { storageService } from "./storageService";

/**
 * Normalizes raw Supabase product row into clean frontend representation.
 */
export function formatProduct(p) {
  if (!p) return null;

  const images = (p.product_images || [])
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((img) => storageService.getPublicImageUrl(img.image_path));

  const mainImage = images[0] || p.image || "/images/products/desk-lamp.png";

  const numPrice = Number(p.price) || 0;
  const isFree = !!p.is_free || numPrice === 0;

  return {
    _id: p.id,
    id: p.id,
    title: p.title,
    description: p.description,
    price: isFree ? "FREE" : numPrice,
    numericPrice: numPrice,
    isFree,
    condition: p.condition || "Good",
    campusLocation: p.campus_location || "Campus Main",
    location: p.campus_location || "Campus Main",
    status: p.status || "Available",
    category: p.categories?.name || p.category || "General",
    categoryId: p.category_id,
    categoryDetails: p.categories,
    seller: p.profiles
      ? {
          id: p.profiles.id,
          name: p.profiles.name || "Student Seller",
          college: p.profiles.college || "Campus",
          campusLocation: p.profiles.campus_location,
          verified: !!p.profiles.verified,
          profileImage: p.profiles.profile_image,
        }
      : {
          name: "Campus Student",
          college: "University Campus",
          verified: true,
        },
    sellerId: p.seller_id,
    image: mainImage,
    images: images.length > 0 ? images : [mainImage],
    rawImages: p.product_images || [],
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

/**
 * Product Service executing CRUD operations and queries directly on Supabase.
 */
export const productService = {
  /**
   * Fetch marketplace products with multi-filter and relation joins.
   */
  async getProducts(filters = {}) {
    const {
      search = "",
      category = "",
      categoryId = "",
      minPrice = 0,
      maxPrice = null,
      isFree = false,
      conditions = [],
      location = "",
      statuses = [],
      sortBy = "newest",
      limit = 50,
      featured = false,
      deals = false,
    } = filters;

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
      `);

    // Status filter: by default exclude "Hidden" and only show Available/Reserved on marketplace
    if (statuses && statuses.length > 0) {
      query = query.in("status", statuses);
    } else {
      query = query.neq("status", "Hidden").in("status", ["Available", "Reserved"]);
    }

    // Category filter
    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    // Search filter
    if (search && search.trim()) {
      const term = search.trim();
      query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
    }

    // Free items vs price range
    if (isFree) {
      query = query.eq("is_free", true);
    } else {
      if (minPrice !== undefined && minPrice !== null && minPrice > 0) {
        query = query.gte("price", Number(minPrice));
      }
      if (maxPrice !== undefined && maxPrice !== null && maxPrice > 0) {
        query = query.lte("price", Number(maxPrice));
      }
    }

    // Condition filter
    if (conditions && conditions.length > 0) {
      query = query.in("condition", conditions);
    }

    // Location filter
    if (location && location !== "All Locations") {
      query = query.eq("campus_location", location);
    }

    // Sorting
    if (sortBy === "price-low") {
      query = query.order("price", { ascending: true });
    } else if (sortBy === "price-high") {
      query = query.order("price", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching products from Supabase:", error);
      throw error;
    }

    let formatted = (data || []).map(formatProduct);

    // Client-side category name filter fallback if passed as text
    if (category && category !== "All Categories" && !categoryId) {
      formatted = formatted.filter(
        (p) =>
          (p.category || "").toLowerCase() === category.toLowerCase() ||
          (p.categoryDetails?.slug || "").toLowerCase() === category.toLowerCase()
      );
    }

    return formatted;
  },

  /**
   * Get single product by UUID.
   */
  async getProductById(productId) {
    if (!productId) return null;

    const { data, error } = await supabase
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
      .eq("id", productId)
      .single();

    if (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }

    return formatProduct(data);
  },

  /**
   * Fetch all listings created by a specific user (My Listings).
   */
  async getUserProducts(userId) {
    if (!userId) return [];

    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories (
          id,
          name,
          slug
        ),
        product_images (
          id,
          image_path,
          sort_order
        )
      `)
      .eq("seller_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user products:", error);
      throw error;
    }

    return (data || []).map(formatProduct);
  },

  /**
   * Create a new product listing with images.
   */
  async createProduct(productData, imageFiles = []) {
    const {
      sellerId,
      categoryId,
      title,
      description,
      price,
      isFree,
      condition,
      campusLocation,
    } = productData;

    if (!sellerId) throw new Error("Authenticated seller ID is required");
    if (!title || title.trim().length < 3) throw new Error("Title must be at least 3 characters");
    if (!description || description.trim().length < 10) throw new Error("Description must be at least 10 characters");

    // Defensive UUID check for category_id so non-UUID fallbacks don't fail Postgres UUID casting
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryId);
    const safeCategoryId = isUuid ? categoryId : null;

    // 1. Insert product record into products table
    const { data: product, error: insertError } = await supabase
      .from("products")
      .insert({
        seller_id: sellerId,
        category_id: safeCategoryId,
        title: title.trim(),
        description: description.trim(),
        price: isFree ? 0 : Number(price) || 0,
        is_free: !!isFree,
        condition: condition || "Good",
        campus_location: campusLocation || "Campus Main",
        status: "Available",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Product insert error:", insertError);
      throw new Error(insertError.message || "Failed to create product listing");
    }

    // 2. Upload images to Supabase Storage if provided
    if (Array.isArray(imageFiles) && imageFiles.length > 0) {
      try {
        const uploaded = await storageService.uploadMultipleProductImages(
          sellerId,
          product.id,
          imageFiles
        );

        if (uploaded.length > 0) {
          const imageRows = uploaded.map((item, index) => ({
            product_id: product.id,
            image_path: item.path,
            sort_order: index,
          }));

          const { error: imgInsertError } = await supabase
            .from("product_images")
            .insert(imageRows);

          if (imgInsertError) {
            console.warn("Product images record insertion notice:", imgInsertError);
          }
        }
      } catch (uploadErr) {
        console.error("Image upload failed during product creation:", uploadErr);
        // Transaction safety: Clean up incomplete product row if image upload failed
        try {
          await supabase.from("products").delete().eq("id", product.id);
        } catch (cleanupErr) {
          console.warn("Could not cleanup incomplete product:", cleanupErr);
        }
        throw new Error(`Image upload failed: ${uploadErr.message || "Storage error. Please verify bucket permissions."}`);
      }
    }

    const created = await this.getProductById(product.id);
    return created || formatProduct(product);
  },

  /**
   * Update existing product listing.
   */
  async updateProduct(productId, updates, newImageFiles = [], removedImagePaths = []) {
    if (!productId) throw new Error("Product ID is required");

    const cleanUpdates = {};
    if (updates.title) cleanUpdates.title = updates.title.trim();
    if (updates.description) cleanUpdates.description = updates.description.trim();
    if (updates.categoryId !== undefined) cleanUpdates.category_id = updates.categoryId || null;
    if (updates.isFree !== undefined) {
      cleanUpdates.is_free = !!updates.isFree;
      cleanUpdates.price = updates.isFree ? 0 : Number(updates.price) || 0;
    } else if (updates.price !== undefined) {
      cleanUpdates.price = Number(updates.price) || 0;
    }
    if (updates.condition) cleanUpdates.condition = updates.condition;
    if (updates.campusLocation) cleanUpdates.campus_location = updates.campusLocation;
    if (updates.status) cleanUpdates.status = updates.status;
    cleanUpdates.updated_at = new Date().toISOString();

    // 1. Update product table
    const { error: updateError } = await supabase
      .from("products")
      .update(cleanUpdates)
      .eq("id", productId);

    if (updateError) throw updateError;

    // 2. Remove specified deleted images
    if (Array.isArray(removedImagePaths) && removedImagePaths.length > 0) {
      await storageService.deleteProductImages(removedImagePaths);
      await supabase
        .from("product_images")
        .delete()
        .eq("product_id", productId)
        .in("image_path", removedImagePaths);
    }

    // 3. Upload new images if any
    if (Array.isArray(newImageFiles) && newImageFiles.length > 0) {
      const { data: currentProduct } = await supabase
        .from("products")
        .select("seller_id")
        .eq("id", productId)
        .single();

      if (currentProduct?.seller_id) {
        const uploaded = await storageService.uploadMultipleProductImages(
          currentProduct.seller_id,
          productId,
          newImageFiles
        );

        if (uploaded.length > 0) {
          const imageRows = uploaded.map((item, index) => ({
            product_id: productId,
            image_path: item.path,
            sort_order: index + 10,
          }));

          await supabase.from("product_images").insert(imageRows);
        }
      }
    }

    return this.getProductById(productId);
  },

  /**
   * Update product status (Available / Reserved / Sold / Hidden).
   */
  async updateProductStatus(productId, status) {
    if (!productId) throw new Error("Product ID is required");
    const allowed = ["Available", "Reserved", "Sold", "Hidden"];
    if (!allowed.includes(status)) throw new Error(`Invalid status: ${status}`);

    const { data, error } = await supabase
      .from("products")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete product listing and its stored images.
   */
  async deleteProduct(productId) {
    if (!productId) throw new Error("Product ID is required");

    // 1. Fetch images to delete from Storage
    const { data: images } = await supabase
      .from("product_images")
      .select("image_path")
      .eq("product_id", productId);

    if (images && images.length > 0) {
      const paths = images.map((i) => i.image_path);
      await storageService.deleteProductImages(paths);
    }

    // 2. Delete product record (cascade handles product_images table)
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) throw error;
    return true;
  },
};

export default productService;
