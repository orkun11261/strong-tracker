import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const API_URL = 'http://localhost:5000/api/auth';

    try {
      if (isLogin) {
        const res = await axios.post(`${API_URL}/login`, {
          email: formData.email,
          password: formData.password,
        });

        setMessage({ type: 'success', text: 'Giriş başarılı! Yönlendiriliyorsunuz...' });
        console.log('Giriş Yanıtı:', res.data);
        
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }

        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        const res = await axios.post(`${API_URL}/register`, {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        });

        setMessage({ type: 'success', text: 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.' });
        console.log('Kayıt Yanıtı:', res.data);
        setIsLogin(true);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#161f30] border border-slate-800 rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Strong Tracker</h1>
          <p className="text-sm text-slate-400">
            {isLogin ? 'Hesabınıza giriş yapın' : 'Yeni bir hesap oluşturun'}
          </p>
        </div>

        {message && (
          <div
            className={`p-3 rounded-md text-xs font-semibold mb-4 text-center ${
              message.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs text-slate-300 font-semibold mb-1">
                Ad Soyad
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Ahmet Yılmaz"
                required
                className="w-full px-3 py-2 bg-[#e8f0fe] text-slate-900 rounded-md outline-none text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-slate-300 font-semibold mb-1">
              E-posta
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@strongtracker.com"
              required
              className="w-full px-3 py-2 bg-[#e8f0fe] text-slate-900 rounded-md outline-none text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 font-semibold mb-1">
              Şifre
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 bg-[#e8f0fe] text-slate-900 rounded-md outline-none text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md transition duration-200 text-sm shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? 'İşleniyor...' : isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          {isLogin ? (
            <p>
              Hesabınız yok mu?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setMessage(null);
                }}
                className="text-indigo-400 hover:underline font-semibold ml-1 cursor-pointer bg-transparent border-none"
              >
                Kayıt Ol
              </button>
            </p>
          ) : (
            <p>
              Zaten hesabınız var mı?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setMessage(null);
                }}
                className="text-indigo-400 hover:underline font-semibold ml-1 cursor-pointer bg-transparent border-none"
              >
                Giriş Yap
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}