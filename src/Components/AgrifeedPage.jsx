import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ShoppingBag, MapPin, TrendingUp, Leaf } from "lucide-react";

const FEED_POSTS = [
  {
    id: 1,
    user: { name: "FreshFarms Tamil Nadu", handle: "@freshfarms_tn", avatar: "🌾", verified: true },
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&q=80",
    caption: "🌿 Freshly harvested organic turmeric from our Erode fields! Zero chemicals, sun-dried the traditional way. Packed with curcumin for maximum health benefits. Order now and get farm-to-door delivery within 48 hours across Tamil Nadu!",
    tags: ["#OrganicTurmeric", "#FarmFresh", "#Erode", "#HealthyLiving"],
    likes: 1284,
    comments: 87,
    timeAgo: "2 hours ago",
    product: { name: "Organic Turmeric Powder 500g", price: 189, mrp: 350 },
    location: "Erode, Tamil Nadu",
    category: "Spices",
  },
  {
    id: 2,
    user: { name: "Green Valley Organics", handle: "@greenvalley_org", avatar: "🥬", verified: true },
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    caption: "🥗 Our winter harvest is here! Fresh seasonal vegetables – tomatoes, carrots, beans, and leafy greens. Grown without pesticides on our 40-acre certified organic farm in Ooty. Subscribe to our weekly veggie box 🎁",
    tags: ["#OrganicVeggies", "#Ooty", "#FarmToFork", "#WeeklyBox"],
    likes: 2107,
    comments: 143,
    timeAgo: "5 hours ago",
    product: { name: "Weekly Organic Veggie Box (5kg)", price: 499, mrp: 800 },
    location: "Ooty, Tamil Nadu",
    category: "Vegetables",
  },
  {
    id: 3,
    user: { name: "Honey Trails India", handle: "@honeytrails_in", avatar: "🍯", verified: false },
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80",
    caption: "🐝 Raw forest honey, collected from wild beehives in the Nilgiris. No heating, no sugar additives – just pure nature in a bottle. Each batch is lab-tested. Limited stock available this season! 🌺",
    tags: ["#ForestHoney", "#RawHoney", "#Nilgiris", "#PureNature"],
    likes: 3420,
    comments: 218,
    timeAgo: "8 hours ago",
    product: { name: "Raw Wild Forest Honey 500ml", price: 420, mrp: 650 },
    location: "Nilgiris, Tamil Nadu",
    category: "Natural Products",
  },
  {
    id: 4,
    user: { name: "Kaveri Rice Mills", handle: "@kaveri_rice", avatar: "🌾", verified: true },
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
    caption: "🍚 Traditional Seeraga Samba rice – the king of Tamil Nadu biryani! Stone-milled and hand-sorted. Our heritage variety is grown by farmers who have cultivated the Kaveri delta for generations. Taste the difference 🤤",
    tags: ["#SeeragaSamba", "#BiryaniRice", "#KaveriDelta", "#HeirloomGrain"],
    likes: 5861,
    comments: 392,
    timeAgo: "1 day ago",
    product: { name: "Seeraga Samba Rice 5kg", price: 649, mrp: 899 },
    location: "Thanjavur, Tamil Nadu",
    category: "Grains",
  },
  {
    id: 5,
    user: { name: "Coastal Coconut Farm", handle: "@coastal_coconut", avatar: "🥥", verified: false },
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    caption: "🥥 Cold-pressed virgin coconut oil from our coastal groves in Kanyakumari. Made in small batches, preserving all natural goodness. Perfect for cooking, hair and skincare! Subscribe for monthly delivery 🌊",
    tags: ["#VirginCoconutOil", "#Kanyakumari", "#ColdPressed", "#NaturalOil"],
    likes: 1893,
    comments: 127,
    timeAgo: "1 day ago",
    product: { name: "Virgin Coconut Oil 1L", price: 380, mrp: 580 },
    location: "Kanyakumari, Tamil Nadu",
    category: "Oils",
  },
  {
    id: 6,
    user: { name: "Mango Estate Alphonso", handle: "@mango_alphonso", avatar: "🥭", verified: true },
    image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&q=80",
    caption: "🥭 Pre-booking open for Alphonso mango season! Our Ratnagiri alphonsos are famous for their golden colour and rich sweetness. Harvest begins in April. Pre-book now at special prices! Only 200 crates left 🔥",
    tags: ["#AlphonsoMango", "#RatnagiMango", "#FruitLovers", "#PreBook"],
    likes: 7234,
    comments: 541,
    timeAgo: "2 days ago",
    product: { name: "Alphonso Mango Box 2.5kg (Pre-book)", price: 799, mrp: 1200 },
    location: "Ratnagiri, Maharashtra",
    category: "Fruits",
  },
];

const CATEGORIES = ["All", "Spices", "Vegetables", "Grains", "Natural Products", "Oils", "Fruits"];

const AgriFeedPage = ({ onNavigate, onAddToCart }) => {
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});
  const [likes, setLikes] = useState({});
  const [activeCategory, setActiveCategory] = useState("All");

  const toggleLike = (id, base) => {
    const isLiked = liked[id];
    setLiked(l => ({ ...l, [id]: !isLiked }));
    setLikes(l => ({ ...l, [id]: isLiked ? base - 1 : base + 1 }));
  };

  const filtered = FEED_POSTS.filter(p => activeCategory === "All" || p.category === activeCategory);

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#fafafa', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        .af-post { background: #fff; border-radius: 16px; border: 1px solid #f0f0f0; margin-bottom: 24px; overflow: hidden; }
        .af-action-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; color: #555; font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600; padding: 6px 4px; transition: color 0.18s; }
        .af-action-btn:hover { color: #FF6B00; }
        .af-pill { background: none; border: 1.5px solid #e0e0e0; border-radius: 50px; padding: 6px 16px; font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; color: #555; transition: all 0.18s; white-space: nowrap; }
        .af-pill:hover { border-color: #1a7a2e; color: #1a7a2e; }
        .af-pill.active { background: #1a7a2e; border-color: #1a7a2e; color: #fff; }
        .af-shop-btn { background: #FF6B00; border: none; border-radius: 10px; padding: 10px 18px; color: #fff; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 7px; transition: background 0.18s; }
        .af-shop-btn:hover { background: #e55d00; }
      `}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1a7a2e 0%, #0d5c1f 100%)', padding: '28px 20px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 50, padding: '5px 16px', marginBottom: 14 }}>
          <Leaf size={14} color="#fff" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Agri Feed</span>
        </div>
        <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.9rem', marginBottom: 6, letterSpacing: '-0.5px' }}>From Farm to Your Table</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 22 }}>Discover fresh produce, organic goods & farm stories</p>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 28 }}>
          {[{ icon: '🌾', val: '2,400+', label: 'Farmers' }, { icon: '📦', val: '8,000+', label: 'Products' }, { icon: '⭐', val: '4.8', label: 'Avg Rating' }].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, marginBottom: 2 }}>{s.icon}</div>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>{s.val}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 620, margin: '0 auto', padding: '24px 16px' }}>
        {/* Category filter */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 20, scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} className={`af-pill ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
              {cat === 'Vegetables' ? '🥗' : cat === 'Spices' ? '🌿' : cat === 'Fruits' ? '🍎' : cat === 'Grains' ? '🌾' : cat === 'Oils' ? '🫙' : cat === 'Natural Products' ? '🍯' : '🛒'} {cat}
            </button>
          ))}
        </div>

        {/* Feed */}
        {filtered.map(post => {
          const isLiked = liked[post.id];
          const isSaved = saved[post.id];
          const likeCount = likes[post.id] !== undefined ? likes[post.id] : post.likes;
          const discount = Math.round(((post.product.mrp - post.product.price) / post.product.mrp) * 100);

          return (
            <div key={post.id} className="af-post">
              {/* Post header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, border: '2px solid #1a7a2e' }}>
                    {post.user.avatar}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontWeight: 800, fontSize: 14, color: '#1a1a1a' }}>{post.user.name}</span>
                      {post.user.verified && <span title="Verified" style={{ fontSize: 14 }}>✅</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
                      <MapPin size={11} color="#1a7a2e" />
                      <span style={{ fontSize: 11, color: '#888' }}>{post.location}</span>
                      <span style={{ fontSize: 11, color: '#bbb' }}>· {post.timeAgo}</span>
                    </div>
                  </div>
                </div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
                  <MoreHorizontal size={20} />
                </button>
              </div>

              {/* Image */}
              <div style={{ position: 'relative' }}>
                <img src={post.image} alt={post.caption} style={{ width: '100%', height: 380, objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(26,122,46,0.9)', borderRadius: 8, padding: '3px 10px', backdropFilter: 'blur(4px)' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>🌿 {post.category}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  <button className="af-action-btn" onClick={() => toggleLike(post.id, post.likes)}>
                    <Heart size={22} color={isLiked ? '#ff3b5c' : '#555'} fill={isLiked ? '#ff3b5c' : 'none'} />
                    <span style={{ color: isLiked ? '#ff3b5c' : '#555' }}>{likeCount.toLocaleString()}</span>
                  </button>
                  <button className="af-action-btn">
                    <MessageCircle size={22} />
                    {post.comments}
                  </button>
                  <button className="af-action-btn">
                    <Share2 size={22} />
                  </button>
                </div>
                <button className="af-action-btn" onClick={() => setSaved(s => ({ ...s, [post.id]: !isSaved }))}>
                  <Bookmark size={22} color={isSaved ? '#FF6B00' : '#555'} fill={isSaved ? '#FF6B00' : 'none'} />
                </button>
              </div>

              {/* Caption */}
              <div style={{ padding: '0 16px 14px' }}>
                <p style={{ fontSize: 13.5, color: '#333', lineHeight: 1.7, marginBottom: 8 }}>
                  <strong>{post.user.handle}</strong> {post.caption}
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  {post.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 12, color: '#1a7a2e', fontWeight: 600, cursor: 'pointer' }}>{tag}</span>
                  ))}
                </div>

                {/* Product card in feed */}
                <div style={{ background: '#fafafa', border: '1.5px solid #e8f5e9', borderRadius: 12, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <TrendingUp size={12} color="#1a7a2e" />
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#1a7a2e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Shoppable</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: '#1a1a1a', marginBottom: 4 }}>{post.product.name}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                      <span style={{ fontWeight: 800, color: '#FF6B00', fontSize: 17 }}>₹{post.product.price}</span>
                      <span style={{ fontSize: 12, color: '#bbb', textDecoration: 'line-through' }}>₹{post.product.mrp}</span>
                      <span style={{ background: '#1a7a2e', color: '#fff', borderRadius: 5, padding: '1px 6px', fontSize: 10, fontWeight: 800 }}>{discount}% off</span>
                    </div>
                  </div>
                  <button className="af-shop-btn" onClick={() => onAddToCart && onAddToCart({ name: post.product.name, price: post.product.price, _id: post.id })}>
                    <ShoppingBag size={15} /> Buy Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* End of feed */}
        <div style={{ textAlign: 'center', padding: '24px 0 16px', color: '#bbb', fontWeight: 600, fontSize: 13 }}>
          🌾 You've seen all posts · More coming soon
        </div>
      </div>
    </div>
  );
};

export default AgriFeedPage;