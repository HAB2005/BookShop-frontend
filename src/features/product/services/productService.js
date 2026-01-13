import {
  createProductApi,
  getProductsApi,
  getProductDetailApi,
  updateProductApi,
  updateProductStatusApi,
  assignCategoriesToProductApi,
  searchProductsApi,
  getProductSuggestionsApi,
  getCategoriesApi,
  getCategoryDetailApi,
  uploadProductImageApi,
  getProductImagesApi,
  updateProductImageApi,
  setPrimaryImageApi,
  deleteProductImageApi,
  reorderProductImagesApi
} from '../api/product.api.js';

class ProductService {
  // ==================== PRODUCT OPERATIONS ====================
  
  async createProduct(productData) {
    try {
      console.log('Creating product with data:', productData); // Debug log
      const response = await createProductApi(productData);
      console.log('Product creation response:', response.data); // Debug log
      return {
        success: true,
        data: response.data,
        message: 'Product created successfully'
      };
    } catch (error) {
      console.error('Product creation error:', error.response?.data || error.message); // Debug log
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create product',
        details: error.response?.data
      };
    }
  }

  async getProducts(filters = {}) {
    try {
      const response = await getProductsApi(filters);
      return {
        success: true,
        data: response.data.content,
        pagination: {
          page: response.data.page,
          size: response.data.size,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
          first: response.data.first,
          last: response.data.last
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch products'
      };
    }
  }

  async getProductDetail(productId) {
    try {
      const response = await getProductDetailApi(productId);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch product details'
      };
    }
  }

  async updateProduct(productId, productData) {
    try {
      const response = await updateProductApi(productId, productData);
      return {
        success: true,
        data: response.data,
        message: 'Product updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update product'
      };
    }
  }

  async updateProductStatus(productId, status) {
    try {
      await updateProductStatusApi(productId, status);
      return {
        success: true,
        message: 'Product status updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update product status'
      };
    }
  }

  async assignCategoriesToProduct(productId, categoryIds) {
    try {
      await assignCategoriesToProductApi(productId, categoryIds);
      return {
        success: true,
        message: 'Product categories updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update product categories'
      };
    }
  }

  // ==================== SEARCH & SUGGESTIONS ====================

  async searchProducts(searchParams = {}) {
    try {
      const response = await searchProductsApi(searchParams);
      return {
        success: true,
        data: response.data.content,
        pagination: {
          page: response.data.page,
          size: response.data.size,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
          first: response.data.first,
          last: response.data.last
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to search products'
      };
    }
  }

  async getProductSuggestions(keyword, limit = 10) {
    try {
      const response = await getProductSuggestionsApi(keyword, limit);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get product suggestions'
      };
    }
  }

  // ==================== CATEGORY OPERATIONS ====================

  async getCategories(filters = {}) {
    try {
      const response = await getCategoriesApi(filters);
      return {
        success: true,
        data: response.data.content,
        pagination: {
          page: response.data.page,
          size: response.data.size,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
          first: response.data.first,
          last: response.data.last
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch categories'
      };
    }
  }

  async getCategoryDetail(categoryId) {
    try {
      const response = await getCategoryDetailApi(categoryId);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch category details'
      };
    }
  }

  // ==================== IMAGE OPERATIONS ====================

  async uploadProductImage(productId, file, isPrimary = false, sortOrder = null) {
    try {
      const response = await uploadProductImageApi(productId, file, isPrimary, sortOrder);
      return {
        success: true,
        data: response.data,
        message: 'Image uploaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to upload image'
      };
    }
  }

  async getProductImages(productId) {
    try {
      const response = await getProductImagesApi(productId);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch product images'
      };
    }
  }

  async updateProductImage(imageId, updateData) {
    try {
      const response = await updateProductImageApi(imageId, updateData);
      return {
        success: true,
        data: response.data,
        message: 'Image updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update image'
      };
    }
  }

  async setPrimaryImage(imageId) {
    try {
      await setPrimaryImageApi(imageId);
      return {
        success: true,
        message: 'Primary image set successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to set primary image'
      };
    }
  }

  async deleteProductImage(imageId) {
    try {
      await deleteProductImageApi(imageId);
      return {
        success: true,
        message: 'Image deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete image'
      };
    }
  }

  async reorderProductImages(productId, imageOrders) {
    try {
      await reorderProductImagesApi(productId, imageOrders);
      return {
        success: true,
        message: 'Images reordered successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to reorder images'
      };
    }
  }

  // ==================== VALIDATION HELPERS ====================

  validateProductData(productData) {
    const errors = {};

    // Validate name
    if (!productData.name || productData.name.trim().length === 0) {
      errors.name = 'Product name is required';
    } else if (productData.name.length > 100) {
      errors.name = 'Product name must not exceed 100 characters';
    }

    // Validate price
    if (!productData.price) {
      errors.price = 'Price is required';
    } else if (isNaN(productData.price) || parseFloat(productData.price) <= 0) {
      errors.price = 'Price must be a positive number';
    }

    // Validate book data if present
    if (productData.book) {
      if (productData.book.isbn && productData.book.isbn.length > 20) {
        errors.isbn = 'ISBN must not exceed 20 characters';
      }

      if (productData.book.publishYear) {
        const year = parseInt(productData.book.publishYear);
        if (year < 1) {
          errors.publishYear = 'Publish year must be positive';
        }
      }

      if (productData.book.pageCount && parseInt(productData.book.pageCount) < 1) {
        errors.pageCount = 'Page count must be positive';
      }

      if (productData.book.language && productData.book.language.length > 50) {
        errors.language = 'Language must not exceed 50 characters';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // ==================== UTILITY METHODS ====================

  formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  getImageUrl(productId, filename) {
    if (!filename) return null;
    
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    
    // If filename already contains full URL, return as is
    if (filename.startsWith('http')) {
      return filename;
    }
    
    // If filename already starts with 'products/', it's already a relative path from files root
    if (filename.startsWith('products/')) {
      return `${baseUrl}/files/${filename}`;
    }
    
    // Remove leading slash if present
    const cleanFilename = filename.startsWith('/') ? filename.substring(1) : filename;
    
    // Build the full URL with products path
    return `${baseUrl}/files/products/${productId}/${cleanFilename}`;
  }

  getStatusLabel(status) {
    const statusLabels = {
      ACTIVE: 'Active',
      INACTIVE: 'Inactive',
      DELETED: 'Deleted'
    };
    return statusLabels[status] || status;
  }

  getStatusColor(status) {
    const statusColors = {
      ACTIVE: 'green',
      INACTIVE: 'orange',
      DELETED: 'red'
    };
    return statusColors[status] || 'gray';
  }
}

export default new ProductService();