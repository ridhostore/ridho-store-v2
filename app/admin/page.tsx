/* FILE: app/admin/page.tsx */
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// --- KONFIGURASI (ISI DATA KAMU DI SINI) ---
const SUPABASE_URL = "https://qjvngwskulphqcuphmrm.supabase.co"; // Ganti URL kamu
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqdm5nd3NrdWxwaHFjdXBobXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMDE3NDIsImV4cCI6MjA4NDY3Nzc0Mn0.Oo8smm85Yd6H2fvzl2t8wIVDPkInzb4BdWa5p_skrVo"; // Ganti KEY PANJANG kamu
const PIN_RAHASIA = "555666"; // Password buat masuk halaman admin

// Buat koneksi Supabase khusus halaman ini
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [pin, setPin] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // State untuk form edit
  const [editForm, setEditForm] = useState({ name: "", price: 0, desc: "" });

  // 1. Cek Login
  const handleLogin = (e: any) => {
    e.preventDefault();
    if (pin === PIN_RAHASIA) {
      setIsAuth(true);
      fetchData();
    } else {
      alert("PIN SALAH BOS! 😡");
    }
  };

  // 2. Ambil Data
  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("services").select("*").order("id", { ascending: true });
    if (error) alert("Error ambil data: " + error.message);
    else setServices(data || []);
    setLoading(false);
  };

  // 3. Mulai Edit
  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditForm({ name: item.name, price: item.price, desc: item.desc });
  };

  // 4. Simpan Perubahan
  const saveEdit = async (id: number) => {
    const { error } = await supabase
      .from("services")
      .update({ name: editForm.name, price: editForm.price, desc: editForm.desc })
      .eq("id", id);

    if (error) {
      alert("Gagal simpan: " + error.message);
    } else {
      setEditingId(null);
      fetchData(); // Refresh data
      alert("✅ Data Berhasil Diupdate!");
    }
  };

  // 5. Tambah Produk Baru (Opsional)
  const addNew = async () => {
    const name = prompt("Nama Layanan:");
    if(!name) return;
    const cat = prompt("Kategori (instagram/tiktok/shopee):");
    const price = prompt("Harga:");
    
    if (name && cat && price) {
        const { error } = await supabase.from("services").insert({
            name, category: cat.toLowerCase(), price: parseInt(price), desc: "Layanan baru"
        });
        if(!error) { fetchData(); alert("✅ Layanan ditambahkan!"); }
    }
  }

  // 6. Hapus Produk
  const deleteItem = async (id: number) => {
      if(confirm("Yakin mau hapus layanan ini?")) {
          const { error } = await supabase.from("services").delete().eq("id", id);
          if(!error) fetchData();
      }
  }

  // --- TAMPILAN LOGIN (LOCK SCREEN) ---
  if (!isAuth) {
    return (
      <div style={{ height: "100vh", background: "#121212", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "white" }}>
        <h2 style={{ marginBottom: "20px", color: "#FFD700" }}>🔒 RESTRICTED AREA</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="password"
            placeholder="Masukkan PIN Admin"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={{ padding: "10px", borderRadius: "5px", border: "1px solid #333", background: "#222", color: "white", textAlign: "center", fontSize: "1.2rem" }}
          />
          <button type="submit" style={{ padding: "10px", background: "#25d366", border: "none", borderRadius: "5px", color: "white", fontWeight: "bold", cursor: "pointer" }}>MASUK</button>
        </form>
      </div>
    );
  }

  // --- TAMPILAN DASHBOARD (SETELAH LOGIN) ---
  return (
    <div style={{ padding: "20px", background: "#121212", minHeight: "100vh", color: "white", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ color: "#FFD700", margin: 0 }}>⚙️ Admin Panel</h3>
        <button onClick={addNew} style={{ padding: "8px 15px", background: "#3b82f6", border: "none", borderRadius: "5px", color: "white" }}>+ Tambah</button>
      </div>

      {loading ? <p>Loading data...</p> : (
        <div style={{ display: "grid", gap: "15px", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {services.map((item) => (
            <div key={item.id} style={{ background: "#1e1e1e", padding: "15px", borderRadius: "10px", border: "1px solid #333" }}>
              
              {/* JIKA SEDANG EDIT */}
              {editingId === item.id ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <label style={{fontSize: "0.8rem", color: "#888"}}>Nama:</label>
                  <input 
                    value={editForm.name} 
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    style={{ padding: "8px", background: "#333", border: "none", color: "white", borderRadius: "4px" }} 
                  />
                  <label style={{fontSize: "0.8rem", color: "#888"}}>Harga (Angka saja):</label>
                  <input 
                    type="number" 
                    value={editForm.price} 
                    onChange={e => setEditForm({...editForm, price: parseInt(e.target.value)})}
                    style={{ padding: "8px", background: "#333", border: "none", color: "white", borderRadius: "4px" }} 
                  />
                  <label style={{fontSize: "0.8rem", color: "#888"}}>Deskripsi:</label>
                  <textarea 
                    value={editForm.desc} 
                    onChange={e => setEditForm({...editForm, desc: e.target.value})}
                    style={{ padding: "8px", background: "#333", border: "none", color: "white", borderRadius: "4px" }} 
                  />
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button onClick={() => saveEdit(item.id)} style={{ flex: 1, padding: "8px", background: "#25d366", border: "none", color: "white", borderRadius: "4px" }}>💾 Simpan</button>
                    <button onClick={() => setEditingId(null)} style={{ flex: 1, padding: "8px", background: "#666", border: "none", color: "white", borderRadius: "4px" }}>Batal</button>
                  </div>
                </div>
              ) : (
                /* JIKA TAMPILAN BIASA */
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "0.8rem", background: "#333", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase" }}>{item.category}</span>
                    <span style={{ fontWeight: "bold", color: "#FFD700" }}>Rp {item.price.toLocaleString()}</span>
                  </div>
                  <h4 style={{ margin: "10px 0", fontSize: "1rem" }}>{item.name}</h4>
                  <p style={{ fontSize: "0.85rem", color: "#aaa", marginBottom: "15px" }}>{item.desc}</p>
                  
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => startEdit(item)} style={{ flex: 1, padding: "8px", background: "#eab308", border: "none", color: "black", borderRadius: "4px", fontWeight: "bold" }}>✏️ Edit</button>
                    <button onClick={() => deleteItem(item.id)} style={{ padding: "8px 12px", background: "#ef4444", border: "none", color: "white", borderRadius: "4px" }}>🗑️</button>
                  </div>
                </>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}