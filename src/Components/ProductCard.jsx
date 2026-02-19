import { Star } from 'lucide-react';

const ProductCard = ({ product, onViewDetails, onAddToCart,onNavigate }) => {
  // Debugging: Check what data is being passed
  console.log("ProductCard received:", product);

  if (!product) {
    return null;
  }



  // GRID VIEW
  return (
    <div className="card shadow-sm h-100 border-0"   onClick={() => onViewDetails(product)}
  style={{ cursor: 'pointer' }}>
      <div className="bg-light position-relative" style={{ height: '256px' }}>
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name || 'Product'}
            className="w-100 h-100 object-fit-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="w-100 h-100 d-flex align-items-center justify-content-center fs-1">📦</div>';
            }}
          />
        ) : (
          <div className="w-100 h-100 d-flex align-items-center justify-content-center fs-1">
            📦
          </div>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <div className="mb-2">
          <span className="badge bg-light text-dark small">{product.category || 'Uncategorized'}</span>
        </div>
        <h6 className="fw-semibold mb-2 text-truncate" title={product.name}>
          {product.name || 'Unnamed Product'}
        </h6>
        <div className="fw-bold fs-5 mb-3 text-warning">₹{product.price}</div>
        <button  onClick={() => onNavigate("checkout")} className="btn btn-warning w-100 mt-auto">
          Buy Now
        </button>
       <button
  onClick={() => onAddToCart(product)}
  className="btn btn-warning w-100 mt-2"
>
  Add to Cart
</button>

      </div>
      
    </div>
  );
};

export default ProductCard;