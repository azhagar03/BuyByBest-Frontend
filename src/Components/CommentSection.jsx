const CommentSection = ({ reviewId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const { token, user, isAuthenticated } = useAuth();
  const showToast = useToast();

  useEffect(() => {
    loadComments();
  }, [reviewId]);

  const loadComments = async () => {
    try {
      const data = await api.fetchComments(reviewId);
      setComments(data);
    } catch (error) {
      showToast("Failed to load comments", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await api.register(form);
      if (data.token) {
        login(data.token, data.user);
        showToast("Registration successful!", "success");
        setCurrentPage({ name: "home" });
      } else {
        showToast(data.message || "Registration failed", "error");
      }
    } catch (error) {
      showToast("Registration failed", "error");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div className="card shadow-lg w-100" style={{ maxWidth: "420px" }}>
        <div className="card-body p-4 p-md-5">
          <h2 className="text-center fw-bold mb-4">
            Create Account
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                className="form-control form-control-lg"
                placeholder="johndoe"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="form-control form-control-lg"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="form-control form-control-lg"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary btn-lg w-100"
            >
              Sign Up
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-muted mt-4 mb-0">
            Already have an account?{" "}
            <button
              onClick={() => setCurrentPage({ name: "login" })}
              className="btn btn-link p-0 fw-semibold text-decoration-none"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
export default CommentSection