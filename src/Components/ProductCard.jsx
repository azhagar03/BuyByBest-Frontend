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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        height: '100%',
        transition: 'transform 0.3s ease',
        textAlign: 'center',
        padding: '20px 10px',
        fontFamily: "'Outfit', sans-serif"
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Image Blob */}
      <div style={{ 
        position: 'relative', 
        width: 180, 
        height: 180, 
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Blob background */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: '#d4edba',
          borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
          zIndex: 0,
          transition: 'all 0.4s ease'
        }} />
        
        {/* Image */}
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name || 'Product'}
            style={{ 
              width: '85%', 
              height: '85%', 
              objectFit: 'contain', 
              zIndex: 1, 
              filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.15))',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={e => {
              e.target.style.transform = 'scale(1.1) rotate(3deg)';
              e.target.previousSibling.style.borderRadius = '50% 50% 30% 70% / 60% 40% 70% 40%';
              e.target.previousSibling.style.transform = 'rotate(10deg)';
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'scale(1) rotate(0)';
              e.target.previousSibling.style.borderRadius = '40% 60% 70% 30% / 40% 50% 60% 50%';
              e.target.previousSibling.style.transform = 'rotate(0)';
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;z-index:1;">📦</div>';
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', zIndex: 1 }}>
            📦
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <div style={{ position: 'absolute', top: 0, right: 0, background: '#FF6B00', color: '#fff', borderRadius: '50%', width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, zIndex: 2, boxShadow: '0 4px 10px rgba(255,107,0,0.3)', transform: 'rotate(10deg)' }}>
            -{discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>
          {product.category || 'General'}
        </div>
        <h6 style={{ fontWeight: 800, fontSize: 16, color: '#1a1a1a', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.3 }} title={product.name}>
          {product.name || 'Unnamed Product'}
        </h6>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#FF6B00' }}>₹{salePrice.toLocaleString('en-IN')}</span>
          {hasDiscount && (
            <span style={{ fontSize: 13, color: '#aaa', textDecoration: 'line-through' }}>₹{origPrice.toLocaleString('en-IN')}</span>
          )}
        </div>

        {/* Buttons */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: 8, width: '100%', maxWidth: 200 }}>
          <button
            onClick={e => { e.stopPropagation(); onAddToCart(product); }}
            style={{ flex: 1, padding: '10px', borderRadius: 50, border: '2px solid #FF6B00', background: 'transparent', color: '#FF6B00', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Add to Cart"
            onMouseEnter={e => { e.currentTarget.style.background = '#fff5ef'; e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Cart
          </button>
          <button
            onClick={e => { e.stopPropagation(); onNavigate("checkout"); }}
            style={{ flex: 1, padding: '10px', borderRadius: 50, border: 'none', background: '#FF6B00', color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(255,107,0,0.2)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e55d00'; e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FF6B00'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;