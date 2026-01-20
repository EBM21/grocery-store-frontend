import React from 'react';
import { Heart, ShoppingCart, Plus, X } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  
  const calculateDiscount = (price, originalPrice) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const discountPercent = calculateDiscount(product.price, product.original_price);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product);
  };

  const handleCardClick = () => {
    if (onViewDetails) onViewDetails(product);
  };

  return (
    <div 
      onClick={handleCardClick}
      style={{
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '6px',
        padding: '12px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '380px', // Thora height barha diya description k liye
        transition: 'box-shadow 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
      
      {/* Heart Icon */}
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, cursor: 'pointer', padding: '4px' }}>
        <Heart size={20} style={{ color: '#d1d5db', strokeWidth: 1.5 }} onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'} onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'} />
      </div>

      {/* Discount Badge */}
      {discountPercent > 0 && (
        <div style={{ position: 'absolute', top: '35px', right: '0', backgroundColor: '#FFEB3B', color: '#000', fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '3px 0 0 3px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)', fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap' }}>
          {discountPercent}% OFF - {product.discount_tag || "Grocery Mania"}
        </div>
      )}

      {/* Image */}
      <div style={{ width: '100%', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
        <img src={product.image_url || "https://placehold.co/300x300?text=No+Image"} alt={product.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
      </div>

      {/* Title */}
      <div style={{ marginBottom: '4px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', lineHeight: '1.4', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontFamily: 'Arial, sans-serif', margin: 0, minHeight: '40px' }} title={product.title}>
          {product.title}
        </h3>
      </div>

      {/* --- SHORT DESCRIPTION IN CARD (NEW) --- */}
      <div style={{ flex: 1, marginBottom: '8px' }}>
        <p style={{
            fontSize: '12px',
            color: '#666',
            margin: 0,
            lineHeight: '1.4',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2, // Sirf 2 lines show hongi
            WebkitBoxOrient: 'vertical',
            fontFamily: 'Arial, sans-serif'
        }}>
            {product.description || "No description available."}
        </p>
      </div>

      {/* Price */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ color: '#0066CC', fontWeight: 'bold', fontSize: '17px', fontFamily: 'Arial, sans-serif', marginBottom: '2px' }}>
          Rs. {Math.floor(product.price)}
        </div>
        {product.original_price && product.original_price > product.price && (
          <div style={{ color: '#999', fontSize: '12px', textDecoration: 'line-through', fontFamily: 'Arial, sans-serif' }}>
            Rs. {Math.floor(product.original_price)}
          </div>
        )}
      </div>

      {/* Button */}
      <button onClick={handleAddToCart} style={{ width: '100%', border: '1.5px solid #0066CC', borderRadius: '20px', padding: '7px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: '#0066CC', backgroundColor: 'white', cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'Arial, sans-serif', fontSize: '13px', fontWeight: '500' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0066CC'; e.currentTarget.style.color = 'white'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#0066CC'; }}>
        <ShoppingCart size={16} strokeWidth={2} /> <Plus size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
};

// --- PRODUCT DETAIL MODAL ---
const ProductDetailModal = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  const calculateDiscount = (price, originalPrice) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const discountPercent = calculateDiscount(product.price, product.original_price);

  return (
    <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '20px' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '12px', maxWidth: '900px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', zIndex: 10 }}>
          <X size={20} />
        </button>

        <div className="modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', padding: '24px' }}>
          
          {/* Left: Image */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', borderRadius: '8px', padding: '32px', minHeight: '300px' }}>
            <img src={product.image_url || "https://placehold.co/400x400?text=No+Image"} alt={product.title} style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} />
          </div>

          {/* Right: Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {discountPercent > 0 && (
              <div style={{ backgroundColor: '#FFEB3B', color: '#000', fontSize: '12px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '4px', display: 'inline-block', width: 'fit-content', fontFamily: 'Arial, sans-serif' }}>
                {discountPercent}% OFF - {product.discount_tag || "Grocery Mania"}
              </div>
            )}

            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a', lineHeight: '1.3', fontFamily: 'Arial, sans-serif', margin: 0 }}>
              {product.title}
            </h2>

            <div>
              <div style={{ color: '#0066CC', fontSize: '32px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', marginBottom: '4px' }}>
                Rs. {Math.floor(product.price)}
              </div>
              {product.original_price && product.original_price > product.price && (
                <div style={{ color: '#999', fontSize: '18px', textDecoration: 'line-through', fontFamily: 'Arial, sans-serif' }}>
                  Rs. {Math.floor(product.original_price)}
                </div>
              )}
            </div>

            {/* --- FULL DESCRIPTION IN POPUP (NEW) --- */}
            <div style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.6', fontFamily: 'Arial, sans-serif', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: '16px' }}>Product Details:</h4>
                <p style={{ margin: 0, whiteSpace: 'pre-line' }}>
                    {product.description || "No detailed description available for this product."}
                </p>
            </div>

            <button onClick={() => { onAddToCart(product); onClose(); }} style={{ width: '100%', backgroundColor: '#0066CC', color: 'white', border: 'none', borderRadius: '8px', padding: '14px 24px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'Arial, sans-serif', marginTop: '16px', transition: 'background-color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0052a3'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0066CC'}>
              <ShoppingCart size={20} /> Add to Cart
            </button>
          </div>
        </div>
        <style jsx>{` @media (min-width: 768px) { .modal-grid { grid-template-columns: 1fr 1fr !important; } } `}</style>
      </div>
    </div>
  );
};

export default ProductCard;
export { ProductDetailModal };