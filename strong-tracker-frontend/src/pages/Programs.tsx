import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Exercise {
  name: string;
  targetSets: number;
  targetReps: number;
  notes: string;
}

interface Program {
  _id: string;
  title: string;
  exercises: Exercise[];
}

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [title, setTitle] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([
    { name: '', targetSets: 3, targetReps: 10, notes: '' }
  ]);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();

  const fetchPrograms = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/programs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPrograms(res.data);
    } catch (err) {
      console.error(err);
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [navigate]);

  const handleAddExerciseField = () => {
    setExercises([...exercises, { name: '', targetSets: 3, targetReps: 10, notes: '' }]);
  };

  const handleRemoveExerciseField = (index: number) => {
    if (exercises.length === 1) return;
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (index: number, field: keyof Exercise, value: any) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const token = localStorage.getItem('token');
    if (!token) return;

    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Program başlığı zorunludur.' });
      return;
    }

    const hasEmptyExercise = exercises.some(ex => !ex.name.trim());
    if (hasEmptyExercise) {
      setMessage({ type: 'error', text: 'Tüm egzersizlerin isimlerini doldurmalısınız.' });
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/programs',
        { title, exercises },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage({ type: 'success', text: 'Program başarıyla oluşturuldu.' });
      setTitle('');
      setExercises([{ name: '', targetSets: 3, targetReps: 10, notes: '' }]);
      setShowAddForm(false);
      fetchPrograms();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Program oluşturulurken hata oluştu.';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  const handleDeleteProgram = async (id: string) => {
    const confirmDelete = window.confirm('Bu programı silmek istediğinize emin misiniz?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/programs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPrograms(programs.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert('Program silinirken bir hata oluştu.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm font-medium">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12">
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <span className="text-xl font-bold tracking-tight text-indigo-400">Strong Tracker</span>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition duration-150 cursor-pointer"
          >
            Anasayfaya Dön
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 mt-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Programlarım</h1>
            <p className="text-sm text-slate-400 mt-1">Antrenman rutinlerinizi yönetin.</p>
          </div>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setMessage(null);
            }}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-md transition duration-150 cursor-pointer"
          >
            {showAddForm ? 'Formu Kapat' : 'Yeni Program Ekle'}
          </button>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-xs font-semibold mb-6 text-center ${
              message.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {message.text}
          </div>
        )}

        {showAddForm && (
          <form onSubmit={handleCreateProgram} className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold text-white mb-4">Yeni Program Oluştur</h2>
            
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Program Adı</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn. Push Day, Üst Vücut, Leg Day"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold uppercase text-slate-400">Egzersizler</label>
                <button
                  type="button"
                  onClick={handleAddExerciseField}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  + Egzersiz Ekle
                </button>
              </div>

              {exercises.map((ex, index) => (
                <div key={index} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-semibold">#{index + 1} Egzersiz</span>
                    {exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveExerciseField(index)}
                        className="text-xs text-rose-400 hover:text-rose-300"
                      >
                        Kaldır
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-1">
                      <input
                        type="text"
                        value={ex.name}
                        onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                        placeholder="Egzersiz Adı"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={ex.targetSets}
                        onChange={(e) => handleExerciseChange(index, 'targetSets', parseInt(e.target.value) || 0)}
                        placeholder="Set Sayısı"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                        min="1"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={ex.targetReps}
                        onChange={(e) => handleExerciseChange(index, 'targetReps', parseInt(e.target.value) || 0)}
                        placeholder="Tekrar Sayısı"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-xs text-white focus:outline-none focus:border-indigo-500"
                        required
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={ex.notes}
                      onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
                      placeholder="Notlar (Opsiyonel)"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-md transition duration-150 cursor-pointer"
              >
                Programı Kaydet
              </button>
            </div>
          </form>
        )}

        {programs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
            Henüz eklenmiş bir antrenman programı bulunmuyor. Yeni bir tane ekleyerek başlayın.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {programs.map((program) => (
              <div key={program._id} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">{program.title}</h3>
                  <button
                    onClick={() => handleDeleteProgram(program._id)}
                    className="text-xs font-semibold text-rose-400 hover:text-rose-300 cursor-pointer"
                  >
                    Programı Sil
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2.5 font-semibold">Egzersiz</th>
                        <th className="py-2.5 font-semibold">Set</th>
                        <th className="py-2.5 font-semibold">Tekrar</th>
                        <th className="py-2.5 font-semibold text-right">Notlar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {program.exercises.map((ex, idx) => (
                        <tr key={idx} className="border-b border-slate-800/50 text-slate-300">
                          <td className="py-2.5 font-medium">{ex.name}</td>
                          <td className="py-2.5">{ex.targetSets}</td>
                          <td className="py-2.5">{ex.targetReps}</td>
                          <td className="py-2.5 text-right text-slate-500 italic max-w-xs truncate">{ex.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
