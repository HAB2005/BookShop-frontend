import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditProductPage() {
  const navigate = useNavigate();
  const { productId } = useParams();

  useEffect(() => {
    // Redirect to the new update product page
    if (productId) {
      navigate(`/products/update/${productId}`, { replace: true });
    } else {
      navigate('/products/manage', { replace: true });
    }
  }, [navigate, productId]);

  // Return null since we're redirecting
  return null;
}

export default EditProductPage;