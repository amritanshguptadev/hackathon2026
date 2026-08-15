import express from 'express';
import jwt from 'jsonwebtoken';
import FeaturedProduct from '../models/featuredProduct.js';
import Deals from '../models/deals.js';
import User from '../models/user.js';
import uploadProductImage from '../middleware/uploadProductImage.js';

const router = express.Router();

// Helper to extract authenticated user from Authorization header if available
async function getAuthUser(req) {
  try {
    const authHeader = req.header('authorization') || req.header('Authorization');
    if (!authHeader) return null;
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'studx-dev-jwt-secret');
    if (decoded && decoded._id) {
      return await User.findById(decoded._id).select('-password');
    }
  } catch (err) {
    // Non-fatal if optional token check fails
  }
  return null;
}

// 1. GET Single Product Details by ID
router.get('/api/product/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    let product = await FeaturedProduct.findById(productId);
    if (!product) {
      product = await Deals.findById(productId);
    }
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// 2. GET My Listings (Seller's Products)
router.get('/api/my-listings', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return res.status(401).json({ message: 'Authentication required to view your listings' });
    }

    const listings = await FeaturedProduct.find({
      $or: [{ userId: user._id }, { 'seller.email': user.email }],
    }).sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (err) {
    console.error('Error fetching my listings:', err);
    res.status(500).json({ message: 'Error fetching listings', error: err.message });
  }
});

// 3. POST Create New Product Listing
router.post('/api/products', uploadProductImage, async (req, res) => {
  try {
    const productData = { ...req.body };
    const authUser = await getAuthUser(req);

    // Parse seller info
    let sellerObj = {};
    if (typeof productData.seller === 'string') {
      try {
        sellerObj = JSON.parse(productData.seller);
      } catch {
        sellerObj = {};
      }
    } else if (typeof productData.seller === 'object' && productData.seller !== null) {
      sellerObj = productData.seller;
    }

    // Auto-fill or augment seller from authenticated user if available
    if (authUser) {
      sellerObj = {
        name: authUser.name || sellerObj.name || 'Campus Student',
        email: authUser.email || sellerObj.email || '',
        college: authUser.college || authUser.university || sellerObj.college || 'Campus Member',
        studentId: authUser.studentId || sellerObj.studentId || '',
        joinedAt: authUser.createdAt || new Date().toISOString(),
      };
      productData.userId = authUser._id;
    } else if (!sellerObj.name) {
      sellerObj = {
        name: 'Campus Student',
        email: 'student@campus.edu',
        college: 'Campus Member',
        joinedAt: new Date().toISOString(),
      };
    }
    productData.seller = sellerObj;

    // Handle isFree and price validation
    const isFree =
      productData.isFree === true ||
      productData.isFree === 'true' ||
      productData.price === 0 ||
      productData.price === '0' ||
      productData.price === 'FREE';

    productData.isFree = isFree;
    productData.price = isFree ? 0 : Number(productData.price) || 0;

    // Parse features / details list
    if (typeof productData.details === 'string') {
      productData.details = productData.details
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);
    } else if (!Array.isArray(productData.details)) {
      productData.details = [];
    }

    // Handle uploaded images (multiple or single)
    const uploadedUrls = [];
    if (req.files) {
      const allFiles = [
        ...(req.files.productImages || []),
        ...(req.files.productImage || []),
        ...(req.files.images || []),
        ...(req.files.image || []),
      ];
      allFiles.forEach((file) => {
        uploadedUrls.push(`/uploads/products/${file.filename}`);
      });
    } else if (req.file) {
      uploadedUrls.push(`/uploads/products/${req.file.filename}`);
    }

    if (uploadedUrls.length > 0) {
      productData.images = uploadedUrls;
      productData.image = uploadedUrls[0];
    } else if (typeof productData.images === 'string') {
      try {
        productData.images = JSON.parse(productData.images);
      } catch {
        productData.images = [productData.images];
      }
      productData.image = productData.images[0] || productData.image;
    }

    // Set defaults
    productData.status = productData.status || 'Available';
    productData.condition = productData.condition || 'Good';
    productData.campusLocation = productData.campusLocation || 'Campus Gate';
    productData.location = productData.campusLocation || productData.location || 'Campus';
    productData.category = productData.category || 'Hostel Essentials';

    const newProduct = new FeaturedProduct(productData);
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(500).json({ message: 'Error saving product', error: err.message });
  }
});

// 4. PUT / PATCH Update Existing Product Listing
router.put('/api/products/:id', uploadProductImage, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Handle isFree and price validation
    if (updateData.isFree !== undefined) {
      const isFree = updateData.isFree === true || updateData.isFree === 'true';
      updateData.isFree = isFree;
      if (isFree) updateData.price = 0;
      else if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    } else if (updateData.price !== undefined) {
      updateData.price = Number(updateData.price);
    }

    // Handle uploaded images if any
    if (req.files) {
      const allFiles = [
        ...(req.files.productImages || []),
        ...(req.files.productImage || []),
        ...(req.files.images || []),
        ...(req.files.image || []),
      ];
      if (allFiles.length > 0) {
        const uploadedUrls = allFiles.map(
          (file) => `http://localhost:3000/uploads/products/${file.filename}`
        );
        updateData.images = uploadedUrls;
        updateData.image = uploadedUrls[0];
      }
    }

    if (updateData.campusLocation) {
      updateData.location = updateData.campusLocation;
    }

    const updated = await FeaturedProduct.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
});

// 5. PATCH Update Product Status (Available, Reserved, Sold)
router.patch('/api/products/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Available', 'Reserved', 'Sold'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updated = await FeaturedProduct.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ message: 'Error updating status', error: err.message });
  }
});

// 6. DELETE Product Listing
router.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FeaturedProduct.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully', id });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
});

export default router;
