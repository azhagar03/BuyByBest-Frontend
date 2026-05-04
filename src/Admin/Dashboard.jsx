import React, { useState, useEffect } from "react";
import ProductForm from "./ProductForm";
import api from "../Services/Api";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await api.deleteProduct(id, token);
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
     toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Products Management</h2>
        <button className="btn btn-success fw-bold px-4 rounded-pill" onClick={handleAdd}>
          + Add Product
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive rounded-3 shadow-sm">
          <table className="table table-hover mb-0 align-middle">
            <thead style={{ background: "#1a1a2e", color: "#fff" }}>
              <tr>
                <th className="px-3 py-3">Image</th>
                <th className="py-3">Name</th>
                <th className="py-3">Category</th>
                <th className="py-3">Base Price</th>
                <th className="py-3">Discount</th>
                <th className="py-3">Sale Price</th>
                <th className="py-3">Stock</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    No products found
                  </td>
                </tr>
              ) : (
                products?.map((product) => {
                  const hasDiscount = product.discount > 0;
                  return (
                    <tr key={product._id}>
                      <td className="px-3">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            style={{
                              width: 52,
                              height: 52,
                              objectFit: "cover",
                              borderRadius: 8,
                            }}
                          />
                        ) : (
                          <div
                            className="d-flex align-items-center justify-content-center bg-light rounded"
                            style={{ width: 52, height: 52, fontSize: "1.5rem" }}
                          >
                            📦
                          </div>
                        )}
                      </td>
                      <td className="fw-semibold">{product.name}</td>
                      <td>
                        <span className="badge bg-secondary rounded-pill">
                          {product.category}
                        </span>
                      </td>
                      <td className="text-muted">
                        {hasDiscount ? (
                          <span className="text-decoration-line-through">
                            ${Number(product.originalPrice).toFixed(2)}
                          </span>
                        ) : (
                          <span>${Number(product.price).toFixed(2)}</span>
                        )}
                      </td>
                      <td>
                        {hasDiscount ? (
                          <span
                            className="badge px-2 py-1"
                            style={{ background: "#cc0c39", color: "#fff" }}
                          >
                            -{product.discount}%
                          </span>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>
                      <td>
                        <span
                          className="fw-bold"
                          style={{ color: hasDiscount ? "#B12704" : "#333" }}
                        >
                          ${Number(product.price).toFixed(2)}
                        </span>
                      </td>
                      <td>
                        {product.stock === 0 ? (
                          <span className="badge bg-danger">Out of Stock</span>
                        ) : product.stock <= 10 ? (
                          <span className="badge bg-warning text-dark">
                            Low: {product.stock}
                          </span>
                        ) : (
                          <span className="badge bg-success">{product.stock}</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-success rounded-circle"
                            style={{ width: 34, height: 34 }}
                            title="Edit"
                            onClick={() => handleEdit(product)}
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger rounded-circle"
                            style={{ width: 34, height: 34 }}
                            title="Delete"
                            onClick={() => handleDelete(product._id)}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseForm}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
};

export default AdminDashboard;