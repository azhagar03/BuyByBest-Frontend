import { SlidersHorizontal, Star } from "lucide-react";
import { useEffect, useState } from "react";

const FilterSidebar = ({ onFilterChange, products }) => {
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [isPriceInitialized, setIsPriceInitialized] = useState(false);

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
  const prices = products.map(p => p.price).filter(p => !isNaN(p) && p > 0);
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 100000;
  console.log('FilterSidebar: products=', products.length, 'maxPrice=', maxPrice, 'isPriceInitialized=', isPriceInitialized);

  useEffect(() => {
    if (products.length > 0 && !isPriceInitialized) {
      setPriceRange([0, maxPrice]);
      setIsPriceInitialized(true);
    }
  }, [products, maxPrice, isPriceInitialized]);

  useEffect(() => {
    applyFilters();
  }, [priceRange, selectedCategories, selectedBrands, minRating]);

  const applyFilters = () => {
    onFilterChange({
      priceRange,
      categories: selectedCategories,
      brands: selectedBrands,
      minRating
    });
  };

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    const maxPriceValue = prices.length > 0 ? Math.max(...prices) : 100000;
    setPriceRange([0, maxPriceValue]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMinRating(0);
  };

  return (
    <div className="card shadow-sm sticky-top" style={{ top: '6rem'}}>
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="card-title mb-0 d-flex align-items-center gap-2">
            <SlidersHorizontal size={20} />
            Filters
          </h5>
          <button
            onClick={clearFilters}
            className="btn btn-link btn-sm text-primary p-0"
          >
            Clear All
          </button>
        </div>

        {/* Price Range */}
        <div className="mb-4 pb-4 border-bottom">
          <h6 className="fw-semibold mb-3">Price Range</h6>
          <div>
            <input
              type="range"
              min="0"
              max={maxPrice.toString()}
              value={priceRange[1].toString()}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value) || 0])}
              className="form-range"
              style={{ accentColor: '#fd7e14' }}
            />
            <div className="d-flex align-items-center justify-content-between small mt-2">
              <span className="fw-medium">${priceRange[0]}</span>
              <span className="fw-medium">${priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-4 pb-5 mb-5 border-bottom">
            <h6 className="fw-semibold mb-3">Category</h6>
            <div className="overflow-auto" style={{ maxHeight: '12rem' }}>
              {categories.map(cat => (
                <div key={cat} className="form-check mb-2">
                  <input
                    type="checkbox"
                    id={`cat-${cat}`}
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="form-check-input"
                    style={{ accentColor: '#fd7e14' }}
                  />
                  <label className="form-check-label small" htmlFor={`cat-${cat}`}>
                    {cat}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Brands */}
        {brands.length > 0 && (
          <div className="mb-4 pb-5 border-bottom">
            <h6 className="fw-semibold mb-3">Brand</h6>
            <div className="overflow-auto" style={{ maxHeight: '12rem' }}>
              {brands.map(brand => (
                <div key={brand} className="form-check mb-2">
                  <input
                    type="checkbox"
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="form-check-input"
                    style={{ accentColor: '#fd7e14' }}
                  />
                  <label className="form-check-label small" htmlFor={`brand-${brand}`}>
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};
export default FilterSidebar;