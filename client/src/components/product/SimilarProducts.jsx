import React, { useEffect, useState } from 'react';
import { fetchProductsApi } from '../../services/api';
import ProductCard from './ProductCard';

const SimilarProducts = ({ categoryName, currentProductId }) => {
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    if (categoryName) {
      fetchProductsApi({ category: categoryName, pageSize: 4 })
        .then((res) => {
          const filtered = (res.data.products || []).filter(
            (p) => (p._id || p.id) !== currentProductId
          );
          setSimilar(filtered);
        })
        .catch((err) => console.error(err));
    }
  }, [categoryName, currentProductId]);

  if (similar.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-extrad-border">
      <h3 className="text-lg font-black text-extrad-dark uppercase tracking-wider mb-6">
        SIMILAR PRODUCTS YOU MAY LIKE
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {similar.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
