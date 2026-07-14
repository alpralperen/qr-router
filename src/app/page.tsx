"use client";

import { useState, useEffect } from "react";
import { Link, Pencil, Trash2, Plus, ExternalLink, QrCode } from "lucide-react";

type RouterQr = {
  id: string;
  slug: string;
  targetUrl: string;
  name: string | null;
  createdAt: string;
};

export default function AdminPage() {
  const [routers, setRouters] = useState<RouterQr[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ id: "", slug: "", targetUrl: "", name: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchRouters();
  }, []);

  const fetchRouters = async () => {
    try {
      const res = await fetch("/api/routers");
      if (res.ok) {
        const data = await res.json();
        setRouters(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const openAddModal = () => {
    setFormData({ id: "", slug: "", targetUrl: "", name: "" });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (router: RouterQr) => {
    setFormData({ 
      id: router.id, 
      slug: router.slug, 
      targetUrl: router.targetUrl, 
      name: router.name || "" 
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing ? `/api/routers/${formData.id}` : "/api/routers";
      const method = isEditing ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchRouters();
      } else {
        const data = await res.json();
        alert(data.error || "Bir hata oluştu");
      }
    } catch (e) {
      alert("İşlem başarısız.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/routers/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchRouters();
      } else {
        alert("Silinemedi.");
      }
    } catch (e) {
      alert("Hata oluştu.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-xl text-white shadow-lg shadow-blue-200">
              <QrCode size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">QR Yönlendirici</h1>
              <p className="text-sm text-gray-500 font-medium">Demolar için dinamik QR yönetimi</p>
            </div>
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl transition-all shadow-md font-medium"
          >
            <Plus size={20} />
            Yeni Yönlendirme Ekle
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600"></div>
          </div>
        ) : routers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
            <QrCode size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Henüz Yönlendirme Yok</h3>
            <p className="text-gray-500 mb-6">Demolarınız için ilk QR yönlendiricinizi oluşturun.</p>
            <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-all font-medium inline-flex items-center gap-2">
              <Plus size={18} />
              Oluştur
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routers.map((router) => (
              <div key={router.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">{router.name || router.slug}</h2>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md font-mono">{router.slug}</span>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wider">Hedef URL</p>
                    <a href={router.targetUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1.5 break-all">
                      {router.targetUrl.replace(/^https?:\/\//, '')}
                      <ExternalLink size={14} />
                    </a>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                    <div className="text-xs text-gray-400 font-medium">
                      Oluşturulma: {new Date(router.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(router)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(router.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-500 font-mono">/r/{router.slug}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">{isEditing ? "Yönlendirme Düzenle" : "Yeni Yönlendirme Ekle"}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanım (Örn: Starbucks Kadıköy Demo)</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Cafe adı veya demo amacı"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">QR Slug (Zorunlu)</label>
                  <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                    <span className="bg-gray-50 text-gray-500 px-3 py-2.5 border-r border-gray-200 text-sm flex items-center">/r/</span>
                    <input 
                      type="text" 
                      required
                      value={formData.slug} 
                      onChange={e => setFormData({...formData, slug: e.target.value})}
                      className="w-full px-3 py-2.5 focus:outline-none text-sm font-mono"
                      placeholder="demo1"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">Fiziksel QR kodunuzda yer alan ID.</p>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Hedef URL (Zorunlu)</label>
                  <input 
                    type="url" 
                    required
                    value={formData.targetUrl} 
                    onChange={e => setFormData({...formData, targetUrl: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="https://loyalty-demo-vercel.app"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    İptal
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-md shadow-blue-200"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
