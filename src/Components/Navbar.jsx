import React, { useState, useEffect, useRef } from 'react';
import { Search, User, LogOut, ShoppingCart, Menu, X } from 'lucide-react';
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

  useEffect(() => { loadCategoriesAndProducts(); }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
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
    } catch (error) { console.error('Error loading data:', error); }
  };

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim().length > 0) {
      const filtered = allProducts.filter(p => {
        const matchesCategory = category === 'all' || p.category === category;
        const matchesQuery = p.name.toLowerCase().includes(value.toLowerCase());
        return matchesCategory && matchesQuery;
      }).slice(0, 8);
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

  const handleKeyPress = (e) => { if (e.key === 'Enter') handleSearchClick(); };

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
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

        .tic-nav-root {
          font-family: 'Outfit', sans-serif;
          background: #ffffff;
          border-bottom: 1.5px solid #f0f0f0;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        /* ── Logo area ── */
        .tic-logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        .tic-logo-wrap img { height: 46px; width: auto; object-fit: contain; }
        .tic-brand-text { display: flex; flex-direction: column; line-height: 1; }
        .tic-brand-main {
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .tic-brand-main .the { color: #1a1a1a; }
        .tic-brand-main .indian { color: #FF6B00; }
        .tic-brand-main .commerce { color: #1a7a2e; }
        .tic-brand-sub {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 1.5px;
          color: #888;
          text-transform: uppercase;
          margin-top: 1px;
        }

        /* ── Feed Pills ── */
        .tic-feed-pills {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .tic-feed-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border: 2.5px solid transparent;
          background: none;
          cursor: pointer;
          transition: all 0.22s ease;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          gap: 2px;
          position: relative;
          overflow: hidden;
        }
        .tic-feed-pill .pill-emoji { font-size: 1.5rem; line-height: 1; }
        .tic-feed-pill.secondhand {
          background: linear-gradient(135deg, #fff3e0, #ffe0b2);
          border-color: #FF6B00;
          color: #e65100;
        }
        .tic-feed-pill.secondhand:hover {
          background: #FF6B00;
          color: #fff;
          transform: scale(1.1);
          box-shadow: 0 4px 14px rgba(255,107,0,0.35);
        }
        .tic-feed-pill.agri {
          background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
          border-color: #1a7a2e;
          color: #1a7a2e;
        }
        .tic-feed-pill.agri:hover {
          background: #1a7a2e;
          color: #fff;
          transform: scale(1.1);
          box-shadow: 0 4px 14px rgba(26,122,46,0.35);
        }

        /* ── Search ── */
        .tic-search-wrap {
          display: flex;
          align-items: center;
          background: #f5f5f5;
          border-radius: 50px;
          overflow: hidden;
          border: 1.5px solid #e8e8e8;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
        }
        .tic-search-wrap:focus-within {
          border-color: #FF6B00;
          box-shadow: 0 0 0 3px rgba(255,107,0,0.1);
          background: #fff;
        }
        .tic-search-select {
          border: none;
          background: transparent;
          font-size: 16px;
          font-weight: 600;
          color: #333;
          padding: 0 12px 0 16px;
          outline: none;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          flex-shrink: 0;
          border-right: 1.5px solid #e0e0e0;
          height: 44px;
          max-width: 110px;
        }
        .tic-search-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 15px;
          color: #1a1a1a;
          padding: 0 14px;
          outline: none;
          font-family: 'Outfit', sans-serif;
          height: 44px;
        }
        .tic-search-input::placeholder { color: #aaa; }
        .tic-search-btn-inner {
          background: #FF6B00;
          border: none;
          width: 46px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
          flex-shrink: 0;
          border-radius: 0 50px 50px 0;
        }
        .tic-search-btn-inner:hover { background: #e55d00; }

        /* ── Suggestions ── */
        .tic-suggestions {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
          z-index: 1100;
          max-height: 300px;
          overflow-y: auto;
          border: 1px solid #f0f0f0;
        }
        .tic-sug-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border: none;
          background: transparent;
          text-align: left;
          cursor: pointer;
          transition: background 0.15s;
          border-bottom: 1px solid #f5f5f5;
          font-family: 'Outfit', sans-serif;
        }
        .tic-sug-item:hover { background: #fff8f3; }
        .tic-sug-item:last-child { border-bottom: none; }

        /* ── Icon buttons ── */
        .tic-icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 10px;
          transition: background 0.18s;
          color: #1a1a1a;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 600;
          position: relative;
          text-decoration: none;
        }
        .tic-icon-btn:hover { background: #f5f5f5; }
        .tic-icon-btn .sub-label { font-size: 12px; color: #888; font-weight: 400; }
        .tic-icon-btn .main-label { font-size: 14px; font-weight: 700; color: #1a1a1a; }
        .tic-cart-badge {
          position: absolute;
          top: 2px;
          right: 6px;
          background: #FF6B00;
          color: #fff;
          border-radius: 50%;
          font-size: 10px;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }

        /* ── Category bar ── */
        .tic-cat-bar {
          background: #fafafa;
          border-top: 1px solid #f0f0f0;
          padding: 8px 0;
        }
        .tic-cat-list {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          padding: 2px 24px;
          scrollbar-width: none;
        }
        .tic-cat-list::-webkit-scrollbar { display: none; }
        .tic-cat-pill {
          background: none;
          border: 1.5px solid #e0e0e0;
          border-radius: 50px;
          padding: 6px 18px;
          font-size: 14px;
          font-weight: 600;
          color: #444;
          cursor: pointer;
          white-space: nowrap;
          font-family: 'Outfit', sans-serif;
          transition: all 0.18s;
        }
        .tic-cat-pill:hover { border-color: #FF6B00; color: #FF6B00; background: #fff5ee; }
        .tic-cat-pill.active { background: #FF6B00; border-color: #FF6B00; color: #fff; }
        .tic-cat-pill.all-pill { border-color: #1a7a2e; color: #1a7a2e; }
        .tic-cat-pill.all-pill:hover, .tic-cat-pill.all-pill.active { background: #1a7a2e; border-color: #1a7a2e; color: #fff; }

        /* ── Register btn ── */
        .tic-reg-btn {
          background: #1a1a1a;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 7px 16px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          transition: background 0.18s;
        }
        .tic-reg-btn:hover { background: #FF6B00; }

        /* ── Mobile menu ── */
        .tic-mobile-drawer {
          background: #fff;
          border-top: 1px solid #f0f0f0;
          padding: 16px;
        }

        @media (max-width: 767px) {
          .tic-logo-wrap img { height: 38px; }
          .tic-brand-main { font-size: 1.1rem; }
        }
      `}</style>

      <nav className="tic-nav-root">
        {/* ── Main Row ── */}
        <div style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>

          {/* Left: Logo + Feed Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
            {/* Logo + Brand */}
            <button className="tic-logo-wrap" onClick={() => onNavigate('home')} style={{ flexShrink: 0 }}>
              <img src={Logo} alt="TIC" />
              <div className="tic-brand-text">
                <div className="tic-brand-main">
                  <span className="the">the</span><span className="indian">indian</span><span className="commerce">commerce</span>
                </div>
                <div className="tic-brand-sub">Connect · Grow · Succeed</div>
              </div>
            </button>

            {/* Feed Pills */}
            <div className="tic-feed-pills" style={{ flexShrink: 0 }}>
              <button className="tic-feed-pill secondhand" onClick={() => onNavigate('secondhand')} title="Secondhand Market">
                <span className="pill-emoji">♻️</span>
                <span>Second Hand</span>
              </button>
              <button className="tic-feed-pill agri" onClick={() => onNavigate('agrifeed')} title="Agri Feed">
                <span className="pill-emoji">🌾</span>
                <span>Agree Feed</span>
              </button>
            </div>
          </div>

          {/* Search */}
          <div ref={searchRef} style={{ flex: 1, minWidth: 200, display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
              <div className="tic-search-wrap">
                <select className="tic-search-select" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="all">All</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <input
                  type="text"
                  className="tic-search-input"
                  value={query}
                  onChange={handleQueryChange}
                  onKeyPress={handleKeyPress}
                  onFocus={() => query && setShowSuggestions(true)}
                  placeholder="Search products, brands..."
                />
                <button className="tic-search-btn-inner" onClick={handleSearchClick}>
                  <Search size={18} color="#fff" />
                </button>
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <div className="tic-suggestions">
                  {suggestions.map(product => (
                    <button key={product._id} className="tic-sug-item" onClick={() => handleSuggestionClick(product)}>
                      <div style={{ width: 38, height: 38, borderRadius: 8, overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 }}>
                        {product.images?.[0]
                          ? <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>
                        }
                      </div>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{product.category}</div>
                      </div>
                      <span style={{ fontWeight: 700, color: '#FF6B00', fontSize: 14, flexShrink: 0 }}>₹{product.price}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Right: Cart + User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            {/* Cart */}
            <button className="tic-icon-btn" onClick={() => onNavigate('cart')} style={{ position: 'relative' }}>
              <ShoppingCart size={20} color="#1a1a1a" />
              {cartCount > 0 && <span className="tic-cart-badge">{cartCount}</span>}
              <span style={{ fontSize: 13, fontWeight: 600, display: 'none' }} className="d-lg-inline">Cart</span>
            </button>

            {/* User */}
            {currentUser ? (
              <>
                <button className="tic-icon-btn" onClick={() => onNavigate('account')} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 0 }}>
                  <span className="sub-label">Hello, {currentUser.username}</span>
                  <span className="main-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><User size={13} /> Account</span>
                </button>
                <button className="tic-icon-btn" onClick={onLogout} title="Sign Out">
                  <LogOut size={17} color="#666" />
                </button>
              </>
            ) : (
              <>
                <button className="tic-icon-btn" onClick={() => onNavigate('login')} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 0 }}>
                  <span className="sub-label">Hello, sign in</span>
                  <span className="main-label">Account &amp; Lists</span>
                </button>
                <button className="tic-reg-btn" onClick={() => onNavigate('register')}>Register</button>
              </>
            )}

            {/* Mobile hamburger */}
            <button className="tic-icon-btn d-md-none" onClick={() => setShowMobileMenu(!showMobileMenu)}>
              {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── Category Bar ── */}
        <div className="tic-cat-bar d-none d-md-block">
          <div className="tic-cat-list">
            <button className={`tic-cat-pill all-pill ${category === 'all' ? 'active' : ''}`} onClick={() => handleCategoryClick('all')}>🛒 All</button>
            {categories.map(cat => (
              <button key={cat} className={`tic-cat-pill ${category === cat ? 'active' : ''}`} onClick={() => handleCategoryClick(cat)}>{cat}</button>
            ))}
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        {showMobileMenu && (
          <div className="tic-mobile-drawer">
            <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
              {currentUser ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontSize: 13, color: '#444', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <User size={14} /> {currentUser.username}
                  </span>
                  <button className="tic-icon-btn" style={{ width: 'fit-content', border: '1px solid #ddd', borderRadius: 8 }}
                    onClick={() => { onLogout(); setShowMobileMenu(false); }}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="tic-reg-btn" style={{ flex: 1 }} onClick={() => { onNavigate('login'); setShowMobileMenu(false); }}>Sign in</button>
                  <button className="tic-reg-btn" style={{ flex: 1, background: '#1a7a2e' }} onClick={() => { onNavigate('register'); setShowMobileMenu(false); }}>Register</button>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <button className={`tic-cat-pill all-pill ${category === 'all' ? 'active' : ''}`} onClick={() => handleCategoryClick('all')}>All</button>
              {categories.map(cat => (
                <button key={cat} className={`tic-cat-pill ${category === cat ? 'active' : ''}`} onClick={() => handleCategoryClick(cat)}>{cat}</button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;