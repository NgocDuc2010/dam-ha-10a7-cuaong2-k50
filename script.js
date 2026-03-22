document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. CHẾ ĐỘ TỐI (DARK MODE) ---
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
    } catch (err) {}

    // --- 2. HIỆU ỨNG HIỆN DẦN (SCROLL REVEAL) ---
    try {
        const reveals = document.querySelectorAll('.reveal');
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        obs.unobserve(entry.target); // Chạy 1 lần cho mượt
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

    // --- 3. MENU ẨN HIỆN & NÚT LÊN ĐẦU ---
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
    } catch (err) {}

    // --- 4. PHÓNG TO ẢNH (LIGHTBOX DOM-API THUẦN) ---
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
            }
        }

        function closeLightbox() {
            if (lbOverlay) {
                lbOverlay.classList.remove('show');
                document.body.classList.remove('no-scroll');
                setTimeout(() => { if(lbImage) lbImage.src = ''; }, 300);
            }
        }

        images.forEach(img => {
            img.addEventListener('click', function() { openLightbox(this.src, this.alt); });
        });

        if (lbClose) lbClose.addEventListener('click', closeLightbox);
        if (lbOverlay) lbOverlay.addEventListener('click', (e) => { if (e.target === lbOverlay) closeLightbox(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' || e.key === 'Esc') closeLightbox(); });
    } catch (err) {}
    
});

