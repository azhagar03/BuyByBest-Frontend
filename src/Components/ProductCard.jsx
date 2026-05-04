import { Star } from 'lucide-react';

const ProductCard = ({ product, onViewDetails, onAddToCart, onNavigate }) => {
  if (!product) return null;

  const salePrice = Number(product.price) || 0;
  const origPrice = Number(product.originalPrice) || 0;
  const discount  = product.discount || 0;
  const hasDiscount = discount > 0 && origPrice > salePrice;

  return (
    <div
      onClick={() => onViewDetails(product)}
      style={{
        background: '#fff',
        borderRadius: 14,
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 2px 12px rgba(26,79,160,0.08)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(26,79,160,0.16)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(26,79,160,0.08)';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', background: '#f8fafc', height: 220, overflow: 'hidden' }}>
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name || 'Product'}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;">📦</div>';
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
            📦
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <div style={{ position: 'absolute', top: 10, left: 10, background: '#dc2626', color: '#fff', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700 }}>
            -{discount}% OFF
          </div>
        )}

        {/* Category badge */}
        <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(26,79,160,0.85)', color: '#fff', borderRadius: 20, padding: '3px 10px', fontSize: 10, fontWeight: 600, backdropFilter: 'blur(4px)' }}>
          {product.category || 'General'}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h6 style={{ fontWeight: 700, fontSize: 14, color: '#0d2b5e', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }} title={product.name}>
          {product.name || 'Unnamed Product'}
        </h6>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
          <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#FF7A00' }}>₹{salePrice.toLocaleString('en-IN')}</span>
          {hasDiscount && (
            <span style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'line-through' }}>₹{origPrice.toLocaleString('en-IN')}</span>
          )}
        </div>

        {/* Buttons */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={e => { e.stopPropagation(); onNavigate("checkout"); }}
            style={{ width: '100%', padding: '9px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#FF7A00,#e06500)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Buy Now
          </button>
          <button
            onClick={e => { e.stopPropagation(); onAddToCart(product); }}
            style={{ width: '100%', padding: '9px', borderRadius: 8, border: '2px solid #1a4fa0', background: 'transparent', color: '#1a4fa0', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1a4fa0'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1a4fa0'; }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;