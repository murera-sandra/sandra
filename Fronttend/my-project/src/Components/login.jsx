import { useState } from "react";
import axios from "axios";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Extra field for registration
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Determine the endpoint based on mode
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin ? { email, password } : { username, email, password };

    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, payload);

      // Save token (JWT)
      localStorage.setItem("token", res.data.token);

      alert(`${isLogin ? "Login" : "Registration"} successful 🎉`);
    } catch (err) {
      setError(err.response?.data?.message || "please register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Register"}</h2>

        {error && <p className="error" style={{ color: 'red' }}>{error}</p>}

        {/* Show Username field only if Registering */}
        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : isLogin ? "Login" : "Register"}
        </button>

        <p style={{ marginTop: "10px", cursor: "pointer" }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need an account? Register here." : "Already have an account? Login here."}
        </p>
      </form>
    </div>
  );
};

export default Auth;