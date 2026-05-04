import React, { useState, useEffect, useRef } from 'react';
import { Search, User, LogOut, ShoppingCart, Menu } from 'lucide-react';
import Logo from '../assets/Logo.png';

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
      const response = await fetch('https://buybybest-back-end.onrender.com/api/products');
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
    onSearch({ category: category === 'all' ? '' : category, query: query.trim() });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearchClick();
  };

  const handleSuggestionClick = (product) => {
    setQuery(product.name);
    setShowSuggestions(false);
    onSearch({ category: category === 'all' ? '' : category, query: product.name });
  };

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    onSearch({ category: cat === 'all' ? '' : cat, query: '' });
    setShowMobileMenu(false);
  };

  return (
    <>
      <style>{`
        :root {
          --tic-blue: #16792e;
          --tic-orange: #eb1b1b;
          --tic-green: #2d8c3c;
          --tic-dark: #32f884;
          --tic-light-blue: #e8f0fb;
        }

        .tic-navbar {
          background: linear-gradient(135deg, var(--tic-dark) 0%, var(--tic-blue) 100%);
          box-shadow: 0 4px 20px rgba(13, 43, 94, 0.4);
        }

        .tic-logo-btn {
          background: none;
          border: none;
          padding: 4px 8px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .tic-logo-btn:hover { transform: scale(1.04); }
        .tic-logo-btn img {
          height: 85px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 2px 6px rgba(255,122,0,0.3));
        }

        .tic-search-group .form-select {
          background-color: #fff;
          border: none;
          border-radius: 8px 0 0 8px;
          font-size: 13px;
          color: #0d2b5e;
          font-weight: 600;
          max-width: 110px;
        }
        .tic-search-group .form-control {
          border: none;
          font-size: 14px;
          background: #fff;
        }
        .tic-search-group .form-control:focus {
          box-shadow: none;
          outline: none;
        }
        .tic-search-btn {
          background: var(--tic-orange) !important;
          border: none !important;
          border-radius: 0 8px 8px 0 !important;
          color: #fff !important;
          padding: 0 18px !important;
          transition: background 0.2s;
        }
        .tic-search-btn:hover { background: #e06500 !important; }

        .tic-nav-icon-btn {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          padding: 6px 8px;
          border-radius: 6px;
          transition: background 0.2s, color 0.2s;
          text-decoration: none;
        }
        .tic-nav-icon-btn:hover {
          background: rgba(255,122,0,0.2);
          color: var(--tic-orange);
        }
        .tic-nav-icon-btn .label-sm { font-size: 11px; color: rgba(255,255,255,0.6); }
        .tic-nav-icon-btn .label-main { font-weight: 600; color: #fff; font-size: 13px; }

        .tic-cart-badge {
          position: absolute;
          top: -6px;
          right: -8px;
          background: var(--tic-orange);
          color: #fff;
          border-radius: 50%;
          font-size: 10px;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .tic-category-bar {
          background: var(--tic-blue);
          border-top: 1px solid rgba(255,255,255,0.12);
        }

        .tic-cat-btn {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          padding: 5px 16px;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .tic-cat-btn:hover {
          background: rgba(255,122,0,0.25);
          border-color: var(--tic-orange);
          color: #ffd699;
          transform: translateY(-2px);
        }
        .tic-cat-btn.active {
          background: var(--tic-orange);
          border-color: var(--tic-orange);
          color: #fff;
          font-weight: 700;
        }
        .tic-cat-btn.all-btn {
          background: var(--tic-green);
          border-color: var(--tic-green);
          color: #fff;
          font-weight: 700;
        }
        .tic-cat-btn.all-btn:hover, .tic-cat-btn.all-btn.active {
          background: #236b30;
          border-color: #236b30;
        }

        .tic-suggestions {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 12px 40px rgba(13,43,94,0.18);
          z-index: 1050;
          max-height: 320px;
          overflow-y: auto;
        }
        .tic-suggestion-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border: none;
          background: transparent;
          border-bottom: 1px solid #f0f0f0;
          text-align: left;
          cursor: pointer;
          transition: background 0.15s;
        }
        .tic-suggestion-item:hover { background: var(--tic-light-blue); }
        .tic-suggestion-item:last-child { border-bottom: none; }

        .tic-mobile-menu {
          background: var(--tic-dark);
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .tic-register-btn {
          background: var(--tic-orange);
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 5px 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .tic-register-btn:hover { background: #e06500; }

        @media (max-width: 767px) {
          .tic-logo-btn img { height: 44px; }
        }
      `}</style>

      <nav className="tic-navbar sticky-top">
        {/* ── Main Row ── */}
        <div className="container-fluid py-2 px-3 px-md-4">
          <div className="row align-items-center g-2">

            {/* Logo */}
            <div className="col-6 col-md-auto">
              <button className="tic-logo-btn" onClick={() => onNavigate('home')}>
                <img src={Logo} alt="The Indian Commerce" />
              </button>
            </div>

            {/* Mobile: cart + hamburger */}
            <div className="col-6 d-md-none text-end">
              <div className="d-flex align-items-center justify-content-end gap-3">
                <button className="tic-nav-icon-btn" onClick={() => onNavigate('cart')}>
                  <div className="position-relative">
                    <ShoppingCart size={22} />
                    {cartCount > 0 && <span className="tic-cart-badge">{cartCount}</span>}
                  </div>
                </button>
                <button className="tic-nav-icon-btn" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                  <Menu size={24} />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="col-12 col-md order-3 order-md-2" ref={searchRef}>
              <div className="position-relative">
                <div className="input-group tic-search-group" style={{ borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-select"
                    style={{ maxWidth: 110 }}
                  >
                    <option value="all">All</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <input
                    type="text"
                    value={query}
                    onChange={handleQueryChange}
                    onKeyPress={handleKeyPress}
                    onFocus={() => query && setShowSuggestions(true)}
                    placeholder="Search products..."
                    className="form-control"
                  />
                  <button className="tic-search-btn" onClick={handleSearchClick}>
                    <Search size={18} />
                  </button>
                </div>

                {showSuggestions && suggestions.length > 0 && (
                  <div className="tic-suggestions">
                    {suggestions.map(product => (
                      <button key={product._id} className="tic-suggestion-item" onClick={() => handleSuggestionClick(product)}>
                        <div style={{ width: 40, height: 40, borderRadius: 6, overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 }}>
                          {product.images?.[0]
                            ? <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>
                          }
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                          <div style={{ fontSize: 11, color: '#888' }}>{product.category}</div>
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--tic-orange)', fontSize: 13 }}>₹{product.price}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop: Cart + User */}
            <div className="col-auto d-none d-md-flex align-items-center gap-2 order-md-3">
              {/* Cart */}
              <button className="tic-nav-icon-btn" onClick={() => onNavigate('cart')}>
                <div className="position-relative">
                  <ShoppingCart size={22} />
                  {cartCount > 0 && <span className="tic-cart-badge">{cartCount}</span>}
                </div>
                <span className="d-none d-lg-block" style={{ fontWeight: 600, fontSize: 13 }}>Cart</span>
              </button>

              {/* User */}
              {currentUser ? (
                <div className="d-flex align-items-center gap-1">
                  <button className="tic-nav-icon-btn d-flex flex-column align-items-start" onClick={() => onNavigate('account')} style={{ gap: 0 }}>
                    <span className="label-sm">Hello, {currentUser.username}</span>
                    <span className="label-main d-flex align-items-center gap-1"><User size={14} /> Account & Lists</span>
                  </button>
                  <button className="tic-nav-icon-btn" onClick={onLogout} title="Sign Out">
                    <LogOut size={16} />
                    <span className="d-none d-xl-inline" style={{ fontSize: 13 }}>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <button className="tic-nav-icon-btn d-flex flex-column align-items-start" onClick={() => onNavigate('login')} style={{ gap: 0 }}>
                    <span className="label-sm">Hello, sign in</span>
                    <span className="label-main">Account & Lists</span>
                  </button>
                  <button className="tic-register-btn d-none d-xl-block" onClick={() => onNavigate('register')}>Register</button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ── Category Bar (Desktop) ── */}
        <div className="tic-category-bar d-none d-md-block">
          <div className="container-fluid px-3 px-md-4">
            <div className="d-flex align-items-center justify-content-center flex-wrap gap-2 py-2">
              <button className={`tic-cat-btn all-btn ${category === 'all' ? 'active' : ''}`} onClick={() => handleCategoryClick('all')}>
                🛒 All
              </button>
              {categories.map(cat => (
                <button key={cat} className={`tic-cat-btn ${category === cat ? 'active' : ''}`} onClick={() => handleCategoryClick(cat)}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {showMobileMenu && (
          <div className="tic-mobile-menu">
            <div className="container-fluid px-3 py-3">
              {/* User section */}
              <div className="mb-3 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {currentUser ? (
                  <div className="d-flex flex-column gap-2">
                    <span style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <User size={16} /> Hello, {currentUser.username}
                    </span>
                    <button className="tic-nav-icon-btn" style={{ width: 'fit-content', border: '1px solid var(--tic-orange)', borderRadius: 6, padding: '6px 14px' }}
                      onClick={() => { onLogout(); setShowMobileMenu(false); }}>
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="d-flex gap-2">
                    <button className="tic-register-btn" style={{ flex: 1 }} onClick={() => { onNavigate('login'); setShowMobileMenu(false); }}>Sign in</button>
                    <button className="tic-register-btn" style={{ flex: 1, background: 'var(--tic-green)' }} onClick={() => { onNavigate('register'); setShowMobileMenu(false); }}>Register</button>
                  </div>
                )}
              </div>
              {/* Categories */}
              <div className="d-flex flex-wrap gap-2">
                <button className={`tic-cat-btn all-btn ${category === 'all' ? 'active' : ''}`} onClick={() => handleCategoryClick('all')}>All</button>
                {categories.map(cat => (
                  <button key={cat} className={`tic-cat-btn ${category === cat ? 'active' : ''}`} onClick={() => handleCategoryClick(cat)}>{cat}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;