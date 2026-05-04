const API_BASE = 'https://buybybest-back-end.onrender.com/api';

const api = {
  // Product APIs
  async fetchProducts(search = '', category = '') {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    const res = await fetch(`${API_BASE}/products?${params}`);
    return res.json();
  },


  async fetchProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);    
    return res.json();
  },

  async getCart(token) {
  const res = await fetch(`${API_BASE}/cart`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
},

async addToCart(productId, quantity, token) {
  const res = await fetch(`${API_BASE}/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ productId, quantity })
  });
  return res.json();
},

  // Review APIs
  async fetchReviews(productId) {
    const res = await fetch(`${API_BASE}/reviews/${productId}`);
    return res.json();
  },

  
  async createReview(data, token) {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async likeReview(reviewId, token) {
    const res = await fetch(`${API_BASE}/reviews/${reviewId}/like`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  // Comment APIs
  async fetchComments(reviewId) {
    const res = await fetch(`${API_BASE}/reviews/${reviewId}/comments`);
    return res.json();
  },

  async createComment(reviewId, comment, token) {
    const res = await fetch(`${API_BASE}/reviews/${reviewId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ comment })
    });
    return res.json();
  },

  async deleteComment(commentId, token) {
    const res = await fetch(`${API_BASE}/reviews/comments/${commentId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  // Auth APIs
  async login(data) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Admin APIs
async adminLogin(data) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
},

async verifyAdminToken(token) {
  const res = await fetch(`${API_BASE}/admin/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
},


  // Admin Product Management
  async createProduct(formData, token) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    return res.json();
  },

  async updateProduct(id, formData, token) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    return res.json();
  },

  async deleteProduct(id, token) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  }
};

export default api;