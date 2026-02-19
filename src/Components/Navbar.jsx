import React, { useState, useEffect, useRef } from 'react';
import { Search, User, LogOut, ShoppingCart, Menu } from 'lucide-react';

const Navbar = ({ currentUser, onLogout, onNavigate, onSearch, cartCount = 0 }) => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    loadCategoriesAndProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadCategoriesAndProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const products = await response.json();
      
      setAllProducts(products);
      const unique = [...new Set(products.map(p => p.category).filter(Boolean))];
      setCategories(unique);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 0) {
      const filtered = allProducts
        .filter(p => {
          const matchesCategory = category === 'all' || p.category === category;
          const matchesQuery = p.name.toLowerCase().includes(value.toLowerCase());
          return matchesCategory && matchesQuery;
        })
        .slice(0, 8);
      
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchClick = () => {
    setShowSuggestions(false);
    onSearch({
      category: category === 'all' ? '' : category,
      query: query.trim()
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handleSuggestionClick = (product) => {
    setQuery(product.name);
    setShowSuggestions(false);
    onSearch({
      category: category === 'all' ? '' : category,
      query: product.name
    });
  };

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    onSearch({ category: cat === 'all' ? '' : cat, query: '' });
    setShowMobileMenu(false);
  };

  return (
    <nav className="bg-dark text-white sticky-top shadow-lg">
      {/* Main Navigation */}
      <div className="container-fluid py-2 py-md-3 px-3 px-md-4">
        <div className="row align-items-center g-2 g-md-3">
          {/* Logo */}
          <div className="col-6 col-md-auto">
            <button 
              onClick={() => onNavigate('home')}
              className="btn btn-link text-white text-decoration-none d-flex align-items-center gap-2 fs-5 fs-md-4 fw-bold p-0 hover-warning"
            >
              <ShoppingCart size={24} className="d-md-none" />
              <ShoppingCart size={28} className="d-none d-md-block" />
              <span className="text-nowrap">BuyByBest</span>
            </button>
          </div>

          {/* Mobile Menu Toggle & Cart */}
          <div className="col-6 d-md-none text-end">
            <div className="d-flex align-items-center justify-content-end gap-3">
              {/* Mobile Cart */}
              <button 
                className="btn btn-link text-white text-decoration-none p-0 hover-warning"
                onClick={() => onNavigate('cart')}
              >
                <div className="position-relative">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark" style={{ fontSize: '0.6rem' }}>
                      {cartCount}
                    </span>
                  )}
                </div>
              </button>
              
              {/* Mobile Menu Toggle */}
              <button 
                className="btn btn-link text-white p-0"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="col-12 col-md order-3 order-md-2" ref={searchRef}>
            <div className="position-relative">
              <div className="input-group input-group-sm input-group-md">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select form-select-sm"
                  style={{ maxWidth: '100px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                >
                  <option value="all">All</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
                <input
                  type="text"
                  value={query}
                  onChange={handleQueryChange}
                  onKeyPress={handleKeyPress}
                  onFocus={() => query && setShowSuggestions(true)}
                  placeholder="Search products..."
                  className="form-control form-control-sm border-start-0 border-end-0"
                />
                
                <button
                  onClick={handleSearchClick}
                  className="btn btn-warning btn-sm"
                >
                  <Search size={18} />
                </button>
              </div>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="position-absolute w-100 bg-white text-dark rounded shadow-lg mt-1" style={{ maxHeight: '20rem', overflowY: 'auto', zIndex: 1050 }}>
                  {suggestions.map(product => (
                    <button
                      key={product._id}
                      onClick={() => handleSuggestionClick(product)}
                      className="w-100 d-flex align-items-center gap-2 gap-md-3 px-2 px-md-3 py-2 py-md-3 border-bottom text-start btn btn-light"
                    >
                      <div className="bg-light rounded flex-shrink-0" style={{ width: '40px', height: '40px' }}>
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-100 h-100 object-fit-cover rounded"
                          />
                        ) : (
                          <div className="w-100 h-100 d-flex align-items-center justify-content-center fs-5">📦</div>
                        )}
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="fw-medium small text-truncate">{product.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{product.category}</div>
                      </div>
                      <div className="text-warning fw-bold small">${product.price}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Cart & User Section */}
          <div className="col-auto d-none d-md-flex align-items-center gap-3 order-md-3">
            {/* Cart */}
            <button 
              className="btn btn-link text-white text-decoration-none d-flex align-items-center gap-2 p-0 hover-warning"
              onClick={() => onNavigate('cart')}
            >
              <div className="position-relative">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="d-none d-lg-block text-nowrap">Cart</span>
            </button>

            {/* User Section */}
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              {currentUser ? (
                <>
                  <div className="d-none d-lg-flex flex-column" style={{ lineHeight: '1.2' }}>
                    <span className="text-white fw-bold" style={{ fontSize: '13px' }}>Hello, {currentUser.username}</span>
                   
{currentUser && (
  <button
    onClick={() => onNavigate('account')}
    className="btn btn-link text-white text-decoration-none p-0 hover-warning d-flex align-items-center gap-1"
    style={{ fontSize: '13px' }}
    title="My Account & Orders"
  >
    <User size={16} />
   <span className="text-white-50" style={{ fontSize: '13px' }}>Account & Lists</span>
  </button>
)}
                  </div>
                  <button 
                    onClick={onLogout} 
                    className="btn btn-link text-white text-decoration-none p-0 hover-warning d-flex align-items-center gap-1"
                    style={{ fontSize: '13px' }}
                  >
                    <LogOut size={16} />
                    <span className="d-none d-xl-inline">Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="d-flex flex-column" style={{ lineHeight: '1.2' }}>
                    <span className="text-white-50" style={{ fontSize: '11px' }}>Hello, sign in</span>
                    <button 
                      onClick={() => onNavigate('login')} 
                      className="btn btn-link text-white text-decoration-none p-0 fw-semibold hover-warning text-start"
                      style={{ fontSize: '13px' }}
                    >
                      Account & Lists
                    </button>
                  </div>
                  <button 
                    onClick={() => onNavigate('register')} 
                    className="btn btn-outline-warning btn-sm d-none d-xl-block"
                    style={{ fontSize: '12px', padding: '4px 12px' }}
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="d-md-none bg-dark border-top border-secondary">
          <div className="container-fluid px-3 py-3">
            {/* User Section Mobile */}
            <div className="mb-3 pb-3 border-bottom border-secondary">
              {currentUser ? (
                <div className="d-flex flex-column gap-2">
                  <span className="d-flex align-items-center gap-2 text-white">
                    <User size={16} />
                    Hello, {currentUser.username}
                  </span>
                  <button 
                    onClick={() => { onLogout(); setShowMobileMenu(false); }} 
                    className="btn btn-sm btn-outline-warning text-start d-flex align-items-center gap-2"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  <button 
                    onClick={() => { onNavigate('login'); setShowMobileMenu(false); }} 
                    className="btn btn-sm btn-warning"
                  >
                    Sign in
                  </button>
                  <button 
                    onClick={() => { onNavigate('register'); setShowMobileMenu(false); }} 
                    className="btn btn-sm btn-outline-warning"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>

            {/* Categories Mobile */}
            <div className="d-flex flex-column gap-2">
              <button 
                onClick={() => handleCategoryClick('all')}
                className="btn btn-sm text-start"
                style={{
                  backgroundColor: category === 'all' ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: 'none'
                }}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="btn btn-sm text-start"
                  style={{
                    backgroundColor: category === cat ? 'rgba(71, 66, 66, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Navigation - Desktop Only */}
      <div className="bg-dark border-top border-secondary d-none d-md-block" style={{ backgroundColor: '#1e293b' }}>
        <div className="container-fluid px-3 px-md-4">
          <div className="d-flex align-items-center justify-content-center flex-wrap gap-2 gap-md-3 py-2 py-md-3">
            {/* All Categories Button */}
            <button 
              onClick={() => handleCategoryClick('all')}
              className="btn btn-sm text-nowrap d-flex align-items-center gap-2 shadow-sm"
              style={{
                backgroundColor: category === 'all' ? 'rgb(255, 193, 8)' : 'rgb(255, 193, 8)',
                color: 'black',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              All
            </button>

            {/* Category Buttons */}
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className="btn btn-sm text-nowrap shadow-sm"
                style={{
                  backgroundColor: category === cat ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '6px 16px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = category === cat ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .hover-warning:hover {
          color: #ffc107 !important;
        }
        
        .object-fit-cover {
          object-fit: cover;
        }
        
        @media (min-width: 768px) {
          .input-group-md .form-control,
          .input-group-md .form-select,
          .input-group-md .btn {
            font-size: 1rem;
            padding: 0.5rem 0.75rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;