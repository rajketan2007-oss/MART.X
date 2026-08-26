import React from 'react';
import { Trash2, Heart, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { toggleWishlist } = useWishlist();

  const product = item.product || {};
  const pId = product._id || product.id;

  const handleMoveToWishlist = () => {
    toggleWishlist(product);
    removeFromCart(item._id);
  };

  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl border border-extrad-border shadow-xs hover:border-gray-300 transition-colors">
      {/* Thumbnail */}
      <img
        src={product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80'}
        alt={product.name}
        className="w-24 h-32 object-cover object-top rounded-lg bg-gray-100 shrink-0"
      />

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <div>
              <h4 className="text-xs font-black text-extrad-dark uppercase tracking-wider">
                {product.brand}
              </h4>
              <p className="text-xs text-extrad-muted font-medium line-clamp-1">{product.name}</p>
            </div>
            <button
              onClick={() => removeFromCart(item._id)}
              className="text-gray-400 hover:text-rose-600 transition-colors p-1"
              title="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Size & Color Tags */}
          <div className="flex items-center gap-3 mt-2 text-xs text-extrad-dark font-semibold">
            <span className="bg-extrad-light px-2 py-0.5 rounded text-[11px]">
              Size: <strong>{item.size || 'M'}</strong>
            </span>
            {item.color && (
              <span className="bg-extrad-light px-2 py-0.5 rounded text-[11px]">
                Color: <strong>{item.color}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Quantity Stepper & Prices */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
            <button
              onClick={() => updateQuantity(item._id, item.quantity - 1, item.size, item.color)}
              className="p-1.5 hover:bg-gray-200 text-extrad-dark transition-colors disabled:opacity-30"
              disabled={item.quantity <= 1}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 text-xs font-extrabold text-extrad-dark">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item._id, item.quantity + 1, item.size, item.color)}
              className="p-1.5 hover:bg-gray-200 text-extrad-dark transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pricing */}
          <div className="text-right">
            <div className="flex items-baseline gap-1.5 justify-end">
              <span className="text-sm font-extrabold text-extrad-dark">
                ₹{(product.price || 0) * item.quantity}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{(product.mrp || 0) * item.quantity}
                </span>
              )}
            </div>
            <button
              onClick={handleMoveToWishlist}
              className="text-[10px] font-bold text-extrad-pink hover:underline flex items-center gap-1 mt-0.5 ml-auto"
            >
              <Heart className="w-3 h-3" /> Move to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
