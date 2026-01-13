import { useState, useCallback, useEffect } from 'react';
import productService from '../services/productService.js';
import { useToastContext } from '../../../app/providers.jsx';

const INITIAL_FORM_DATA = {
  // Basic product info
  name: '',
  price: '',
  status: 'ACTIVE',
  
  // Categories
  categoryIds: [],
  
  // Product type
  productType: 'general', // 'general' or 'book'
  
  // Book specific data
  book: {
    isbn: '',
    description: '',
    publishYear: '',
    pageCount: '',
    language: 'Vietnamese'
  },
  
  // Images
  images: []
};

const FORM_STEPS = {
  BASIC_INFO: 0,
  CATEGORIES: 1,
  BOOK_DETAILS: 2,
  IMAGES: 3,
  REVIEW: 4
};

export const useProductForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(FORM_STEPS.BASIC_INFO);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const toast = useToastContext();

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const result = await productService.getCategories({
        size: 100,
        includeInactive: false
      });
      
      if (result.success) {
        setCategories(result.data);
      } else {
        toast.error('Failed to load categories');
      }
    } catch (error) {
      toast.error('Error loading categories');
    } finally {
      setLoadingCategories(false);
    }
  }, [toast]);

  // Update form data
  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
    
    // Clear related errors when data changes
    if (errors && Object.keys(errors).length > 0) {
      const newErrors = { ...errors };
      Object.keys(updates).forEach(key => {
        delete newErrors[key];
      });
      setErrors(newErrors);
    }
  }, [errors]);

  // Update book data specifically
  const updateBookData = useCallback((bookUpdates) => {
    setFormData(prev => ({
      ...prev,
      book: {
        ...prev.book,
        ...bookUpdates
      }
    }));
  }, []);

  // Add/remove categories
  const toggleCategory = useCallback((categoryId) => {
    setFormData(prev => {
      const currentIds = prev.categoryIds || [];
      const isSelected = currentIds.includes(categoryId);
      
      return {
        ...prev,
        categoryIds: isSelected
          ? currentIds.filter(id => id !== categoryId)
          : [...currentIds, categoryId]
      };
    });
  }, []);

  // Image management
  const addImage = useCallback((imageFile, isPrimary = false) => {
    const imageData = {
      id: Date.now(), // Temporary ID
      file: imageFile,
      preview: URL.createObjectURL(imageFile),
      isPrimary,
      sortOrder: formData.images.length
    };

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageData]
    }));
  }, [formData.images.length]);

  const removeImage = useCallback((imageId) => {
    setFormData(prev => {
      const updatedImages = prev.images.filter(img => img.id !== imageId);
      
      // Clean up object URL
      const removedImage = prev.images.find(img => img.id === imageId);
      if (removedImage && removedImage.preview) {
        URL.revokeObjectURL(removedImage.preview);
      }
      
      // If removed image was primary, set first image as primary
      if (removedImage && removedImage.isPrimary && updatedImages.length > 0) {
        updatedImages[0].isPrimary = true;
      }
      
      return {
        ...prev,
        images: updatedImages
      };
    });
  }, []);

  const setPrimaryImage = useCallback((imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map(img => ({
        ...img,
        isPrimary: img.id === imageId
      }))
    }));
  }, []);

  const reorderImages = useCallback((dragIndex, hoverIndex) => {
    setFormData(prev => {
      const updatedImages = [...prev.images];
      const draggedImage = updatedImages[dragIndex];
      
      updatedImages.splice(dragIndex, 1);
      updatedImages.splice(hoverIndex, 0, draggedImage);
      
      // Update sort orders
      return {
        ...prev,
        images: updatedImages.map((img, index) => ({
          ...img,
          sortOrder: index
        }))
      };
    });
  }, []);

  // Step navigation
  const nextStep = useCallback(() => {
    const validation = validateCurrentStep();
    if (validation.isValid) {
      setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.REVIEW));
      setErrors({});
    } else {
      setErrors(validation.errors);
      toast.error('Please fix the errors before continuing');
    }
  }, [currentStep, formData, toast]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, FORM_STEPS.BASIC_INFO));
    setErrors({});
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
    setErrors({});
  }, []);

  // Validation
  const validateCurrentStep = useCallback(() => {
    const stepErrors = {};

    switch (currentStep) {
      case FORM_STEPS.BASIC_INFO:
        if (!formData.name.trim()) {
          stepErrors.name = 'Product name is required';
        } else if (formData.name.length > 100) {
          stepErrors.name = 'Product name must not exceed 100 characters';
        }

        if (!formData.price) {
          stepErrors.price = 'Price is required';
        } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
          stepErrors.price = 'Price must be a positive number';
        }
        break;

      case FORM_STEPS.CATEGORIES:
        if (!formData.categoryIds || formData.categoryIds.length === 0) {
          stepErrors.categories = 'Please select at least one category';
        }
        break;

      case FORM_STEPS.BOOK_DETAILS:
        if (formData.productType === 'book') {
          if (formData.book.isbn && formData.book.isbn.length > 20) {
            stepErrors.isbn = 'ISBN must not exceed 20 characters';
          }

          if (formData.book.publishYear) {
            const year = parseInt(formData.book.publishYear);
            if (year < 1) {
              stepErrors.publishYear = 'Publish year must be positive';
            }
          }

          if (formData.book.pageCount && parseInt(formData.book.pageCount) < 1) {
            stepErrors.pageCount = 'Page count must be positive';
          }

          if (formData.book.language && formData.book.language.length > 50) {
            stepErrors.language = 'Language must not exceed 50 characters';
          }
        }
        break;

      case FORM_STEPS.IMAGES:
        // Images are optional, no validation needed
        break;

      case FORM_STEPS.REVIEW:
        // Final validation will be done on submit
        break;
    }

    return {
      isValid: Object.keys(stepErrors).length === 0,
      errors: stepErrors
    };
  }, [currentStep, formData]);

  // Submit form
  const submitForm = useCallback(async () => {
    setLoading(true);
    setErrors({});

    try {
      // Final validation
      const validation = productService.validateProductData(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        toast.error('Please fix the validation errors');
        return { success: false };
      }

      // Prepare product data
      const productData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        categoryIds: formData.categoryIds
      };

      // Add book data if product type is book
      if (formData.productType === 'book') {
        const bookData = {};
        
        // Only include non-empty book fields
        if (formData.book.isbn && formData.book.isbn.trim()) {
          bookData.isbn = formData.book.isbn.trim();
        }
        if (formData.book.description && formData.book.description.trim()) {
          bookData.description = formData.book.description.trim();
        }
        if (formData.book.publishYear) {
          bookData.publishYear = parseInt(formData.book.publishYear);
        }
        if (formData.book.pageCount) {
          bookData.pageCount = parseInt(formData.book.pageCount);
        }
        if (formData.book.language && formData.book.language.trim()) {
          bookData.language = formData.book.language.trim();
        }
        
        // Only add book object if it has at least one field
        if (Object.keys(bookData).length > 0) {
          productData.book = bookData;
        }
      }

      // Create product (with book data if applicable)
      const result = await productService.createProduct(productData);
      
      if (!result.success) {
        setErrors({ submit: result.error });
        toast.error(result.error);
        return { success: false };
      }

      const createdProduct = result.data;
      toast.success('Product created successfully!');

      // Upload images if any
      if (formData.images.length > 0) {
        await uploadImages(createdProduct.productId);
      }

      // Reset form
      resetForm();
      
      return { 
        success: true, 
        data: createdProduct 
      };

    } catch (error) {
      const errorMessage = error.message || 'Failed to create product';
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [formData, toast]);

  // Upload images
  const uploadImages = useCallback(async (productId) => {
    let successCount = 0;
    let errorCount = 0;
    
    const uploadPromises = formData.images.map(async (image, index) => {
      try {
        const result = await productService.uploadProductImage(
          productId,
          image.file,
          image.isPrimary,
          index
        );
        
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
          console.error(`Failed to upload image ${index + 1}:`, result.error);
        }
      } catch (error) {
        errorCount++;
        console.error(`Failed to upload image ${index + 1}:`, error);
      }
    });

    await Promise.all(uploadPromises);
    
    // Show upload results
    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} image(s)`);
    }
    if (errorCount > 0) {
      toast.warning(`Failed to upload ${errorCount} image(s)`);
    }
  }, [formData.images, toast]);

  // Reset form
  const resetForm = useCallback(() => {
    // Clean up image previews
    formData.images.forEach(image => {
      if (image.preview) {
        URL.revokeObjectURL(image.preview);
      }
    });

    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(FORM_STEPS.BASIC_INFO);
    setErrors({});
  }, [formData.images]);

  // Computed values
  const isFirstStep = currentStep === FORM_STEPS.BASIC_INFO;
  const isLastStep = currentStep === FORM_STEPS.REVIEW;
  const canProceed = validateCurrentStep().isValid;
  const totalSteps = Object.keys(FORM_STEPS).length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return {
    // Form data
    formData,
    updateFormData,
    updateBookData,
    
    // Categories
    categories,
    loadingCategories,
    toggleCategory,
    
    // Images
    addImage,
    removeImage,
    setPrimaryImage,
    reorderImages,
    
    // Steps
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep,
    isLastStep,
    canProceed,
    totalSteps,
    progress,
    
    // Validation & Submit
    errors,
    loading,
    validateCurrentStep,
    submitForm,
    resetForm,
    
    // Constants
    FORM_STEPS
  };
};