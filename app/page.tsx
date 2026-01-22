"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

 // Helper function: Jembatan Cerdas antara React dan Script.js
  const callGlobal = (funcName: string, ...args: any[]) => {
    if (typeof window !== 'undefined') {
        const win = window as any;
        
        // 1. Coba split nama fungsi (misal: "RidhoStoreApp.openHistory")
        const parts = funcName.split('.');
        
        if (parts.length > 1) {
            // Jika formatnya "Objek.Fungsi"
            const obj = win[parts[0]];
            const method = parts[1];
            if (obj && typeof obj[method] === 'function') {
                obj[method](...args);
                return;
            }
        } 
        
        // 2. Coba panggil sebagai fungsi global biasa
        if (typeof win[funcName] === 'function') {
            win[funcName](...args);
        } else {
            console.warn(`⏳ Fungsi ${funcName} belum siap. Mencoba lagi...`);
            // Retry logic sederhana jika script belum load
            setTimeout(() => callGlobal(funcName, ...args), 500);
        }
    }
  };

  useEffect(() => {
    // Matikan loading screen
    const timer = setTimeout(() => setIsLoading(false), 2000);

    // RE-INITIALIZE ANIMASI SETELAH LOADING
    // Ini penting karena Next.js merender ulang halaman
    const initTimer = setTimeout(() => {
        if (typeof window !== 'undefined') {
            const win = window as any;
            // Panggil init manual jika ada
            if(win.RidhoStoreApp) win.RidhoStoreApp.init();
            if(win.AOS) win.AOS.init();
        }
    }, 2500);

    return () => { clearTimeout(timer); clearTimeout(initTimer); };
  }, []);

  return (
    <>
      {/* --- PRELOADER --- */}
      {isLoading && (
        <div id="preloader" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#000', zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}></div>
            <p className="mt-3 text-white letter-spacing-2 small fw-bold">MEMUAT TOKO...</p>
        </div>
      )}

      {/* --- STICKY BAR --- */}
      <div id="stickyBar" className="d-md-none" style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: 'rgba(20,20,20,0.95)', backdropFilter: 'blur(10px)', padding: '15px', borderTop: '1px solid rgba(255,215,0,0.3)', zIndex: 9999, display: 'none', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 -5px 20px rgba(0,0,0,0.5)' }}>
        <div>
          <small className="text-secondary d-block" style={{ fontSize: '0.7rem' }}>Total Bayar:</small>
          <span className="text-gold fw-bold" id="stickyTotal">Rp 0</span>
        </div>
        <div className="d-flex gap-2">
            <button onClick={() => document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-sm btn-gold fw-bold rounded-pill px-4">
            Lanjut Bayar <i className="bi bi-arrow-right ms-1"></i>
            </button>
            <button id="installAppBtn" className="btn btn-sm btn-outline-warning rounded-pill ms-2" style={{ display: 'none' }}>
                <i className="bi bi-download"></i> App
            </button>
        </div>
      </div>

      <div id="particles-js"></div>

      <div className="fake-notification" id="fakeNotif">
        <img src="https://ui-avatars.com/api/?name=User&background=random" className="notif-img" id="notifImg" alt="User" />
        <div className="notif-content">
          <h6 id="notifName">Budi dari Jakarta</h6>
          <p id="notifAction">Baru saja membeli 1000 Followers IG</p>
          <span className="notif-time">1 menit yang lalu</span>
        </div>
      </div>

      <a href="https://wa.me/6287879842395?text=Halo%20Admin%2C%20saya%20mau%20tanya%20tentang%20layanan%20Ridho%20Store..." className="float-wa" target="_blank">
        <i className="bi bi-whatsapp"></i>
      </a>

      <div className="mobile-top-bar">
        <a className="brand-logo text-decoration-none" href="#">RIDHO<span className="text-gold">STORE</span></a>
      </div>

      <nav className="navbar navbar-expand-lg navbar-desktop">
        <div className="container">
          <a className="brand-logo" href="#">RIDHO<span className="text-gold">STORE</span></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navContent">
            <ul className="navbar-nav ms-auto nav-links align-items-center">
              <li className="nav-item"><a className="nav-link active" href="#hero">Beranda</a></li>
              <li className="nav-item"><a className="nav-link" href="#how-to-order">Cara Order</a></li>
              <li className="nav-item"><a className="nav-link" href="#testimonials">Testimoni</a></li>
              <li className="nav-item"><a className="nav-link" href="#pricing">Harga</a></li>
              <li className="nav-item ms-3">
                <a href="#order" className="btn btn-custom btn-gold">ORDER SEKARANG</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="mobile-nav animate__animated animate__fadeInUp">
        <a href="#hero" className="mobile-nav-item active">
          <i className="bi bi-house-door-fill"></i>
          <span>Home</span>
        </a>
        <a href="#pricing" className="mobile-nav-item">
          <i className="bi bi-tags-fill"></i>
          <span>Harga</span>
        </a>
        <a href="#" className="mobile-nav-item affiliate-mobile-item" onClick={() => callGlobal('RidhoStoreApp.openReferral')}>
          <div className="icon-circle-glow">
            <i className="bi bi-gift-fill"></i>
          </div>
          <span className="text-gold fw-bold">Cuan</span>
        </a>
        <a href="#faq" className="mobile-nav-item">
          <i className="bi bi-question-circle-fill"></i>
          <span>Tanya</span>
        </a>
        <a href="#order" className="mobile-nav-item">
          <i className="bi bi-bag-check-fill"></i>
          <span>Order</span>
        </a>
      </div>

      <div className="flash-sale-banner">
        <div className="container">
          🔥 PROMO TERBATAS! Diskon 10% (Min 1k Followers) Berakhir dalam: 
          <span className="countdown-box ms-1" id="countdownTimer">00:00:00</span>
        </div>
      </div>

      <div className="server-status-container py-3">
        <div className="container">
          <div className="status-card-wrapper">
            <div className="d-flex align-items-center mb-3">
              <span className="status-indicator-pulse me-2"></span>
              <h6 className="text-white fw-bold mb-0 small letter-spacing-1">LIVE SERVER STATUS</h6>
              <small className="text-secondary ms-auto" style={{ fontSize: '0.65rem' }}>Updated: Just now</small>
            </div>
            <div className="row g-2">
              <div className="col-4">
                <div className="status-mini-card normal">
                  <i className="bi bi-instagram"></i>
                  <div className="status-info">
                    <span className="fw-bold">Instagram</span>
                    <small>🟢 Normal</small>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="status-mini-card delay">
                  <i className="bi bi-tiktok"></i>
                  <div className="status-info">
                    <span className="fw-bold">TikTok</span>
                    <small>🟢 Normal</small>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="status-mini-card flash">
                  <i className="bi bi-bag-fill"></i>
                  <div className="status-info">
                    <span className="fw-bold">Shopee</span>
                    <small>🟢 Normal</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="hero" className="hero-section">
        <div className="glow-orb"></div>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <div className="trust-badge-container animate__animated animate__fadeInDown">
                <div className="trust-badge"><i className="bi bi-shield-fill-check"></i> 100% Aman</div>
                <div className="trust-badge"><i className="bi bi-lightning-fill"></i> Proses Kilat</div>
                <div className="trust-badge"><i className="bi bi-star-fill"></i> Trusted & Amanah</div>
              </div>
              
              <h1 className="mb-4 animate__animated animate__fadeInUp">
                Solusi <span id="typing-text" className="text-gradient-gold"></span> <br />
                Terpercaya & Aman
              </h1>
              
              <p className="lead mb-5 px-lg-5 animate__animated animate__fadeInUp animate__delay-1s">
                Tingkatkan kredibilitas sosial media Anda dengan layanan boosting terbaik di Indonesia. Tanpa password, privasi terjaga, dan harga bersahabat.
              </p>
              
              <div className="d-flex gap-3 justify-content-center animate__animated animate__fadeInUp animate__delay-1s">
                <a href="#pricing" className="btn btn-custom btn-gold">
                  <i className="bi bi-rocket-takeoff-fill me-2"></i> LIHAT PAKET
                </a>
                <a href="#features" className="btn btn-custom btn-glass">
                  PELAJARI LEBIH
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-to-order" className="py-5">
        <div className="container py-5">
          <div className="section-header">
            <span className="section-label">GAK PAKE RIBET</span>
            <h2>Alur Pembelian</h2>
            <p>Cukup 4 langkah mudah untuk menaikkan branding sosial media Anda.</p>
          </div>

          <div className="row g-4">
            {[
                { n: '01', i: 'bi-grid-fill', t: 'Pilih Paket', d: 'Cek katalog, pilih layanan yang Anda butuhkan.' },
                { n: '02', i: 'bi-pencil-square', t: 'Isi Data', d: 'Masukkan Username/Link target & jumlah order.' },
                { n: '03', i: 'bi-wallet2', t: 'Pembayaran', d: 'Bayar via QRIS/E-Wallet sesuai total harga.' },
                { n: '04', i: 'bi-whatsapp', t: 'Konfirmasi', d: 'Klik tombol order & kirim bukti transfer di WA.' }
            ].map((step, idx) => (
                <div className="col-6 col-md-3" key={idx}>
                    <div className="step-card">
                        <div className="step-number">{step.n}</div>
                        <i className={`bi ${step.i} step-icon`}></i>
                        <h4>{step.t}</h4>
                        <p>{step.d}</p>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-5 bg-surface-1">
        <div className="container py-5">
          <div className="section-header">
            <span className="section-label">KENAPA KAMI?</span>
            <h2>Kualitas di Atas Kuantitas</h2>
            <p>Kami tidak sekadar menjual angka, kami memberikan value untuk branding Anda.</p>
          </div>
          <div className="row g-4">
             {/* Feature Cards manual untuk styling konsisten */}
             <div className="col-6 col-md-6 col-lg-3">
                <div className="feature-card">
                    <div className="feature-icon-box"><i className="bi bi-shield-lock"></i></div>
                    <h4 className="h6 fw-bold">Privasi Terjaga</h4>
                    <p className="small text-secondary mb-0">Hanya butuh Username. Kami tidak minta Password.</p>
                </div>
             </div>
             <div className="col-6 col-md-6 col-lg-3">
                <div className="feature-card">
                    <div className="feature-icon-box"><i className="bi bi-lightning-charge"></i></div>
                    <h4 className="h6 fw-bold">Server Cepat</h4>
                    <p className="small text-secondary mb-0">Orderan diproses otomatis 24 jam non-stop.</p>
                </div>
             </div>
             <div className="col-6 col-md-6 col-lg-3">
                <div className="feature-card">
                    <div className="feature-icon-box"><i className="bi bi-wallet2"></i></div>
                    <h4 className="h6 fw-bold">Harga Reseller</h4>
                    <p className="small text-secondary mb-0">Harga termurah, cocok untuk dijual kembali.</p>
                </div>
             </div>
             <div className="col-6 col-md-6 col-lg-3">
                <div className="feature-card">
                    <div className="feature-icon-box"><i className="bi bi-headset"></i></div>
                    <h4 className="h6 fw-bold">Support</h4>
                    <p className="small text-secondary mb-0">Admin siap membantu jika ada kendala.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-5">
        <div className="container py-5">
          <div className="section-header">
            <span className="section-label">BUKTI NYATA</span>
            <h2>Kata Mereka</h2>
          </div>
          <div className="swiper mySwiper">
            <div className="swiper-wrapper">
                <div className="swiper-slide">
                    <div className="d-flex text-warning mb-3">
                        <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                    </div>
                    <p className="fst-italic small">&quot;Awalnya ragu karena tanpa password, ternyata beneran masuk cepet banget. Followernya juga akun aktif keliatannya. Thanks min!&quot;</p>
                    <div className="d-flex align-items-center mt-4">
                        <img src="https://ui-avatars.com/api/?name=David+P&background=FFD700&color=000" className="rounded-circle me-3" width="40" alt="User" />
                        <div><h6 className="mb-0 text-white small">David Pratama</h6><small className="text-secondary" style={{fontSize:'0.7rem'}}>Owner Olshop</small></div>
                    </div>
                </div>
                <div className="swiper-slide">
                    <div className="d-flex text-warning mb-3">
                        <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                    </div>
                    <p className="fst-italic small">&quot;Buat yang mau FYP di TikTok wajib cobain suntik views disini. Video gue langsung naik trafficnya setelah order.&quot;</p>
                    <div className="d-flex align-items-center mt-4">
                        <img src="https://ui-avatars.com/api/?name=Siska+L&background=FFD700&color=000" className="rounded-circle me-3" width="40" alt="User" />
                        <div><h6 className="mb-0 text-white small">Siska Kol</h6><small className="text-secondary" style={{fontSize:'0.7rem'}}>Content Creator</small></div>
                    </div>
                </div>
                <div className="swiper-slide">
                    <div className="d-flex text-warning mb-3">
                        <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                    </div>
                    <p className="fst-italic small">&quot;Admin fast respon, ada garansi refill juga kalo drop. Recommended banget buat yang mau bangun branding dari nol.&quot;</p>
                    <div className="d-flex align-items-center mt-4">
                        <img src="https://ui-avatars.com/api/?name=Budi+S&background=FFD700&color=000" className="rounded-circle me-3" width="40" alt="User" />
                        <div><h6 className="mb-0 text-white small">Budi Santoso</h6><small className="text-secondary" style={{fontSize:'0.7rem'}}>UMKM Kuliner</small></div>
                    </div>
                </div>
            </div>
            <div className="swiper-pagination mt-4"></div>
          </div>

          <div className="cta-instagram-wrapper animate__animated animate__fadeInUp animate__delay-2s">
            <a href="https://instagram.com/ridho.store17" target="_blank" className="btn-ig-premium">
                <div className="ig-premium-icon"><i className="bi bi-instagram"></i></div>
                <div className="ig-premium-text">
                    <span className="ig-premium-subtitle">Masih Ragu?</span>
                    <span className="ig-premium-title">Cek 1.000+ Testimoni di IG</span>
                </div>
                <i className="bi bi-chevron-right ms-3 text-white opacity-50"></i>
            </a>
            <p className="text-secondary small mb-0" style={{fontSize: '0.7rem', opacity: 0.7}}>
                <i className="bi bi-info-circle me-1"></i> Klik untuk melihat Highlight &quot;Testimoni&quot;
            </p>
          </div>
        </div>
      </section>

      <section id="tracking" className="py-4">
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8">
                    <div className="tracking-box bg-glass animate__animated animate__fadeInUp">
                        <h5 className="text-white mb-3"><i className="bi bi-search text-gold me-2"></i>Lacak Status Order</h5>
                        <div className="input-group mb-3">
                            <input type="text" id="trackingInput" className="form-control bg-dark border-secondary text-white" placeholder="Masukkan Username / Link" />
                            <button className="btn btn-gold" type="button" onClick={() => callGlobal('checkOrderStatus')}>Cek Status</button>
                        </div>
                        <div id="trackingResult" style={{display: 'none'}}>
                            <span className="text-muted small">Status Pesanan:</span><br/>
                            <span className="tracking-status-badge bg-warning text-dark" id="statusBadge">PENDING</span>
                            <p className="small text-secondary mt-2 mb-0" id="statusMsg">Sedang dalam antrian server...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section id="pricing" className="py-5 bg-surface-1">
        <div className="container py-5">
            <div className="section-header">
                <span className="section-label">KATALOG LENGKAP</span>
                <h2>Pilih Layanan</h2>
                <p>Silakan pilih kategori di bawah untuk melihat daftar harga.</p>
            </div>

            <div className="search-container animate__animated animate__fadeIn">
                <i className="bi bi-search search-icon"></i>
                <input type="text" id="serviceSearch" className="search-input" placeholder="Cari layanan (Contoh: Followers)..." onKeyUp={() => callGlobal('searchServices')} />
            </div>

            <div className="dropdown d-grid gap-2 col-lg-6 mx-auto mb-4">
                <button className="btn btn-gold dropdown-toggle py-3 fw-bold rounded-pill shadow-glow" type="button" id="catalogDropdownBtn" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="bi bi-grid-fill me-2"></i> PILIH KATEGORI LAYANAN
                </button>
                <ul className="dropdown-menu w-100 dropdown-menu-dark-custom shadow-glow" aria-labelledby="catalogDropdownBtn">
                    <li><a className="dropdown-item py-3" href="#" onClick={(e) => { e.preventDefault(); callGlobal('selectCatalog', e, 'all', 'Semua Layanan'); }}>Semua Layanan</a></li>
                    <li><a className="dropdown-item py-3" href="#" onClick={(e) => { e.preventDefault(); callGlobal('selectCatalog', e, 'instagram', 'Layanan Instagram'); }}><i className="bi bi-instagram me-2 text-danger"></i> Instagram</a></li>
                    <li><a className="dropdown-item py-3" href="#" onClick={(e) => { e.preventDefault(); callGlobal('selectCatalog', e, 'tiktok', 'Layanan TikTok'); }}><i className="bi bi-tiktok me-2 text-white"></i> TikTok</a></li>
                    <li><a className="dropdown-item py-3" href="#" onClick={(e) => { e.preventDefault(); callGlobal('selectCatalog', e, 'shopee', 'Layanan Shopee'); }}><i className="bi bi-bag-fill me-2 text-warning"></i> Shopee</a></li>
                </ul>
            </div>

            <div id="service-container" className="service-grid"></div>
        </div>
      </section>

      <section id="faq" className="py-5">
        <div className="container py-5">
            <div className="section-header">
                <span className="section-label">EDUKASI</span>
                <h2>Tanya Jawab</h2>
            </div>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="accordion accordion-custom" id="accordionFaq">
                        {/* Accordion Items */}
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">Apa itu &quot;Refill&quot; dan &quot;No Refill&quot;?</button>
                            </h2>
                            <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#accordionFaq">
                                <div className="accordion-body">
                                    <strong>Refill (Bergaransi):</strong> Jika followers turun dalam masa garansi (biasanya 30 hari), sistem akan mengisi ulang secara otomatis/manual. <br/>
                                    <strong>No Refill (Tidak Garansi):</strong> Jika followers turun, tidak ada pengisian ulang. Biasanya harganya jauh lebih murah.
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">Berapa lama proses pengerjaan?</button>
                            </h2>
                            <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#accordionFaq">
                                <div className="accordion-body">
                                    Rata-rata pesanan diproses dalam <strong>10-60 menit</strong> setelah pembayaran terkonfirmasi. Namun, untuk layanan server yang sedang padat bisa memakan waktu hingga 1x24 jam. Layanan Views/Likes biasanya Instant.
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">Apakah akun saya aman? Butuh password?</button>
                            </h2>
                            <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#accordionFaq">
                                <div className="accordion-body">
                                    <strong>100% AMAN.</strong> Kami HANYA membutuhkan Username atau Link Postingan. Kami <span className="text-danger fw-bold">TIDAK PERNAH</span> meminta Password akun Anda. Pastikan akun tidak di-private saat proses pengerjaan.
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">Apa itu Drop dan Instant?</button>
                            </h2>
                            <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#accordionFaq">
                                <div className="accordion-body">
                                    <strong>Drop:</strong> Penurunan jumlah followers/likes yang wajar karena algoritma sosmed menghapus akun pasif.<br/>
                                    <strong>Instant:</strong> Layanan langsung masuk sesaat setelah dipesan (tanpa antri lama).
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section id="payment" className="py-5">
        <div className="container py-5">
            <div className="row">
                <div className="col-lg-6 mb-4">
                    <h3 className="mb-4 h4">Metode Pembayaran</h3>
                    <p className="small">Kami menerima pembayaran melalui E-Wallet dan QRIS (All Payment) bebas biaya admin. Konfirmasi otomatis jika menggunakan QRIS.</p>
                    
                    <div className="payment-card">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-wallet-fill fs-4 text-gold me-3"></i>
                            <div>
                                <h6 className="mb-0 text-white small">DANA / GOPAY</h6>
                                <small className="text-secondary" style={{fontSize:'0.75rem'}}>0878-7984-2395 (Ridho)</small>
                            </div>
                        </div>
                        <button className="copy-btn" onClick={() => callGlobal('copyToClipboard', '087879842395')}>Salin</button>
                    </div>

                    <div className="payment-card border-active bg-glass">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-qr-code-scan fs-4 text-gold me-3"></i>
                            <div>
                                <h6 className="mb-0 text-white small">QRIS (All Bank/E-Wallet)</h6>
                                <small className="text-secondary" style={{fontSize:'0.75rem'}}>Scan barcode pada Form Order</small>
                            </div>
                        </div>
                        <span className="badge bg-success" style={{fontSize:'0.6rem'}}>AUTO</span>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="p-4 rounded-4" style={{background: 'linear-gradient(135deg, #1a1a1a, #000)', border: '1px solid #333'}}>
                        <h5 className="text-white mb-3 h6"><i className="bi bi-info-circle text-gold me-2"></i>Cara Pemesanan</h5>
                        <ol className="text-secondary ps-3 mb-0" style={{fontSize: '0.85rem'}}>
                            <li className="mb-2">Pilih kategori layanan di atas.</li>
                            <li className="mb-2">Isi username/link & jumlah order.</li>
                            <li className="mb-2">Pilih metode pembayaran (QRIS/E-Wallet).</li>
                            <li className="mb-2">Klik Order & kirim bukti transfer di WhatsApp.</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section id="order" className="py-5 bg-surface-1">
        <div className="card bg-surface-2 border border-secondary border-opacity-25 rounded-4 p-4 shadow-soft">
            <div id="loadingOverlay" style={{display:'none', position:'absolute', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.9)', zIndex:10, borderRadius:'16px', flexDirection:'column', justifyContent:'center', alignItems:'center', backdropFilter: 'blur(5px)'}}>
                <div className="spinner-border text-gold mb-3" role="status"></div>
                <span className="text-white small letter-spacing-2 fw-bold">MEMPROSES ORDER...</span>
            </div>

            <div className="mb-4">
                <h6 className="text-gold text-uppercase fw-bold small mb-3 letter-spacing-2">🔥 Paket Paling Laris (Klik Langsung Isi)</h6>
                <div className="d-flex gap-2 overflow-auto pb-2 no-scrollbar">
                    <div className="quick-card border-gradient-1" onClick={() => callGlobal('applyBundle', 'IG Followers Mix (Less Drop)', 100)}>
                        <div className="d-flex align-items-center mb-1">
                            <i className="bi bi-instagram text-danger me-2"></i>
                            <span className="badge bg-secondary" style={{fontSize: '0.6rem'}}>HEMAT</span>
                        </div>
                        <h6 className="text-white fw-bold mb-0" style={{fontSize: '0.8rem'}}>100 Followers</h6>
                        <small className="text-secondary" style={{fontSize: '0.7rem'}}>Cuma Rp 2.500</small>
                    </div>
                    <div className="quick-card border-gradient-2" onClick={() => callGlobal('applyBundle', 'TikTok Likes', 500)}>
                        <div className="d-flex align-items-center mb-1">
                            <i className="bi bi-tiktok text-white me-2"></i>
                            <span className="badge bg-warning text-dark" style={{fontSize: '0.6rem'}}>POPULER</span>
                        </div>
                        <h6 className="text-white fw-bold mb-0" style={{fontSize: '0.8rem'}}>500 Likes</h6>
                        <small className="text-secondary" style={{fontSize: '0.7rem'}}>Video FYP</small>
                    </div>
                    <div className="quick-card border-gradient-3" onClick={() => callGlobal('applyBundle', 'IG Followers Indo (Real)', 1000)}>
                        <div className="d-flex align-items-center mb-1">
                            <i className="bi bi-shield-check text-gold me-2"></i>
                            <span className="badge bg-gold text-dark" style={{fontSize: '0.6rem'}}>SULTAN</span>
                        </div>
                        <h6 className="text-white fw-bold mb-0" style={{fontSize: '0.8rem'}}>1000 Indo Real</h6>
                        <small className="text-secondary" style={{fontSize: '0.7rem'}}>Akun Asli</small>
                    </div>
                </div>
            </div>

            <form id="nativeOrderForm" onSubmit={(e) => { e.preventDefault(); callGlobal('submitOrder', e); }}>
                <h6 className="text-gold text-uppercase fw-bold small mb-3 letter-spacing-2">1. Pilih Platform</h6>
                <div className="visual-selector mb-4">
                    <div className="selector-item" onClick={(e) => callGlobal('selectCategory', 'instagram', e.currentTarget)}>
                        <i className="bi bi-instagram text-danger"></i> <span className="d-block mt-1">Instagram</span>
                    </div>
                    <div className="selector-item" onClick={(e) => callGlobal('selectCategory', 'tiktok', e.currentTarget)}>
                        <i className="bi bi-tiktok text-white"></i> <span className="d-block mt-1">TikTok</span>
                    </div>
                    <div className="selector-item" onClick={(e) => callGlobal('selectCategory', 'shopee', e.currentTarget)}>
                        <i className="bi bi-bag-fill text-warning"></i> <span className="d-block mt-1">Shopee</span>
                    </div>
                </div>

                <h6 className="text-secondary text-uppercase fw-bold small mb-3 letter-spacing-2">2. Detail Pesanan</h6>
                <div className="bg-black bg-opacity-50 p-3 rounded-3 border border-secondary border-opacity-25 mb-4">
                    <div className="mb-3" id="inputServiceGroup">
                        <label className="text-secondary small mb-1">Layanan</label>
                        <select className="form-select bg-dark text-white border-secondary shadow-none" id="inputService" required onChange={() => callGlobal('calcTotal')} style={{fontSize:'0.9rem'}}>
                            <option value="" disabled>-- Pilih Kategori Diatas Dulu --</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="text-secondary small mb-1">Target (Username / Link)</label>
                        <div className="input-group">
                            <span className="input-group-text bg-dark border-secondary text-secondary"><i className="bi bi-link-45deg"></i></span>
                            <input type="text" className="form-control bg-dark text-white border-secondary shadow-none" id="inputTarget" placeholder="@username / Link Postingan" required autoComplete="off" />
                        </div>
                    </div>
                    <div className="row g-2">
                        <div className="col-6">
                            <label className="text-secondary small mb-1">Jumlah</label>
                            <input type="number" className="form-control bg-dark text-white border-secondary shadow-none" id="inputQuantity" placeholder="Min: 100" min="100" required onInput={() => callGlobal('calcTotal')} />
                        </div>
                        <div className="col-6">
                            <label className="text-secondary small mb-1">Kode Promo</label>
                            <div className="input-group">
                                <input type="text" className="form-control bg-dark text-white border-secondary shadow-none" id="inputPromo" placeholder="Optional" />
                                <button className="btn btn-outline-warning" type="button" onClick={() => callGlobal('applyPromo')}><i className="bi bi-tag-fill"></i></button>
                            </div>
                        </div>
                    </div>
                    <small id="promoMessage" className="d-block mt-1" style={{fontSize: '0.7rem'}}></small>
                </div>

                <h6 className="text-secondary text-uppercase fw-bold small mb-3 letter-spacing-2">3. Pembayaran</h6>
                <input type="hidden" id="inputPayment" value="" /> 

                <div className="payment-grid mb-4">
                    <div className="payment-option" onClick={(e) => callGlobal('selectPayment', 'QRIS', e.currentTarget)}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <i className="bi bi-qr-code-scan fs-4 text-white"></i>
                            <span className="badge bg-success text-white" style={{fontSize:'0.6rem'}}>AUTO</span>
                        </div>
                        <span className="fw-bold text-white d-block">QRIS</span>
                        <small className="text-secondary" style={{fontSize:'0.65rem'}}>Semua E-Wallet/Bank</small>
                    </div>
                    <div className="payment-option" onClick={(e) => callGlobal('selectPayment', 'DANA', e.currentTarget)}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <i className="bi bi-wallet2 fs-4 text-primary"></i>
                        </div>
                        <span className="fw-bold text-white d-block">DANA</span>
                        <small className="text-secondary" style={{fontSize:'0.65rem'}}>Transfer Manual</small>
                    </div>
                    <div className="payment-option" onClick={(e) => callGlobal('selectPayment', 'GOPAY', e.currentTarget)}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <i className="bi bi-wallet2 fs-4 text-info"></i>
                        </div>
                        <span className="fw-bold text-white d-block">GOPAY</span>
                        <small className="text-secondary" style={{fontSize:'0.65rem'}}>Transfer Manual</small>
                    </div>
                </div>

                <div className="live-receipt p-3 rounded-3 mb-4" style={{background: '#1a1a1a', border: '1px dashed #333'}}>
                    <div className="d-flex justify-content-between mb-1">
                        <span className="text-secondary small">Layanan:</span>
                        <span className="text-white small text-end" id="receiptService" style={{maxWidth: '60%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>-</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                        <span className="text-secondary small">Jumlah:</span>
                        <span className="text-white small" id="receiptQty">0</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-secondary small">Diskon:</span>
                        <span className="text-success small fw-bold" id="receiptDiscount">-Rp 0</span>
                    </div>
                    <hr className="border-secondary border-opacity-25 my-2" />
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="text-gold fw-bold small">TOTAL BAYAR</span>
                        <span className="text-gold fw-bold fs-5" id="receiptTotal">Rp 0</span>
                    </div>
                    <input type="hidden" id="displayTotal" value="0" />
                </div>
                <div className="text-end mb-2">
                    <small onClick={() => callGlobal('RidhoStoreApp.downloadReceipt')} className="text-secondary" style={{cursor:'pointer', textDecoration:'underline'}}>
                        <i className="bi bi-camera-fill"></i> Simpan Gambar Struk
                    </small>
                </div>

                <div className="mb-4">
                    <label className="text-secondary small mb-1">Nomor WhatsApp (Untuk Konfirmasi)</label>
                    <div className="input-group">
                        <span className="input-group-text bg-dark border-secondary text-success"><i className="bi bi-whatsapp"></i></span>
                        <input type="tel" className="form-control bg-dark text-white border-secondary shadow-none" id="inputWhatsapp" placeholder="08xxxxxxxx" required autoComplete="off" />
                    </div>
                </div>

                <button type="submit" className="btn btn-custom btn-gold w-100 py-3 fw-bold mt-2 shadow-glow btn-shine">
                    <i className="bi bi-rocket-takeoff-fill me-2"></i> PROSES PESANAN SEKARANG
                </button>
                <p className="text-center text-secondary mt-3 mb-0" style={{fontSize:'0.65rem'}}>
                    <i className="bi bi-shield-lock-fill me-1"></i> Data Anda dienkripsi & aman 100%.
                </p>
            </form>
        </div>
      </section>

      {/* --- MODALs --- */}
      <div className="modal fade" id="exitModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content exit-modal-content">
                <div className="discount-badge-floating"><span>10%</span><small>OFF</small></div>
                <div className="modal-body text-center p-4 position-relative">
                    <button type="button" className="btn-close btn-close-white position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" aria-label="Close"></button>
                    <div className="mb-3 animate__animated animate__tada animate__infinite animate__slower"><span style={{fontSize: '3rem'}}>🎁</span></div>
                    <h3 className="text-white fw-bold mb-2">EITS, TUNGGU DULU! ✋</h3>
                    <p className="text-secondary small mb-4 px-3">Kamu yakin mau pergi? Padahal kami simpan <span className="text-gold fw-bold">Voucher Rahasia</span> khusus buat kamu hari ini.</p>
                    <div className="coupon-ticket mb-4" onClick={() => callGlobal('copyToClipboard', 'RIDHO10')}>
                        <div className="coupon-left"><span className="text-muted small text-uppercase" style={{fontSize:'0.6rem', letterSpacing:'1px'}}>Kode Voucher</span><h2 className="text-gold m-0 letter-spacing-2 fw-bold">RIDHO10</h2></div>
                        <div className="coupon-right"><i className="bi bi-files text-white"></i><span className="small text-white d-block mt-1" style={{fontSize:'0.6rem'}}>TAP COPY</span></div>
                    </div>
                    <button type="button" className="btn btn-gold w-100 fw-bold py-3 shadow-glow rounded-pill animate__animated animate__pulse animate__infinite" data-bs-dismiss="modal" onClick={() => { if(document.getElementById('inputPromo')) (document.getElementById('inputPromo') as HTMLInputElement).value='RIDHO10'; callGlobal('applyPromo'); }}>
                        <i className="bi bi-stars me-1"></i> KLAIM DISKON SEKARANG
                    </button>
                    <button type="button" className="btn btn-link text-muted mt-2 text-decoration-none small" data-bs-dismiss="modal" style={{fontSize: '0.75rem'}}>Tidak, saya suka bayar harga mahal</button>
                </div>
            </div>
        </div>
      </div>

      <div className="modal fade modal-premium" id="tosModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
                <div className="modal-header"><h5 className="modal-title text-gradient-gold"><i className="bi bi-file-earmark-text-fill me-2"></i> SYARAT & KETENTUAN</h5><button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button></div>
                <div className="modal-body legal-content">
                    <div className="legal-item"><i className="bi bi-info-circle-fill legal-icon"></i><h6 className="legal-heading">1. Ketentuan Umum</h6><p className="legal-text">Dengan melakukan pemesanan di Ridho Store, Anda dianggap telah membaca...</p></div>
                    <div className="legal-item"><i className="bi bi-shield-check legal-icon"></i><h6 className="legal-heading">2. Garansi & Refill</h6><p className="legal-text">Layanan bertanda &quot;Refill&quot; memiliki garansi...</p></div>
                    <div className="legal-item"><i className="bi bi-exclamation-triangle-fill legal-icon"></i><h6 className="legal-heading">3. Larangan & Pembatasan</h6><p className="legal-text">Dilarang memesan untuk akun yang melanggar hukum...</p></div>
                </div>
                <div className="modal-footer border-0 pt-0"><button type="button" className="btn btn-sm btn-gold w-100 rounded-pill" data-bs-dismiss="modal">Saya Mengerti</button></div>
            </div>
        </div>
      </div>

      <div className="modal fade modal-premium" id="privacyModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
                <div className="modal-header"><h5 className="modal-title text-gradient-gold"><i className="bi bi-shield-lock-fill me-2"></i> KEBIJAKAN PRIVASI</h5><button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button></div>
                <div className="modal-body legal-content">
                    <div className="legal-item"><i className="bi bi-database-lock legal-icon"></i><h6 className="legal-heading">1. Pengumpulan Data</h6><p className="legal-text">Kami hanya mengumpulkan data yang diperlukan...</p></div>
                    <div className="legal-item"><i className="bi bi-share-fill legal-icon"></i><h6 className="legal-heading">2. Penggunaan Data</h6><p className="legal-text">Data Username/Link digunakan semata-mata...</p></div>
                    <div className="legal-item"><i className="bi bi-incognito legal-icon"></i><h6 className="legal-heading">3. Keamanan</h6><p className="legal-text">Kami menjamin kerahasiaan data pesanan Anda...</p></div>
                </div>
                <div className="modal-footer border-0 pt-0"><button type="button" className="btn btn-sm btn-gold w-100 rounded-pill" data-bs-dismiss="modal">Saya Setuju</button></div>
            </div>
        </div>
      </div>

      <div className="modal fade" id="historyModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content bg-dark border border-secondary border-opacity-50 shadow-glow" style={{backdropFilter: 'blur(15px)', background: 'rgba(20, 20, 20, 0.9)'}}>
                <div className="modal-header border-secondary border-opacity-25"><h5 className="modal-title text-gold fw-bold letter-spacing-1"><i className="bi bi-clock-history me-2"></i> RIWAYAT ORDER</h5><button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button></div>
                <div className="modal-body p-0"><div id="historyList" className="p-3"><div className="text-center py-5 text-secondary"><i className="bi bi-inbox fs-1 mb-3 d-block opacity-25"></i><small>Belum ada riwayat transaksi.</small></div></div></div>
                <div className="modal-footer border-secondary border-opacity-25 justify-content-between">
                    <button className="btn btn-sm btn-outline-danger border-0" onClick={() => callGlobal('RidhoStoreApp.clearHistory')}><i className="bi bi-trash"></i> Hapus Semua</button>
                    <button type="button" className="btn btn-sm btn-gold rounded-pill px-4" data-bs-dismiss="modal">Tutup</button>
                </div>
            </div>
        </div>
      </div>

      <button onClick={() => callGlobal('RidhoStoreApp.openHistory')} className="btn-history-float shadow-glow"><i className="bi bi-receipt"></i></button>

      <div className="modal fade" id="waPreviewModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content overflow-hidden border-0 shadow-lg" style={{borderRadius: '20px'}}>
                <div className="modal-header border-0 p-3" style={{backgroundColor: '#075E54', color: 'white'}}>
                    <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-arrow-left cursor-pointer" data-bs-dismiss="modal"></i>
                        <div className="d-flex align-items-center gap-2">
                            <div className="rounded-circle bg-white d-flex align-items-center justify-content-center" style={{width: '35px', height: '35px'}}><i className="bi bi-robot text-success" style={{fontSize: '1.2rem'}}></i></div>
                            <div style={{lineHeight: 1.1}}><h6 className="m-0 fw-bold" style={{fontSize: '0.9rem'}}>Admin Ridho Store</h6><small style={{fontSize: '0.7rem', opacity: 0.8}}>Online</small></div>
                        </div>
                    </div>
                </div>
                <div className="modal-body p-0" style={{backgroundColor: '#E5DDD5', backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", height: '350px', overflowY: 'auto'}}>
                    <div className="p-3 d-flex flex-column gap-2">
                        <div className="align-self-end position-relative p-2 rounded-3 shadow-sm" style={{backgroundColor: '#DCF8C6', maxWidth: '85%', fontSize: '0.85rem', color: '#000'}}>
                            <span id="waPreviewText" style={{whiteSpace: 'pre-line'}}></span>
                            <div className="text-end mt-1 d-flex justify-content-end align-items-center gap-1" style={{fontSize: '0.65rem', color: '#999'}}><span id="waPreviewTime">19:30</span><i className="bi bi-check-all text-primary"></i></div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer border-0 p-2 bg-white d-flex justify-content-center">
                    <button type="button" className="btn btn-success w-100 rounded-pill fw-bold py-2 shadow-sm" onClick={() => callGlobal('RidhoStoreApp.sendToWA')}><i className="bi bi-whatsapp me-2"></i> KIRIM SEKARANG</button>
                </div>
            </div>
        </div>
      </div>

      <footer className="py-5 bg-black border-top border-secondary border-opacity-25 text-center">
        <div className="container">
            <h3 className="brand-logo mb-3">RIDHO<span className="text-gold">STORE</span></h3>
            <p className="text-secondary small mx-auto mb-4" style={{maxWidth: '500px'}}>Platform Social Media Marketing terpercaya membantu UMKM dan Kreator Indonesia berkembang sejak 2022.</p>
            <div className="server-status"><div className="status-dot"></div><span>Server Status: Operational / Fast Speed ⚡</span></div>
            <div className="mt-3">
                <a href="#" className="text-secondary small text-decoration-none me-3" data-bs-toggle="modal" data-bs-target="#tosModal">Syarat & Ketentuan</a>
                <a href="#" className="text-secondary small text-decoration-none" data-bs-toggle="modal" data-bs-target="#privacyModal">Kebijakan Privasi</a>
            </div>
            <div className="d-flex justify-content-center gap-3 my-4">
                <a href="https://instagram.com/ridho.store17" className="btn btn-icon-only btn-glass d-flex align-items-center justify-content-center"><i className="bi bi-instagram"></i></a>
                <a href="https://wa.me/6287879842395" className="btn btn-icon-only btn-glass d-flex align-items-center justify-content-center"><i className="bi bi-whatsapp"></i></a>
            </div>
            <small className="text-secondary d-block">&copy; 2026 Ridho Store. All rights reserved.</small>
        </div>
      </footer>
    </>
  );
}