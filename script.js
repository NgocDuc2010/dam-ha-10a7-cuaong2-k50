document.addEventListener('DOMContentLoaded', function() {
    
    // =========================================================
    // 1. CHẾ ĐỘ TỐI (DARK MODE)
    // =========================================================
    try {
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            document.documentElement.classList.remove('dark-mode-init');
            
            let isDark = false;
            try { isDark = localStorage.getItem('theme') === 'dark'; } catch(e){}
            if (isDark) document.body.classList.add('dark-mode');
            themeBtn.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';

            themeBtn.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');
                const nowDark = document.body.classList.contains('dark-mode');
                this.innerHTML = nowDark ? '☀️' : '🌙';
                try { localStorage.setItem('theme', nowDark ? 'dark' : 'light'); } catch(e){}
            });
        }
    } catch (err) { console.warn("Lỗi Theme"); }

    // =========================================================
    // 2. HIỆU ỨNG HIỆN DẦN (SCROLL REVEAL)
    // =========================================================
    try {
        const reveals = document.querySelectorAll('.reveal');
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        obs.unobserve(entry.target); // Chạy mượt 1 lần, chống giật
                    }
                });
            }, { threshold: 0.15 });
            
            reveals.forEach(el => observer.observe(el));
        } else {
            reveals.forEach(el => el.classList.add('active'));
        }
    } catch (err) {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    }

    // =========================================================
    // 3. CUỘN TRANG (MENU ẨN HIỆN & NÚT LÊN ĐẦU)
    // =========================================================
    try {
        const nav = document.getElementById('navbar');
        const btt = document.getElementById('back-to-top');
        let lastScrollY = window.scrollY || document.documentElement.scrollTop;
        let ticking = false;

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    const currentY = window.scrollY || document.documentElement.scrollTop;
                    
                    if (nav) {
                        if (currentY > lastScrollY && currentY > 150) nav.style.transform = 'translateY(-100%)';
                        else nav.style.transform = 'translateY(0)';
                    }
                    lastScrollY = currentY;

                    if (btt) {
                        if (currentY > 400) btt.classList.add('show');
                        else btt.classList.remove('show');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });

        if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    } catch (err) { console.warn("Lỗi Scroll"); }

    // =========================================================
    // 4. PHÓNG TO ẢNH ĐỈNH CAO (HỖ TRỢ MOBILE BACK & ESC KEY)
    // =========================================================
    try {
        const lbOverlay = document.getElementById('lightbox-overlay');
        const lbImage = document.getElementById('lightbox-image');
        const lbClose = document.getElementById('close-lightbox');
        const images = document.querySelectorAll('.zoom-img');

        function openLightbox(src, alt) {
            if (lbOverlay && lbImage) {
                lbImage.src = src;
                lbImage.alt = alt || '';
                lbOverlay.classList.add('show');
                document.body.classList.add('no-scroll');
                
                // Thủ thuật dùng Hash URL để bắt nút Back trên điện thoại
                try { window.location.hash = 'zoom'; } catch(e) {}
            }
        }

        function closeLightboxUI() {
            if (lbOverlay) {
                lbOverlay.classList.remove('show');
                document.body.classList.remove('no-scroll');
                setTimeout(() => { if(lbImage) lbImage.src = ''; }, 300);
            }
        }

        function requestCloseLightbox() {
            if (window.location.hash === '#zoom') {
                try { window.history.back(); } catch(e) { window.location.hash = ''; closeLightboxUI(); }
            } else {
                closeLightboxUI();
            }
        }

        // Bắt sự kiện Hash URL (Khi bấm nút Back ĐT)
        window.addEventListener('hashchange', function() {
            if (window.location.hash !== '#zoom') closeLightboxUI();
        });

        images.forEach(img => {
            img.addEventListener('click', function() { openLightbox(this.src, this.alt); });
        });

        if (lbClose) lbClose.addEventListener('click', requestCloseLightbox);
        if (lbOverlay) lbOverlay.addEventListener('click', (e) => { if (e.target === lbOverlay) requestCloseLightbox(); });
        
        // Bắt đa dạng phím ESC (Chống lỗi giả lập)
        document.addEventListener('keydown', (e) => { 
            if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) requestCloseLightbox(); 
        });

    } catch (err) { console.warn("Lỗi Lightbox"); }
    
});
