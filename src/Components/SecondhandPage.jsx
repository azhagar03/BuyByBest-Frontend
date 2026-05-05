import { useState } from "react";
import { MapPin, Clock, MessageCircle, Heart, Search, Plus, ChevronRight, Phone } from "lucide-react";

const STATIC_LISTINGS = [
  {
    id: 1,
    title: "iPhone 13 Pro – 256GB, Sierra Blue",
    category: "Electronics",
    price: 52000,
    originalPrice: 79900,
    location: "Chennai, Tamil Nadu",
    postedAgo: "2 hours ago",
    condition: "Like New",
    seller: "Arjun K.",
    sellerRating: 4.8,
    image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&q=80",
    description: "Used for 8 months only. No scratches, comes with original box, charger and earphones. Battery health 91%.",
    negotiable: true,
    views: 142,
  },
  {
    id: 2,
    title: "Wooden Study Table with Drawer",
    category: "Furniture",
    price: 3500,
    originalPrice: 8000,
    location: "Madurai, Tamil Nadu",
    postedAgo: "5 hours ago",
    condition: "Good",
    seller: "Priya S.",
    sellerRating: 4.5,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    description: "Solid wood study table. Minor wear marks on top surface. Drawer works perfectly. Selling due to house shifting.",
    negotiable: true,
    views: 87,
  },
  {
    id: 3,
    title: "Honda Activa 5G – 2021 Model",
    category: "Vehicles",
    price: 58000,
    originalPrice: 74000,
    location: "Coimbatore, Tamil Nadu",
    postedAgo: "1 day ago",
    condition: "Good",
    seller: "Ravi M.",
    sellerRating: 4.7,
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=80",
    description: "Single owner, 18,000 km driven. All documents clear. Insurance valid till Dec 2025. Well maintained.",
    negotiable: false,
    views: 320,
  },
  {
    id: 4,
    title: "Canon EOS 200D DSLR Camera Kit",
    category: "Electronics",
    price: 28000,
    originalPrice: 46990,
    location: "Trichy, Tamil Nadu",
    postedAgo: "3 hours ago",
    condition: "Excellent",
    seller: "Deepa R.",
    sellerRating: 5.0,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80",
    description: "Kit includes 18-55mm lens, 2 batteries, charger, bag and 32GB card. Only 4000 shutter count. Professional use.",
    negotiable: true,
    views: 215,
  },
  {
    id: 5,
    title: "Samsung 43\" 4K Smart TV",
    category: "Electronics",
    price: 22000,
    originalPrice: 38000,
    location: "Salem, Tamil Nadu",
    postedAgo: "2 days ago",
    condition: "Good",
    seller: "Karthik V.",
    sellerRating: 4.3,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f4d369?w=400&q=80",
    description: "2-year-old Samsung 43 inch 4K TV. Works perfectly. Remote included. Reason: upgrading to larger size.",
    negotiable: true,
    views: 178,
  },
  {
    id: 6,
    title: "Treadmill – 3HP Motor, Foldable",
    category: "Sports & Fitness",
    price: 14000,
    originalPrice: 35000,
    location: "Madurai, Tamil Nadu",
    postedAgo: "4 hours ago",
    condition: "Like New",
    seller: "Meena T.",
    sellerRating: 4.9,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
    description: "Used only 20 times. 3HP motor, foldable design, LED display. Can be disassembled for transport.",
    negotiable: false,
    views: 93,
  },
  {
    id: 7,
    title: "Bajaj Mixer Grinder 750W",
    category: "Home Appliances",
    price: 1200,
    originalPrice: 3499,
    location: "Tirunelveli, Tamil Nadu",
    postedAgo: "6 hours ago",
    condition: "Good",
    seller: "Anu B.",
    sellerRating: 4.6,
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80",
    description: "1 year old, works perfectly. 3 jars included. Selling as purchased food processor.",
    negotiable: true,
    views: 54,
  },
  {
    id: 8,
    title: "Kids Cycle – 20 inch, Blue",
    category: "Kids & Baby",
    price: 1800,
    originalPrice: 4500,
    location: "Vellore, Tamil Nadu",
    postedAgo: "1 day ago",
    condition: "Good",
    seller: "Senthil P.",
    sellerRating: 4.4,
    image: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=400&q=80",
    description: "Blue kids cycle, 20 inch, suitable for 7-12 years. Has bell, water bottle holder and rear reflectors.",
    negotiable: true,
    views: 67,
  },
];

const CATEGORIES = ["All", "Electronics", "Furniture", "Vehicles", "Sports & Fitness", "Home Appliances", "Kids & Baby"];
const CONDITIONS = ["All", "Like New", "Excellent", "Good", "Fair"];

const SecondhandPage = ({ onNavigate }) => {
  const [liked, setLiked] = useState({});
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeCondition, setActiveCondition] = useState("All");
  const [searchQ, setSearchQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [showSell, setShowSell] = useState(false);

  const filtered = STATIC_LISTINGS.filter(l => {
    const matchCat = activeCategory === "All" || l.category === activeCategory;
    const matchCond = activeCondition === "All" || l.condition === activeCondition;
    const matchQ = l.title.toLowerCase().includes(searchQ.toLowerCase()) || l.category.toLowerCase().includes(searchQ.toLowerCase());
    return matchCat && matchCond && matchQ;
  });

  if (selected) {
    const saving = selected.originalPrice - selected.price;
    const pct = Math.round((saving / selected.originalPrice) * 100);
    return (
      <div style={{ fontFamily: "'Outfit', sans-serif", background: '#fafafa', minHeight: '100vh' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');`}</style>
        <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#FF6B00', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14 }}>
            ← Back to listings
          </button>
        </div>
        <div style={{ maxWidth: 900, margin: '24px auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ flex: '0 0 380px', maxWidth: '100%' }}>
              <img src={selected.image} alt={selected.title} style={{ width: '100%', height: 340, objectFit: 'cover', borderRadius: 16, border: '1px solid #f0f0f0' }} />
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <div style={{ flex: 1, background: '#e8f5e9', borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#1a7a2e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Condition</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#1a7a2e', marginTop: 2 }}>{selected.condition}</div>
                </div>
                <div style={{ flex: 1, background: '#fff3e0', borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#e65100', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Views</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#e65100', marginTop: 2 }}>{selected.views}</div>
                </div>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <span style={{ background: '#f5f5f5', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{selected.category}</span>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1a1a', margin: '10px 0 8px', lineHeight: 1.25 }}>{selected.title}</h1>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#FF6B00' }}>₹{selected.price.toLocaleString('en-IN')}</span>
                <span style={{ fontSize: 14, color: '#aaa', textDecoration: 'line-through' }}>₹{selected.originalPrice.toLocaleString('en-IN')}</span>
                <span style={{ background: '#e8f5e9', color: '#1a7a2e', borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{pct}% off</span>
              </div>
              {selected.negotiable && <div style={{ fontSize: 12, color: '#1a7a2e', fontWeight: 600, marginBottom: 14 }}>✅ Negotiable</div>}
              <div style={{ display: 'flex', gap: 8, color: '#666', fontSize: 13, marginBottom: 8, alignItems: 'center' }}>
                <MapPin size={14} color="#FF6B00" /> {selected.location}
              </div>
              <div style={{ display: 'flex', gap: 8, color: '#666', fontSize: 13, marginBottom: 20, alignItems: 'center' }}>
                <Clock size={14} color="#888" /> {selected.postedAgo}
              </div>
              <div style={{ background: '#fafafa', borderRadius: 12, padding: 16, marginBottom: 20, border: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>📝 Description</div>
                <p style={{ fontSize: 13.5, color: '#555', lineHeight: 1.75, margin: 0 }}>{selected.description}</p>
              </div>
              {/* Seller info */}
              <div style={{ background: '#fff', border: '1.5px solid #f0f0f0', borderRadius: 14, padding: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>Seller Info</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FF6B00', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16 }}>
                    {selected.seller[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>{selected.seller}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>⭐ {selected.sellerRating} · Member</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={{ flex: 1, background: '#FF6B00', border: 'none', borderRadius: 12, padding: '13px', color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <MessageCircle size={17} /> Chat with Seller
                </button>
                <button style={{ flex: 1, background: '#1a7a2e', border: 'none', borderRadius: 12, padding: '13px', color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Phone size={17} /> Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#fafafa', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        .sh-card { background: #fff; border-radius: 14px; overflow: hidden; border: 1px solid #f0f0f0; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
        .sh-card:hover { transform: translateY(-5px); box-shadow: 0 14px 36px rgba(0,0,0,0.09); border-color: #ffe0cc; }
        .sh-pill { background: none; border: 1.5px solid #e0e0e0; border-radius: 50px; padding: 5px 16px; font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; color: #555; transition: all 0.18s; white-space: nowrap; }
        .sh-pill:hover { border-color: #FF6B00; color: #FF6B00; }
        .sh-pill.active { background: #FF6B00; border-color: #FF6B00; color: #fff; }
      `}</style>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', padding: '32px 20px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,107,0,0.15)', border: '1px solid rgba(255,107,0,0.3)', borderRadius: 50, padding: '5px 16px', marginBottom: 14 }}>
          <span style={{ fontSize: 16 }}>♻️</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#FF6B00', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Secondhand Marketplace</span>
        </div>
        <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.9rem', marginBottom: 6, letterSpacing: '-0.5px' }}>Buy & Sell Pre-loved Items</h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, marginBottom: 24 }}>Find great deals from people near you</p>
        {/* Search */}
        <div style={{ maxWidth: 500, margin: '0 auto', display: 'flex', gap: 0, background: '#fff', borderRadius: 50, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          <input
            type="text"
            placeholder="Search listings..."
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            style={{ flex: 1, border: 'none', padding: '12px 20px', fontFamily: 'Outfit, sans-serif', fontSize: 14, outline: 'none', background: 'transparent' }}
          />
          <button style={{ background: '#FF6B00', border: 'none', padding: '12px 22px', cursor: 'pointer', borderRadius: '0 50px 50px 0' }}>
            <Search size={18} color="#fff" />
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '24px 16px' }}>
        {/* Filters */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none', marginBottom: 10 }}>
            {CATEGORIES.map(cat => (
              <button key={cat} className={`sh-pill ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>Condition:</span>
            {CONDITIONS.map(c => (
              <button key={c} className={`sh-pill ${activeCondition === c ? 'active' : ''}`} onClick={() => setActiveCondition(c)} style={{ fontSize: 11.5, padding: '4px 12px' }}>{c}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 14, color: '#888', fontWeight: 500 }}>{filtered.length} listing{filtered.length !== 1 ? 's' : ''} found</span>
          <button onClick={() => setShowSell(true)} style={{ background: '#FF6B00', border: 'none', borderRadius: 10, padding: '9px 18px', color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
            <Plus size={16} /> Sell your item
          </button>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 18 }}>
          {filtered.map(listing => {
            const saving = listing.originalPrice - listing.price;
            const pct = Math.round((saving / listing.originalPrice) * 100);
            return (
              <div key={listing.id} className="sh-card" onClick={() => setSelected(listing)}>
                <div style={{ position: 'relative', height: 200, background: '#f5f5f5', overflow: 'hidden' }}>
                  <img src={listing.image} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                  <div style={{ position: 'absolute', top: 10, left: 10, background: listing.condition === 'Like New' || listing.condition === 'Excellent' ? '#1a7a2e' : '#856404', color: '#fff', borderRadius: 6, padding: '3px 9px', fontSize: 10, fontWeight: 800 }}>{listing.condition}</div>
                  <button
                    style={{ position: 'absolute', top: 10, right: 10, background: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    onClick={e => { e.stopPropagation(); setLiked(l => ({ ...l, [listing.id]: !l[listing.id] })); }}
                  >
                    <Heart size={15} color={liked[listing.id] ? '#ff3b5c' : '#ccc'} fill={liked[listing.id] ? '#ff3b5c' : 'none'} />
                  </button>
                </div>
                <div style={{ padding: '14px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 5 }}>{listing.category}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.35, marginBottom: 10, minHeight: '2.7em' }}>{listing.title}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontWeight: 800, fontSize: 18, color: '#FF6B00' }}>₹{listing.price.toLocaleString('en-IN')}</span>
                    <span style={{ fontSize: 11, color: '#bbb', textDecoration: 'line-through' }}>₹{listing.originalPrice.toLocaleString('en-IN')}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#1a7a2e', background: '#e8f5e9', borderRadius: 4, padding: '1px 5px' }}>{pct}% off</span>
                  </div>
                  {listing.negotiable && <div style={{ fontSize: 11, color: '#1a7a2e', fontWeight: 600, marginBottom: 8 }}>✅ Negotiable</div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f5f5f5', paddingTop: 10, marginTop: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#666' }}>
                      <MapPin size={12} color="#FF6B00" /> {listing.location.split(',')[0]}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#aaa' }}>
                      <Clock size={11} /> {listing.postedAgo}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sell Modal */}
      {showSell && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 420, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h5 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 18 }}>📦 List Your Item</h5>
              <button onClick={() => setShowSell(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#888' }}>×</button>
            </div>
            {["Title", "Category", "Price (₹)", "Location", "Condition", "Description"].map(f => (
              <div key={f} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 4, fontFamily: 'Outfit, sans-serif' }}>{f}</label>
                {f === "Description"
                  ? <textarea rows={3} style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 9, padding: '9px 12px', fontFamily: 'Outfit, sans-serif', fontSize: 13.5, outline: 'none', boxSizing: 'border-box', resize: 'none' }} />
                  : <input style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 9, padding: '9px 12px', fontFamily: 'Outfit, sans-serif', fontSize: 13.5, outline: 'none', boxSizing: 'border-box' }} />
                }
              </div>
            ))}
            <button style={{ width: '100%', background: '#FF6B00', border: 'none', borderRadius: 12, padding: '13px', color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 15, cursor: 'pointer', marginTop: 8 }}>
              Post Listing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecondhandPage;