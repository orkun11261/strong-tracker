import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm font-medium">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-indigo-400">Strong Tracker</span>
          </div>
          <div className="flex items-center space-x-6">
            {user && (
              <span className="text-sm text-slate-300">
                Hoş geldin, <strong className="text-white font-semibold">{user.name}</strong>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition duration-150 cursor-pointer"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Genel Bakış</h1>
          <p className="text-sm text-slate-400 mt-1">Gelişimini takip et ve antrenmanlarını yönet.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/50 transition duration-150 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Programlarım</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Antrenman rutinlerini planla, egzersizlerini ve hedef set/tekrar sayılarını düzenle.
              </p>
            </div>
            <button className="mt-6 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition duration-150 text-left cursor-pointer">
              Programları Yönet &rarr;
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/50 transition duration-150 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Antrenman Geçmişi</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Daha önce tamamladığın antrenmanları, kaldırdığın ağırlıkları ve set detaylarını incele.
              </p>
            </div>
            <button className="mt-6 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition duration-150 text-left cursor-pointer">
              Geçmişi Görüntüle &rarr;
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/50 transition duration-150 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Vücut Ölçümleri</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Kilonu, yağ oranını ve kol, bel, göğüs gibi bölgesel ölçümlerini kaydederek gelişimini gör.
              </p>
            </div>
            <button className="mt-6 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition duration-150 text-left cursor-pointer">
              Ölçümleri Takip Et &rarr;
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
