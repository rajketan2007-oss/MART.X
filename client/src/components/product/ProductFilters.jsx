import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const availableSizes = ['S', 'M', 'L', 'XL', '2XL', 'Standard'];

const ProductFilters = ({
  filters,
  onChange,
  onReset,
  availableBrands = [],
  availableColors = []
}) => {
  const handleBrandToggle = (brand) => {
    const current = filters.brand ? filters.brand.split(',') : [];
    let updated = [];
    if (current.includes(brand)) {
      updated = current.filter(b => b !== brand);
    } else {
      updated = [...current, brand];
    }
    onChange('brand', updated.join(','));
  };

  const handleSizeToggle = (size) => {
    const current = filters.size ? filters.size.split(',') : [];
    let updated = [];
    if (current.includes(size)) {
      updated = current.filter(s => s !== size);
    } else {
      updated = [...current, size];
    }
    onChange('size', updated.join(','));
  };

  const activeBrandList = filters.brand ? filters.brand.split(',') : [];
  const activeSizeList = filters.size ? filters.size.split(',') : [];

  return (
    <div className="bg-white rounded-xl border border-extrad-border p-5 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-extrad-border">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-extrad-pink" />
          <h3 className="text-sm font-extrabold text-extrad-dark uppercase tracking-wider">FILTERS</h3>
        </div>
        <button
          onClick={onReset}
          className="text-[11px] font-bold text-extrad-pink hover:underline flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> CLEAR ALL
        </button>
      </div>

      {/* Gender Filter */}
      <div>
        <h4 className="text-xs font-bold text-extrad-dark uppercase tracking-wider mb-2.5">GENDER</h4>
        <div className="space-y-1.5 text-xs font-medium text-extrad-muted">
          {['Men', 'Women', 'Kids', 'Unisex'].map((g) => (
            <label key={g} className="flex items-center gap-2 cursor-pointer hover:text-extrad-pink">
              <input
                type="radio"
                name="gender"
                checked={filters.gender === g}
                onChange={() => onChange('gender', g)}
                className="accent-extrad-pink"
              />
              <span>{g}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex justify-between items-center mb-2.5">
          <h4 className="text-xs font-bold text-extrad-dark uppercase tracking-wider">PRICE RANGE</h4>
          <span className="text-xs font-extrabold text-extrad-pink">Up to ₹{filters.maxPrice || 10000}</span>
        </div>
        <input
          type="range"
          min="500"
          max="10000"
          step="250"
          value={filters.maxPrice || 10000}
          onChange={(e) => onChange('maxPrice', e.target.value)}
          className="w-full accent-extrad-pink cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-1">
          <span>₹500</span>
          <span>₹10,000+</span>
        </div>
      </div>

      {/* Brand Checkboxes */}
      {availableBrands.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-extrad-dark uppercase tracking-wider mb-2.5">BRANDS</h4>
          <div className="max-h-40 overflow-y-auto space-y-1.5 pr-2">
            {availableBrands.map((b) => (
              <label key={b} className="flex items-center gap-2 text-xs font-medium text-extrad-muted cursor-pointer hover:text-extrad-pink">
                <input
                  type="checkbox"
                  checked={activeBrandList.includes(b)}
                  onChange={() => handleBrandToggle(b)}
                  className="rounded accent-extrad-pink"
                />
                <span className="truncate">{b}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Size Selector Pills */}
      <div>
        <h4 className="text-xs font-bold text-extrad-dark uppercase tracking-wider mb-2.5">SIZE</h4>
        <div className="flex flex-wrap gap-1.5">
          {availableSizes.map((s) => {
            const active = activeSizeList.includes(s);
            return (
              <button
                key={s}
                onClick={() => handleSizeToggle(s)}
                className={`px-2.5 py-1 text-xs font-bold rounded border transition-colors ${
                  active
                    ? 'gradient-bg text-white border-transparent'
                    : 'bg-white text-extrad-dark border-gray-200 hover:border-extrad-pink'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Minimum Discount % Filter */}
      <div>
        <h4 className="text-xs font-bold text-extrad-dark uppercase tracking-wider mb-2.5">MINIMUM DISCOUNT</h4>
        <div className="space-y-1.5 text-xs font-medium text-extrad-muted">
          {[10, 30, 50, 70].map((d) => (
            <label key={d} className="flex items-center gap-2 cursor-pointer hover:text-extrad-pink">
              <input
                type="radio"
                name="discount"
                checked={Number(filters.minDiscount) === d}
                onChange={() => onChange('minDiscount', d)}
                className="accent-extrad-pink"
              />
              <span>{d}% and above</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
