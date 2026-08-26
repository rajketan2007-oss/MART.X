import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import { fetchProductsApi } from '../services/api';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const ListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Extract query parameters
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const size = searchParams.get('size') || '';
  const color = searchParams.get('color') || '';
  const gender = searchParams.get('gender') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minDiscount = searchParams.get('minDiscount') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = searchParams.get('page') || '1';

  useEffect(() => {
    setLoading(true);
    const params = {
      keyword,
      category,
      brand,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      minDiscount,
      sort,
      pageNumber: page,
      pageSize: 12
    };

    fetchProductsApi(params)
      .then((res) => {
        setProducts(res.data.products || []);
        setTotalPages(res.data.pages || 1);
        setTotalCount(res.data.total || 0);
        if (res.data.availableBrands) setAvailableBrands(res.data.availableBrands);
        if (res.data.availableColors) setAvailableColors(res.data.availableColors);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header & Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-extrad-border">
        <div>
          <h1 className="text-xl font-black text-extrad-dark uppercase tracking-wider">
            {keyword ? `Search Results for "${keyword}"` : category ? `${category.replace('-', ' ')} Collection` : 'All Extrad Products'}
          </h1>
          <p className="text-xs text-extrad-muted">
            Showing {products.length} of {totalCount} items
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-extrad-border rounded-lg text-xs font-bold text-extrad-dark"
          >
            <SlidersHorizontal className="w-4 h-4 text-extrad-pink" /> Filters
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 border border-extrad-border rounded-lg px-3 py-2 bg-white">
            <ArrowUpDown className="w-4 h-4 text-extrad-muted" />
            <span className="text-xs font-bold text-extrad-dark uppercase">Sort By:</span>
            <select
              value={sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="text-xs font-semibold text-extrad-dark bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="newest">New Arrivals</option>
              <option value="popularity">Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Better Discount</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <ProductFilters
            filters={{
              gender,
              maxPrice,
              brand,
              size,
              minDiscount
            }}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            availableBrands={availableBrands}
            availableColors={availableColors}
          />
        </div>

        {/* Mobile Filter Modal */}
        {showMobileFilter && (
          <div className="fixed inset-0 bg-black/60 z-50 lg:hidden p-4 flex justify-end">
            <div className="bg-white w-full max-w-xs h-full rounded-2xl p-4 overflow-y-auto">
              <ProductFilters
                filters={{ gender, maxPrice, brand, size, minDiscount }}
                onChange={(k, v) => {
                  handleFilterChange(k, v);
                  setShowMobileFilter(false);
                }}
                onReset={() => {
                  handleResetFilters();
                  setShowMobileFilter(false);
                }}
                availableBrands={availableBrands}
                availableColors={availableColors}
              />
            </div>
          </div>
        )}

        {/* Products Grid Column */}
        <div className="lg:col-span-3 space-y-8">
          <ProductGrid products={products} loading={loading} />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = (idx + 1).toString();
                const active = page === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handleFilterChange('page', pageNum)}
                    className={`w-9 h-9 rounded-lg font-bold text-xs transition-colors ${
                      active
                        ? 'gradient-bg text-white shadow-md'
                        : 'bg-white border border-extrad-border text-extrad-dark hover:border-extrad-pink'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingPage;
