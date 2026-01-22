/* FILE: assets/js/script.js */

const RidhoStoreApp = (function() {
    'use strict';

    // --- CONFIGURATION ---
    const CONFIG = {
        adminPhone: '6287879842395',
        googleSheetUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSHy3Ly1WlQ72OBWvLmuNtsKqL6kkicUHkX2HzForygUKMV0jt6Ti7l3zH02fxqtR4jcpMfwH51qSdd/pub?gid=961326959&single=true&output=csv",
        googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSesAKeDg2Uh1dQTELBuMghZrT31yJV6B1rpGQHrYnvRZsAE0w/formResponse',
        promoCodes: {
            'RIDHO10': 0.10, 
            'DISKON5': 0.05,  
            'JUMATBERKAH': 0.15 
        },
        columnMap: { target: 2, status: 7 }
    };

    // --- SECURITY UTILS ---
    const Security = {
        sanitize: (str) => {
            if (typeof str !== 'string') return str;
            const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', "/": '&#x2F;' };
            const reg = /[&<>"'/]/ig;
            return str.replace(reg, (match) => (map[match]));
        },
        validatePhone: (phone) => {
            const re = /^[0-9]+$/;
            return re.test(phone);
        }
    };

    // --- UTILS ---
    const Utils = {
        formatRupiah: (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num),
        copyToClipboard: (text) => {
            navigator.clipboard.writeText(text).then(() => {
                Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Nomor tersalin: ' + text, timer: 1500, showConfirmButton: false, background: '#1e1e1e', color: '#fff', toast: true, position: 'top-end' });
            });
        },
        hidePreloader: () => {
            const p = document.getElementById('preloader');
            if(p) { p.style.opacity = 0; setTimeout(() => { p.style.display = 'none'; }, 500); }
        }
    };

    // --- HISTORY MANAGER (LOCAL VAULT) ---
    const HistoryManager = {
        save: (data) => {
            let history = JSON.parse(localStorage.getItem('ridho_history')) || [];
            data.date = new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
            data.id = 'ORD-' + Date.now().toString().slice(-6); 
            history.unshift(data);
            if(history.length > 20) history.pop();
            localStorage.setItem('ridho_history', JSON.stringify(history));
        },
        load: () => {
            const history = JSON.parse(localStorage.getItem('ridho_history')) || [];
            const container = document.getElementById('historyList');
            if(container) {
                if(history.length === 0) {
                    container.innerHTML = `<div class="text-center py-5 text-secondary"><i class="bi bi-inbox fs-1 mb-3 d-block opacity-25"></i><small>Belum ada riwayat transaksi.</small></div>`;
                    return;
                }
                let html = '';
                history.forEach(item => {
                    html += `
                    <div class="history-item animate__animated animate__fadeIn">
                        <div class="d-flex justify-content-between mb-1">
                            <span class="badge bg-dark border border-secondary text-secondary" style="font-size:0.6rem;">${item.date}</span>
                            <span class="text-gold small fw-bold">Rp ${Utils.formatRupiah(item.total).replace('Rp', '')}</span>
                        </div>
                        <h6 class="text-white mb-1" style="font-size:0.9rem;">${item.service}</h6>
                        <div class="d-flex justify-content-between align-items-center mt-2">
                            <small class="text-secondary" style="font-size:0.75rem;"><i class="bi bi-person-circle me-1"></i> ${item.target}</small>
                            <button class="reorder-btn" onclick="RidhoStoreApp.reOrder('${item.service}', '${item.target}')">
                                <i class="bi bi-arrow-repeat"></i> Order Lagi
                            </button>
                        </div>
                    </div>`;
                });
                container.innerHTML = html;
            }
        },
        clear: () => {
            Swal.fire({
                title: 'Hapus Riwayat?',
                text: "Data yang dihapus tidak bisa kembali.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Ya, Hapus!',
                background: '#1e1e1e', color: '#fff'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('ridho_history');
                    HistoryManager.load();
                    Swal.fire({title:'Terhapus!', icon:'success', timer:1000, showConfirmButton:false, background:'#1e1e1e', color:'#fff', toast:true});
                }
            })
        }
    };

    // --- REFERRAL SYSTEM ---
    const ReferralSystem = {
        init: () => {
            const urlParams = new URLSearchParams(window.location.search);
            const refCode = urlParams.get('ref');
            if (refCode) {
                localStorage.setItem('ridho_ref', Security.sanitize(refCode));
                Swal.fire({
                    toast: true, position: 'top', icon: 'success', 
                    title: `Referral Aktif: ${refCode}`,
                    text: 'Anda mendapatkan prioritas layanan!',
                    background: '#1a472a', color: '#fff', showConfirmButton: false, timer: 3000
                });
            }
        },
        getRef: () => {
            return localStorage.getItem('ridho_ref') || '';
        },
        showPanel: () => {
            Swal.fire({
                title: '<span class="text-gold"><i class="bi bi-cash-coin me-2"></i>Program Mitra</span>',
                html: `
                    <div class="text-start">
                        <div class="p-3 mb-3 rounded-3" style="background: rgba(255, 215, 0, 0.1); border: 1px dashed rgba(255, 215, 0, 0.3);">
                            <h6 class="text-gold fw-bold mb-2" style="font-size:0.9rem;"><i class="bi bi-info-circle-fill me-1"></i> Cara Dapat Cuan:</h6>
                            <ol class="text-secondary small ps-3 mb-0" style="font-size:0.85rem; line-height: 1.6;">
                                <li>Buat <strong>Kode Unik</strong> (Misal: Nama Kamu).</li>
                                <li>Klik tombol <strong>Buat Link Saya</strong>.</li>
                                <li>Copy & sebar link tersebut ke Grup WA/Teman.</li>
                                <li>Setiap temanmu order, Admin akan tahu itu dari kamu! 💸</li>
                            </ol>
                        </div>
                        <label class="small text-white fw-bold mb-2 d-block text-center">Masukkan Kode Unikmu:</label>
                        <div class="input-group mb-3">
                            <span class="input-group-text bg-dark border-secondary text-gold"><i class="bi bi-tag-fill"></i></span>
                            <input type="text" id="myRefCode" class="form-control bg-black text-white border-secondary text-center fw-bold" placeholder="CONTOH: RIDHO01" autocomplete="off" oninput="this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '')">
                        </div>
                        <button class="btn btn-gold w-100 fw-bold py-2 shadow-glow mb-3" onclick="RidhoStoreApp.generateRefLink()">
                            <i class="bi bi-magic me-2"></i> BUAT LINK SAYA
                        </button>
                        <div id="resultRef" style="display:none;" class="animate__animated animate__fadeInUp">
                            <div class="position-relative">
                                <label class="small text-secondary mb-1 d-block text-center">👇 Link Khusus Kamu 👇</label>
                                <div class="d-flex gap-2">
                                    <input type="text" id="finalLink" class="form-control bg-dark border-success text-success fw-bold small" readonly>
                                    <button class="btn btn-success" onclick="copyToClipboard(document.getElementById('finalLink').value)"><i class="bi bi-clipboard-check"></i></button>
                                </div>
                                <small class="text-muted d-block mt-2 text-center fst-italic" style="font-size:0.7rem;">*Simpan link ini baik-baik.</small>
                            </div>
                        </div>
                    </div>
                `,
                background: '#121212', color: '#fff', showConfirmButton: false, showCloseButton: true,
                customClass: { popup: 'border border-secondary border-opacity-25 rounded-4 shadow-lg' }
            });
        },
        generateLink: () => {
            const codeInput = document.getElementById('myRefCode');
            if(!codeInput) return;
            const code = codeInput.value.trim().replace(/[^a-zA-Z0-9]/g, '');
            if(code.length < 3) { Swal.showValidationMessage('Minimal 3 huruf/angka!'); return; }
            const link = `${window.location.origin}${window.location.pathname}?ref=${code}`;
            document.getElementById('resultRef').style.display = 'block';
            document.getElementById('finalLink').value = link;
        }
    };

    // --- PAYMENT GATEWAY (QRIS) ---
    const PaymentGateway = {
        processQRIS: (amount, dataOrder) => {
            const myQRIS = "https://i.ibb.co.com/xtyhX0Gd/Whats-App-Image-2026-01-10-at-19-59-10.jpg"; 
            return Swal.fire({
                title: 'Scan QRIS',
                html: `
                    <div style="text-align: center;">
                        <p class="small text-white mb-2">Total Bayar: <strong class="text-warning fs-5">Rp ${amount}</strong></p>
                        <div style="background: white; padding: 10px; border-radius: 8px; display: inline-block;">
                            <img src="${myQRIS}" style="width: 250px; height: 250px; display:block;">
                        </div>
                        <p class="small text-muted mt-3 mb-1">1. Scan QRIS di atas via DANA/Gopay/ShopeePay/BCA.</p>
                        <p class="small text-muted mb-0">2. Setelah bayar, klik tombol konfirmasi di bawah.</p>
                    </div>
                `,
                background: '#121212', color: '#fff', showCancelButton: true, confirmButtonText: '<i class="bi bi-whatsapp"></i> Konfirmasi ke WA', cancelButtonText: 'Tutup', confirmButtonColor: '#25d366', cancelButtonColor: '#d33', allowOutsideClick: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    const formMap = { service: 'entry.398242453', target: 'entry.1311683536', quantity: 'entry.1805710612', total: 'entry.2074942859', payment: 'entry.371390371', whatsapp: 'entry.1404986427' };
                    const formData = new FormData();
                    for (const key in dataOrder) formData.append(formMap[key], dataOrder[key]);
                    fetch(CONFIG.googleFormUrl, { method: 'POST', mode: 'no-cors', body: formData });

                    const activeRef = ReferralSystem.getRef();
                    const refText = activeRef ? `\n🔗 *Referred By:* ${activeRef}` : '';
                    const textWA = `*KONFIRMASI PEMBAYARAN QRIS* 🟢\n\nHalo Admin, saya sudah scan QRIS.\n\n📦 Layanan: ${dataOrder.service}\n🎯 Target: ${dataOrder.target}\n💰 Nominal: Rp ${amount}\n\nMohon dicek mutasinya, Terima kasih!${refText}`;
                    window.location.href = `https://wa.me/${CONFIG.adminPhone}?text=${encodeURIComponent(textWA)}`;
                }
            });
        }
    };

    // --- DATABASE ---
    const serviceDatabase = [
        { id: 1, category: 'instagram', name: 'IG Followers Mix (Less Drop)', price: 25000, desc: 'Akun campur global, garansi 30 hari refill.' },
        { id: 2, category: 'instagram', name: 'IG Followers Indo (Real)', price: 60000, desc: 'Akun Indonesia asli aktif, interaksi tinggi.' },
        { id: 3, category: 'instagram', name: 'IG Likes (Non-Drop)', price: 35000, desc: 'Likes permanen untuk foto/video.' },
        { id: 4, category: 'instagram', name: 'IG Views (Reels)', price: 2000, desc: 'Views instan untuk video Reels.' },
        { id: 5, category: 'instagram', name: 'IG Comments (Custom)', price: 75000, desc: 'Komentar sesuai request.' },
        { id: 6, category: 'instagram', name: 'IG Story Views', price: 5000, desc: 'Views story cepat masuk.' },
        { id: 7, category: 'tiktok', name: 'TikTok Followers', price: 30000, desc: 'Followers bot high quality.' },
        { id: 8, category: 'tiktok', name: 'TikTok Likes', price: 20000, desc: 'Likes cepat masuk.' },
        { id: 9, category: 'tiktok', name: 'TikTok Views (FYP)', price: 1000, desc: 'Membantu video masuk FYP.' },
        { id: 10, category: 'tiktok', name: 'TikTok Shares', price: 5000, desc: 'Share video ke wa/link.' },
        { id: 11, category: 'shopee', name: 'Shopee Followers Toko', price: 50000, desc: 'Meningkatkan kredibilitas toko.' },
        { id: 12, category: 'shopee', name: 'Shopee Likes Produk', price: 40000, desc: 'Likes pada produk jualan.' }
    ];

    // --- STATE ---
    let state = { activeDiscount: 0, selectedCategory: null, exitIntentShown: false };

    // --- UI ---
    const UI = {
        initSwiper: () => {
            new Swiper(".mySwiper", { slidesPerView: 1.1, spaceBetween: 20, pagination: { el: ".swiper-pagination", clickable: true }, breakpoints: { 640: { slidesPerView: 2, spaceBetween: 20 }, 768: { slidesPerView: 3, spaceBetween: 30 } } });
        },
        loadParticles: () => {
            if(window.particlesJS) {
                particlesJS("particles-js", { "particles": { "number": { "value": 30 }, "color": { "value": "#ffffff" }, "opacity": { "value": 0.2 }, "size": { "value": 3 }, "line_linked": { "enable": true, "color": "#ffffff" }, "move": { "enable": true, "speed": 1.5 } } });
            }
        },
        renderServices: (filter = 'all', keyword = '') => {
            const container = document.getElementById('service-container');
            if (!container) return; 
            container.innerHTML = ''; 
            const filteredData = serviceDatabase.filter(item => {
                const matchCategory = filter === 'all' || item.category === filter;
                const matchSearch = item.name.toLowerCase().includes(keyword.toLowerCase());
                return matchCategory && matchSearch;
            });
            if(filteredData.length === 0) {
                container.innerHTML = `<div class="col-12 text-center py-5"><p class="text-muted">Layanan tidak ditemukan :(</p></div>`;
                return;
            }
            filteredData.forEach(item => {
                const card = document.createElement('div');
                card.className = 'col'; 
                card.setAttribute('data-aos', 'fade-up');
                card.setAttribute('data-aos-duration', '800');
                card.innerHTML = `
                    <div class="price-card h-100">
                        <div>
                            <div class="price-header">
                                <span class="badge bg-secondary mb-2 text-uppercase" style="font-size:0.6rem;">${item.category}</span>
                                <div class="service-name d-flex align-items-center justify-content-between">
                                    <span>${item.name}</span>
                                    <i class="bi bi-info-circle-fill text-secondary" style="font-size:0.9rem; cursor:pointer;" onclick="RidhoStoreApp.showServiceInfo('${item.name}', '${item.desc}')"></i>
                                </div>
                                <span class="service-meta">Harga per 1.000 Pcs</span>
                            </div>
                            <span class="price-tag">${Utils.formatRupiah(item.price)}</span>
                        </div>
                        <a href="javascript:void(0)" class="add-cart-btn" onclick="RidhoStoreApp.preselectService('${item.category}', '${item.name}')">
                            <i class="bi bi-cart-plus me-1"></i> Order
                        </a>
                    </div>`;
                container.appendChild(card);
            });
        }
    };

    // --- FEATURES ---
    const Features = {
        startCountdown: () => {
            let timeInSecs = 7200; 
            setInterval(() => {
                timeInSecs--;
                if(timeInSecs < 0) timeInSecs = 7200; 
                const h = Math.floor(timeInSecs / 3600).toString().padStart(2,'0');
                const m = Math.floor((timeInSecs % 3600) / 60).toString().padStart(2,'0');
                const s = Math.floor(timeInSecs % 60).toString().padStart(2,'0');
                const el = document.getElementById('countdownTimer');
                if(el) el.innerText = `${h}:${m}:${s}`;
            }, 1000);
        },
        startFakeNotif: () => {
            const names = ["Alvin", "Budi", "Citra", "Dewi", "Eka", "Fajar", "Eka", "Dwi","Kevin", "Alex", "Mawar", "Sekar", "Hendi", "Fadhil", "Ayra", "Zahra", "Gween", "Pandu", "Didit"];
            const items = ["1000 Followers IG", "500 Likes TikTok", "1000 Views Reels"];
            const notif = document.getElementById('fakeNotif');
            if(!notif) return;
            setInterval(() => {
                notif.classList.remove('show');
                setTimeout(() => {
                    const randomName = names[Math.floor(Math.random() * names.length)];
                    const randomItem = items[Math.floor(Math.random() * items.length)];
                    document.getElementById('notifName').innerText = `${randomName}`;
                    document.getElementById('notifAction').innerText = `Membeli ${randomItem}`;
                    document.getElementById('notifImg').src = `https://ui-avatars.com/api/?name=${randomName}&background=random`;
                    notif.classList.add('show');
                }, 1000); 
            }, 8000); 
        },
        exitIntent: () => {
            document.addEventListener('mouseleave', e => {
                if (e.clientY < 0 && !state.exitIntentShown) {
                    const elModal = document.getElementById('exitModal');
                    if(elModal) {
                        const modal = new bootstrap.Modal(elModal);
                        modal.show();
                        state.exitIntentShown = true;
                    }
                }
            });
        }
    };

    // --- ORDER SYSTEM ---
    const OrderSystem = {
        selectCategory: (category, element) => {
            state.selectedCategory = category;
            document.querySelectorAll('.selector-item').forEach(el => { el.classList.remove('active'); el.querySelector('i').style.color = ''; });
            element.classList.add('active');
            const select = document.getElementById('inputService');
            select.innerHTML = `<option value="" selected disabled>-- Pilih Paket ${category.charAt(0).toUpperCase() + category.slice(1)} --</option>`;
            const filteredServices = serviceDatabase.filter(item => item.category === category);
            filteredServices.forEach(item => {
                const option = document.createElement('option');
                option.value = item.name; option.setAttribute('data-price', item.price);
                option.textContent = `${item.name} - ${Utils.formatRupiah(item.price)}/1k`;
                select.appendChild(option);
            });
            const inputGroup = document.getElementById('inputServiceGroup');
            if(inputGroup) inputGroup.style.display = 'block';
            document.getElementById('inputQuantity').value = '';
            document.getElementById('displayTotal').value = 'Rp 0';
        },
        
        applyPromo: () => {
            const code = document.getElementById('inputPromo').value.toUpperCase().trim();
            const msg = document.getElementById('promoMessage');
            if (CONFIG.promoCodes[code]) {
                state.activeDiscount = CONFIG.promoCodes[code];
                msg.style.color = '#4ade80'; msg.innerHTML = `<i class="bi bi-check-circle-fill"></i> Kode berhasil! Diskon ${(state.activeDiscount*100)}% diterapkan.`;
                OrderSystem.calcTotal();
            } else {
                state.activeDiscount = 0;
                msg.style.color = '#ef4444'; msg.innerText = 'Kode tidak valid atau kadaluarsa.';
                OrderSystem.calcTotal();
            }
        },

        selectPayment: (method, element) => {
            document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
            element.classList.add('selected');
            const paymentInput = document.getElementById('inputPayment');
            if(paymentInput) paymentInput.value = method;
        },

        calcTotal: () => {
            const serviceSelect = document.getElementById('inputService');
            const qtyInput = document.getElementById('inputQuantity');
            
            const receiptService = document.getElementById('receiptService');
            const receiptQty = document.getElementById('receiptQty');
            const receiptDiscount = document.getElementById('receiptDiscount');
            const receiptTotal = document.getElementById('receiptTotal');
            const displayTotalInput = document.getElementById('displayTotal'); 
            const stickyTotal = document.getElementById('stickyTotal');
            const stickyBar = document.getElementById('stickyBar');

            if(serviceSelect && serviceSelect.selectedIndex > 0) {
                const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
                const pricePerK = selectedOption.getAttribute('data-price');
                const serviceName = selectedOption.text;
                const qty = parseInt(qtyInput.value) || 0;
                
                if(receiptService) receiptService.innerText = serviceName.split('-')[0];
                if(receiptQty) receiptQty.innerText = qty + ' pcs';

                if (qty > 0) {
                    let total = (pricePerK / 1000) * qty;
                    let discount = 0;
                    if(state.activeDiscount > 0) { 
                        discount = total * state.activeDiscount;
                        total = total - discount;
                    }
                    const formattedTotal = Utils.formatRupiah(Math.ceil(total));
                    if(receiptDiscount) receiptDiscount.innerText = discount > 0 ? `-Rp ${Utils.formatRupiah(Math.ceil(discount)).replace('Rp', '')}` : '-Rp 0';
                    if(receiptTotal) receiptTotal.innerText = formattedTotal;
                    if(stickyTotal) stickyTotal.innerText = formattedTotal;
                    if(stickyBar) stickyBar.style.display = 'flex';
                    if(displayTotalInput) displayTotalInput.value = Math.ceil(total); 
                }
            } else {
                if(receiptService) receiptService.innerText = '-';
                if(receiptTotal) receiptTotal.innerText = 'Rp 0';
                if(stickyBar) stickyBar.style.display = 'none';
            }
        },

        sendToWA: () => {
            const data = state.tempOrderData;
            if(!data) return;

            // Tutup Modal
            const elModal = document.getElementById('waPreviewModal');
            const modal = bootstrap.Modal.getInstance(elModal);
            modal.hide();

            // Simpan History & Proses
            HistoryManager.save(data);

            if (data.payment === 'QRIS') {
                PaymentGateway.processQRIS(data.total, data);
            } else {
                // Loading Overlay
                document.getElementById('loadingOverlay').style.display = 'flex';
                
                // Kirim ke Google Form (Background)
                const formMap = { service: 'entry.398242453', target: 'entry.1311683536', quantity: 'entry.1805710612', total: 'entry.2074942859', payment: 'entry.371390371', whatsapp: 'entry.1404986427', referral: 'entry.1649374093' };
                const formData = new FormData();
                for (const key in data) formData.append(formMap[key], data[key]);
                
                localStorage.setItem('user_wa', data.whatsapp);

                fetch(CONFIG.googleFormUrl, { method: 'POST', mode: 'no-cors', body: formData })
                .then(() => {
                    document.getElementById('loadingOverlay').style.display = 'none';
                    
                    // Redirect ke WA Asli
                    const previewText = document.getElementById('waPreviewText').innerText;
                    window.location.href = `https://wa.me/${CONFIG.adminPhone}?text=${encodeURIComponent(previewText)}`;
                    
                    document.getElementById('nativeOrderForm').reset();
                })
                .catch(err => {
                    document.getElementById('loadingOverlay').style.display = 'none';
                    // Tetap arahkan ke WA meski Google Form gagal (Fail-safe)
                    const previewText = document.getElementById('waPreviewText').innerText;
                    window.location.href = `https://wa.me/${CONFIG.adminPhone}?text=${encodeURIComponent(previewText)}`;
                });
            }
        },

        submitOrder: (e) => {
            e.preventDefault(); 
            const rawTarget = document.getElementById('inputTarget').value;
            const rawWhatsapp = document.getElementById('inputWhatsapp').value;
            
            if (!rawTarget || !rawWhatsapp) {
                 Swal.fire({ icon: 'warning', title: 'Data Kurang', text: 'Mohon lengkapi semua data.', background: '#1e1e1e', color: '#fff' });
                 return;
            }

            const cleanTarget = Security.sanitize(rawTarget);
            const cleanWhatsapp = Security.sanitize(rawWhatsapp);

            if (!Security.validatePhone(cleanWhatsapp)) {
                Swal.fire({ icon: 'error', title: 'Format Salah', text: 'Nomor WhatsApp hanya boleh berisi angka.', background: '#1e1e1e', color: '#fff' });
                return;
            }

            const paymentInput = document.getElementById('inputPayment');
            const paymentMethod = paymentInput ? paymentInput.value : '';
            if(!paymentMethod) {
                Swal.fire({ icon: 'warning', title: 'Pilih Pembayaran', text: 'Silakan klik salah satu metode pembayaran.', background: '#1e1e1e', color: '#fff' });
                return;
            }

            const totalValue = document.getElementById('displayTotal').value; 
            const formMap = { service: 'entry.398242453', target: 'entry.1311683536', quantity: 'entry.1805710612', total: 'entry.2074942859', payment: 'entry.371390371', whatsapp: 'entry.1404986427', referral: 'entry.1649374093' };
            const activeRef = ReferralSystem.getRef() || '-'; 

            const data = {
                service: document.getElementById('inputService').value,
                target: cleanTarget,
                quantity: document.getElementById('inputQuantity').value,
                total: totalValue,
                payment: paymentMethod,
                whatsapp: cleanWhatsapp,
                referral: activeRef 
            };

            HistoryManager.save(data);

            if (paymentMethod === 'QRIS') {
                PaymentGateway.processQRIS(totalValue, data);
            } else {
                document.getElementById('loadingOverlay').style.display = 'flex';
                const formData = new FormData();
                for (const key in data) formData.append(formMap[key], data[key]);
                localStorage.setItem('user_wa', cleanWhatsapp);

                fetch(CONFIG.googleFormUrl, { method: 'POST', mode: 'no-cors', body: formData })
                .then(() => {
                    document.getElementById('loadingOverlay').style.display = 'none';
                    const activeRef = ReferralSystem.getRef();
                    const refText = activeRef ? `\n🔗 *Referred By:* ${activeRef}` : '';
                    const textWA = `*Halo Admin Ridho Store!* 👋\nSaya sudah isi form order, ini detailnya:\n\n📦 *Layanan:* ${data.service}\n🎯 *Target:* ${data.target}\n🔢 *Jumlah:* ${data.quantity}\n💰 *Total:* Rp ${new Intl.NumberFormat('id-ID').format(data.total)}\n💳 *Bayar Via:* ${data.payment}\n📱 *No WA:* ${data.whatsapp}${refText}\n\nMohon diproses, bukti transfer saya lampirkan dibawah ini 👇`;
                    window.location.href = `https://wa.me/${CONFIG.adminPhone}?text=${encodeURIComponent(textWA)}`;
                    document.getElementById('nativeOrderForm').reset();
                })
                .catch(err => {
                    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal mengirim data.', background: '#1e1e1e', color: '#fff' });
                    document.getElementById('loadingOverlay').style.display = 'none';
                });
            }
        },

        checkOrderStatus: async () => {
            const rawInput = document.getElementById('trackingInput').value.trim();
            const input = Security.sanitize(rawInput);
            const resultBox = document.getElementById('trackingResult');
            const badge = document.getElementById('statusBadge');
            const msg = document.getElementById('statusMsg');

            if(!input) { Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Masukkan Username atau Link dulu ya!', background: '#1e1e1e', color: '#fff', confirmButtonColor: '#FFD700' }); return; }

            resultBox.style.display = 'block';
            badge.className = 'tracking-status-badge bg-secondary text-white';
            badge.innerText = 'MENCARI DATA...'; msg.innerText = 'Menghubungkan ke database...';

            try {
                const response = await fetch(CONFIG.googleSheetUrl);
                const data = await response.text();
                const rows = data.split('\n').map(row => row.split(','));
                let found = false; let statusOrder = "PENDING"; 

                for (let i = 1; i < rows.length; i++) {
                    const columns = rows[i];
                    if (columns[CONFIG.columnMap.target]) {
                        const dbTarget = columns[CONFIG.columnMap.target].replace(/['"]+/g, '').trim();
                        if (dbTarget.toLowerCase() === input.toLowerCase()) {
                            found = true;
                            if(columns[CONFIG.columnMap.status]) { statusOrder = columns[CONFIG.columnMap.status].replace(/['"]+/g, '').trim().toUpperCase(); }
                            break; 
                        }
                    }
                }

                if (found) {
                    if (statusOrder.includes("SUKSES") || statusOrder.includes("COMPLETED")) {
                        badge.className = 'tracking-status-badge bg-success text-white'; badge.innerText = 'SUKSES / COMPLETED'; msg.innerText = 'Orderan telah selesai dikirim! Terima kasih.';
                    } else if (statusOrder.includes("PROSES") || statusOrder.includes("PROCESSING")) {
                        badge.className = 'tracking-status-badge bg-warning text-dark'; badge.innerText = 'SEDANG DIPROSES'; msg.innerText = 'Orderan sedang dikerjakan server. Mohon ditunggu.';
                    } else {
                        badge.className = 'tracking-status-badge bg-info text-dark'; badge.innerText = statusOrder || 'PENDING'; msg.innerText = 'Pesanan sudah masuk antrian sistem.';
                    }
                } else {
                    badge.className = 'tracking-status-badge bg-dark text-secondary border border-secondary'; badge.innerText = 'DATA TIDAK DITEMUKAN'; msg.innerText = 'Cek kembali Username/Link. Pastikan sama persis saat order.';
                }
            } catch (error) {
                badge.className = 'tracking-status-badge bg-danger text-white'; badge.innerText = 'ERROR SYSTEM'; msg.innerText = 'Gagal terhubung ke server database.';
            }
        }
    };

    // --- LOGIKA PAKET SAT-SET (BUNDLES) ---
    const applyBundleInternal = (serviceName, qty) => {
        let category = '';
        if(serviceName.includes('IG')) category = 'instagram';
        else if(serviceName.includes('TikTok')) category = 'tiktok';
        else if(serviceName.includes('Shopee')) category = 'shopee';

        const selectors = document.querySelectorAll('.selector-item');
        const map = { 'instagram': 0, 'tiktok': 1, 'shopee': 2 };
        if(selectors[map[category]]) selectors[map[category]].click();

        setTimeout(() => {
            const select = document.getElementById('inputService');
            const inputQty = document.getElementById('inputQuantity');
            
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].text.includes(serviceName)) {
                    select.selectedIndex = i;
                    break;
                }
            }
            inputQty.value = qty;
            OrderSystem.calcTotal(); 

            const Toast = Swal.mixin({
                toast: true, position: 'top-end', showConfirmButton: false, timer: 1500, background: '#1e1e1e', color: '#fff'
            });
            Toast.fire({ icon: 'success', title: 'Paket Dipilih!' });
        }, 300);
    };

    // --- PUBLIC API ---
    return {
        init: () => {
            window.addEventListener('load', Utils.hidePreloader);
            setTimeout(Utils.hidePreloader, 3000); 
            document.addEventListener('contextmenu', event => event.preventDefault());

            UI.loadParticles(); 
            UI.initSwiper(); 
            UI.renderServices();
            Features.startFakeNotif(); 
            Features.startCountdown(); 
            Features.exitIntent();
            ReferralSystem.init();

            // Fitur 1: Smart Form (Auto Fill WA)
            const savedWA = localStorage.getItem('user_wa');
            const inputWA = document.getElementById('inputWhatsapp');
            if (savedWA && inputWA) {
                inputWA.value = savedWA;
            }

            // Typing Effect
            if(typeof Typed !== 'undefined') {
                new Typed('#typing-text', {
                    strings: ['Followers IG', 'Likes TikTok', 'Branding Digital', 'Shopee Likes'],
                    typeSpeed: 50,
                    backSpeed: 30,
                    backDelay: 2000,
                    loop: true,
                    showCursor: false 
                });
            }

            // Tilt Effect
            if(typeof VanillaTilt !== 'undefined') {
                setTimeout(() => {
                    VanillaTilt.init(document.querySelectorAll(".price-card, .feature-card, .step-card"), {
                        max: 15, speed: 400, glare: true, "max-glare": 0.2, scale: 1.02
                    });
                }, 1000);
            }

            // AOS Animation
            if(typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 800,
                    once: true,
                    offset: 100,
                    easing: 'ease-out-cubic'
                });
                
            }
            RidhoStoreApp.initPWA();
            
        },
        // --- FITUR 1: PWA INSTALLER ---
        initPWA: () => {
            let deferredPrompt;
            const installBtn = document.getElementById('installAppBtn');

            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                if(installBtn) installBtn.style.display = 'inline-block';
            });

            if(installBtn) {
                installBtn.addEventListener('click', async () => {
                    if (deferredPrompt) {
                        deferredPrompt.prompt();
                        const { outcome } = await deferredPrompt.userChoice;
                        if (outcome === 'accepted') {
                            installBtn.style.display = 'none';
                        }
                        deferredPrompt = null;
                    }
                });
            }
        },

        // --- FITUR 2: DOWNLOAD STRUK GAMBAR ---
        downloadReceipt: () => {
            const receiptArea = document.querySelector('.live-receipt'); // Area yang mau difoto
            if(!receiptArea) return;

            // Efek visual loading
            Swal.fire({
                title: 'Mencetak Struk...',
                timerProgressBar: true,
                didOpen: () => { Swal.showLoading() },
                background: '#1e1e1e', color: '#fff'
            });

            html2canvas(receiptArea, {
                backgroundColor: '#1a1a1a', // Sesuaikan warna background struk
                scale: 2 // Supaya tajam (HD)
            }).then(canvas => {
                // Buat link download palsu
                const link = document.createElement('a');
                link.download = `Struk-RidhoStore-${Date.now()}.jpg`;
                link.href = canvas.toDataURL("image/jpeg");
                link.click();
                
                Swal.close();
                Swal.fire({ icon: 'success', title: 'Tersimpan!', text: 'Struk berhasil didownload.', background: '#1e1e1e', color: '#fff', toast: true, position: 'top' });
            });
        },
        selectCategory: OrderSystem.selectCategory,
        calcTotal: OrderSystem.calcTotal,
        submitOrder: OrderSystem.submitOrder,
        checkOrderStatus: OrderSystem.checkOrderStatus,
        applyPromo: OrderSystem.applyPromo,
        
        // Fitur 3: Live Search (Exposed)
        searchServices: () => {
            const input = document.getElementById('serviceSearch');
            const keyword = input ? input.value : '';
            UI.renderServices('all', keyword);
        },

        selectPayment: OrderSystem.selectPayment,
        selectCatalog: (e, cat, label) => {
            e.preventDefault();
            document.getElementById('catalogDropdownBtn').innerHTML = `<i class="bi bi-grid-fill me-2"></i> ${label}`;
            document.getElementById('service-container').style.display = 'grid';
            UI.renderServices(cat);
        },
        showServiceInfo: (name, desc) => {
            Swal.fire({
                title: name,
                html: `<div class="text-start small"><p class="mb-2">⚡ <strong>Deskripsi:</strong> ${desc}</p><p class="mb-2">📉 <strong>Drop Rate:</strong> Rendah (Low Drop)</p><p class="mb-0">👤 <strong>Tipe Akun:</strong> Campuran (Bot & Pasif)</p></div>`,
                icon: 'info', background: '#1e1e1e', color: '#fff', confirmButtonColor: '#FFD700', confirmButtonText: 'Oke, Paham'
            });
        },
        
        // --- BAGIAN YANG DIPERBAIKI ---
        preselectService: (cat, name) => {
            // 1. Scroll ke form order
            const orderSection = document.getElementById('order');
            orderSection.scrollIntoView({ behavior: 'smooth' });

            // 2. Klik kategori tab agar dropdown ke-reset sesuai kategori
            const selectorMap = { 'instagram': 0, 'tiktok': 1, 'shopee': 2 };
            const selectors = document.querySelectorAll('.selector-item');
            
            if(selectors[selectorMap[cat]]) {
                selectors[selectorMap[cat]].click();

                // 3. Tunggu sebentar sampai dropdown di-render ulang
                setTimeout(() => {
                    const select = document.getElementById('inputService');
                    // Pilih layanan yang spesifik
                    select.value = name;
                    
                    // Hitung total (jika ada quantity yg tertinggal, atau reset 0)
                    OrderSystem.calcTotal();

                    // Feedback Sukses
                    const Toast = Swal.mixin({
                        toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, background: '#1e1e1e', color: '#fff'
                    });
                    Toast.fire({ icon: 'success', title: 'Layanan Dipilih:', text: name });
                }, 300);
            }
        },
        // --- AKHIR BAGIAN YANG DIPERBAIKI ---

        openHistory: () => {
            HistoryManager.load();
            new bootstrap.Modal(document.getElementById('historyModal')).show();
        },
        clearHistory: HistoryManager.clear,
        reOrder: (serviceName, target) => {
             bootstrap.Modal.getInstance(document.getElementById('historyModal')).hide();
             document.getElementById('order').scrollIntoView({behavior: 'smooth'});
             setTimeout(() => {
                 document.getElementById('inputTarget').value = target;
                 Swal.fire({
                    icon: 'success',
                    title: 'Data Disalin!',
                    text: 'Silakan pilih kategori & layanan, lalu klik order.',
                    background: '#1e1e1e', color: '#fff', toast: true, position: 'top-end', timer: 3000
                 });
             }, 500);
        },
        sendToWA: OrderSystem.sendToWA,
        openReferral: ReferralSystem.showPanel,
        generateRefLink: ReferralSystem.generateLink,
        applyBundle: applyBundleInternal
    };
})();

// ... (Kode RidhoStoreApp di atas biarkan) ...

// INI BAGIAN PENTING DI BAWAH:
document.addEventListener("DOMContentLoaded", RidhoStoreApp.init);

// Force Expose ke Window agar Next.js bisa baca
if (typeof window !== 'undefined') {
    window.RidhoStoreApp = RidhoStoreApp;
    
    // Expose fungsi global lainnya untuk tombol-tombol HTML lama
    window.selectCategory = RidhoStoreApp.selectCategory;
    window.selectPayment = RidhoStoreApp.selectPayment; 
    window.calcTotal = RidhoStoreApp.calcTotal;
    window.submitOrder = RidhoStoreApp.submitOrder;
    window.checkOrderStatus = RidhoStoreApp.checkOrderStatus;
    window.applyPromo = RidhoStoreApp.applyPromo;
    window.searchServices = RidhoStoreApp.searchServices;
    window.selectCatalog = RidhoStoreApp.selectCatalog;
    window.sendToWA = RidhoStoreApp.sendToWA;
    window.applyBundle = RidhoStoreApp.applyBundle;
    
    window.copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        if(typeof Swal !== 'undefined') {
            Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Nomor tersalin: ' + text, timer: 1500, showConfirmButton: false, background: '#1e1e1e', color: '#fff', toast: true, position: 'top-end' });
        }
    };
}