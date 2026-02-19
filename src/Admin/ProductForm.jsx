import React, { useState } from "react";
import api from "../Services/Api";

const ProductForm = ({ product, onClose, onSuccess }) => {
  // We always show the BASE (original) price in the form input
  const basePrice = product?.originalPrice || product?.price || "";
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category || "",
    description: product?.description || "",
    price: basePrice,
    quantity: product?.quantity || "",
    discount: product?.discount || 0,
    images: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Derived live preview
  const rawPrice = parseFloat(formData.price) || 0;
  const discountPct = parseFloat(formData.discount) || 0;
  const discountedPrice =
    discountPct > 0
      ? (rawPrice * (1 - discountPct / 100)).toFixed(2)
      : null;
  const savedAmount =
    discountPct > 0 ? (rawPrice - rawPrice * (1 - discountPct / 100)).toFixed(2) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("category", formData.category);
      form.append("description", formData.description);
      form.append("price", formData.price);       // base price goes to backend
      form.append("quantity", formData.quantity);
      form.append("discount", formData.discount);

      if (formData.images) {
        for (let img of formData.images) {
          form.append("images", img);
        }
      }

      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      let result;
      if (product?._id) {
        result = await api.updateProduct(product._id, form, token);
      } else {
        result = await api.createProduct(form, token);
      }

      if (result.error) {
        setError(result.error);
      } else {
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      setError("Failed to save product",err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Header */}
          <div
            className="modal-header border-0 px-4 pt-4 pb-2"
            style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}
          >
            <div>
              <h5 className="modal-title text-white fw-bold mb-1">
                {product?._id ? "✏️ Edit Product" : "➕ Add New Product"}
              </h5>
              <p className="text-white-50 small mb-0">
                {product?._id
                  ? "Update product details and pricing"
                  : "Fill in details to list a new product"}
              </p>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            />
          </div>

          <div className="modal-body px-4 py-3">
            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* Name */}
                <div className="col-12">
                  <label className="form-label fw-semibold small text-muted text-uppercase tracking-wide">
                    Product Name
                  </label>
                  <input
                    className="form-control border-0 bg-light rounded-3"
                    placeholder="e.g. Nike Air Max 270"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {/* Category */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted text-uppercase">
                    Category
                  </label>
                  <input
                    className="form-control border-0 bg-light rounded-3"
                    placeholder="e.g. Footwear"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>

                {/* Quantity */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted text-uppercase">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    className="form-control border-0 bg-light rounded-3"
                    placeholder="e.g. 100"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    min="0"
                  />
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label fw-semibold small text-muted text-uppercase">
                    Description
                  </label>
                  <textarea
                    className="form-control border-0 bg-light rounded-3"
                    placeholder="Describe the product..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows="3"
                  />
                </div>

                {/* Price + Discount */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted text-uppercase">
                    Base / Market Price ($)
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0 rounded-start-3 fw-bold text-success">
                      $
                    </span>
                    <input
                      type="number"
                      className="form-control border-0 bg-light"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <p className="text-muted small mt-1 mb-0">
                    This is the original (MRP) price
                  </p>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-muted text-uppercase">
                    Discount (%)
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control border-0 bg-light"
                      placeholder="0"
                      value={formData.discount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount: Math.min(100, Math.max(0, Number(e.target.value))),
                        })
                      }
                      min="0"
                      max="100"
                      step="0.5"
                    />
                    <span className="input-group-text bg-light border-0 rounded-end-3 fw-bold text-danger">
                      %
                    </span>
                  </div>
                  <p className="text-muted small mt-1 mb-0">
                    Daily market discount percentage
                  </p>
                </div>

                {/* Live Price Preview */}
                {rawPrice > 0 && (
                  <div className="col-12">
                    <div
                      className="rounded-3 p-3 d-flex align-items-center gap-4 flex-wrap"
                      style={{
                        background:
                          discountPct > 0
                            ? "linear-gradient(135deg, #fff8e1 0%, #fff3cd 100%)"
                            : "#f8f9fa",
                        border: "1.5px dashed #ffc107",
                      }}
                    >
                      <div>
                        <p className="text-muted small mb-1 fw-semibold">PREVIEW</p>
                        {discountPct > 0 ? (
                          <div className="d-flex align-items-baseline gap-2 flex-wrap">
                            <span
                              className="fw-bold"
                              style={{ fontSize: "1.5rem", color: "#B12704" }}
                            >
                              ${discountedPrice}
                            </span>
                            <span
                              className="text-muted text-decoration-line-through"
                              style={{ fontSize: "1rem" }}
                            >
                              ${rawPrice.toFixed(2)}
                            </span>
                            <span
                              className="badge px-2 py-1 fw-bold"
                              style={{
                                background: "#cc0c39",
                                color: "#fff",
                                fontSize: "0.75rem",
                              }}
                            >
                              -{discountPct}% OFF
                            </span>
                          </div>
                        ) : (
                          <span
                            className="fw-bold text-dark"
                            style={{ fontSize: "1.4rem" }}
                          >
                            ${rawPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {discountPct > 0 && savedAmount && (
                        <div
                          className="ms-auto rounded-3 px-3 py-2 text-center"
                          style={{ background: "#e6f4ea" }}
                        >
                          <p className="mb-0 small text-success fw-bold">
                            Customer Saves
                          </p>
                          <p className="mb-0 fw-bold text-success" style={{ fontSize: "1.1rem" }}>
                            ${savedAmount}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Images */}
                <div className="col-12">
                  <label className="form-label fw-semibold small text-muted text-uppercase">
                    Product Images
                  </label>
                  <input
                    type="file"
                    multiple
                    className="form-control border-0 bg-light rounded-3"
                    onChange={(e) => setFormData({ ...formData, images: e.target.files })}
                    accept="image/*"
                  />
                  <p className="text-muted small mt-1 mb-0">Up to 5 images. Leave empty to keep existing.</p>
                </div>
              </div>

              {/* Actions */}
              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-light px-4 rounded-pill"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn px-4 rounded-pill fw-bold text-dark"
                  style={{
                    background: "linear-gradient(135deg, #ffc107, #ff9800)",
                    border: "none",
                    minWidth: "120px",
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      />
                      Saving...
                    </>
                  ) : (
                    `${product?._id ? "Update" : "Add"} Product`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;