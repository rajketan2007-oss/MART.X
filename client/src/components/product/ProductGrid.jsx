import React from 'react';
import ProductCard from './ProductCard';
import { PackageX } from 'lucide-react';

const ProductGrid = ({ products = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="bg-white rounded-xl border border-extrad-border p-3 animate-pulse space-y-3">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-2xl border border-extrad-border">
        <div className="w-16 h-16 rounded-full bg-extrad-peach text-extrad-pink flex items-center justify-center mx-auto mb-4">
          <PackageX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-extrad-dark mb-1">No Matching Products Found</h3>
        <p className="text-xs text-extrad-muted max-w-sm mx-auto">
          Try relaxing your active filters, adjusting price range, or searching for a different keyword.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product, idx) => (
        <ProductCard key={product._id || product.id} product={product} index={idx} />
      ))}
    </div>
  );
};

export default ProductGrid;
