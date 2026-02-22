import React, { useState } from "react";
import "./Login.css";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await axios.post("/login", {
        username: email,
        password: password,
      });

      navigate("/admin/facilitators");
    } catch (err) {
      setError("Kullanıcı adı veya şifre hatalı");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* SOL TARAF - LOGIN */}
        <div className="sign-in">
          <h2>Admin Girişi</h2>
          <p className="hint">Hoşgeldiniz!</p>

          <input
            type="text"
            placeholder="Kullanıcı Adı / Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="error-text">{error}</div>}

          <button
            className="btn primary"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "GİRİŞ YAPILIYOR..." : "GİRİŞ YAP"}
          </button>
        </div>

        {/* SAĞ TARAF - BİLGİLENDİRME */}
        <div className="sign-up">
          <h2>DEVTV</h2>
          <p>
            Bu panel yalnızca yetkili <br />
            yöneticiler için tasarlanmıştır. <br />
            <br />
            Lütfen size verilen bilgilerle giriş yapınız.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;