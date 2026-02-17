import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // Switcher state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin
      ? { usernameOrEmail: email, password }
      : { username, email, password };

    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, payload);
      const token = res.data?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
      }
      alert(isLogin ? "Login successful 🎉" : "Registration successful 🎉");

      // After a successful auth (login or register), send the user to the dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "PLEASE REGISTER");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>{isLogin ? "Login" : "Create Account"}</h2>
      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        )}

        <div className="input-group">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
        </button>
      </form>

      <p style={{ marginTop: "20px", fontSize: "0.9rem" }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span 
          style={{ color: "var(--primary-color)", cursor: "pointer", fontWeight: "bold" }} 
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Register here" : "Login here"}
        </span>
      </p>
    </div>
  );
};

export default Login;