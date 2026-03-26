document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Chế độ Sáng/Tối (Lưu LocalStorage)
    const themeToggleBtn = document.getElementById("theme-toggle");
    const body = document.body;
    
    if (localStorage.getItem("theme") === "dark") {
        body.setAttribute("data-theme", "dark");
        themeToggleBtn.textContent = "☀️";
    }

    themeToggleBtn.addEventListener("click", () => {
        if (body.getAttribute("data-theme") === "dark") {
            body.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");
            themeToggleBtn.textContent = "🌙";
        } else {
            body.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
            themeToggleBtn.textContent = "☀️";
        }
    });

    // 2. Ẩn/Hiện Header khi cuộn
    const header = document.getElementById("main-header");
    let lastScrollTop = 0;

    window.addEventListener("scroll", () => {
        let currentScroll = window.scrollY || document.documentElement.scrollTop;
        if (currentScroll > lastScrollTop && currentScroll > 400) {
            header.classList.add("hidden-up"); 
        } else {
            header.classList.remove("hidden-up"); 
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });

    // 3. Hiệu ứng Scroll Reveal
    const reveals = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                revealObserver.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    reveals.forEach(reveal => revealObserver.observe(reveal));

    // 4. Modal Zoom Ảnh (Khóa History API an toàn)
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.getElementById("close-modal");
    const zoomableImages = document.querySelectorAll(".zoomable-img");
    let isModalOpen = false;

    zoomableImages.forEach(img => {
        img.addEventListener("click", () => {
            modalImg.src = img.src;
            modal.classList.add("active");
            isModalOpen = true;
            window.history.pushState({ modalOpen: true }, "");
        });
    });

    window.addEventListener("popstate", () => {
        if (isModalOpen) {
            modal.classList.remove("active");
            isModalOpen = false;
        }
    });

    function requestCloseModal() {
        if (isModalOpen) {
            window.history.back(); 
        }
    }

    closeBtn.addEventListener("click", requestCloseModal);
    
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            requestCloseModal();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isModalOpen) {
            e.preventDefault();
            requestCloseModal();
        }
    });

    // 5. Nút Lên Đầu Trang
    const backToTopBtn = document.getElementById("back-to-top");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // 6. ScrollSpy (Highlight menu chuẩn xác)
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".scrollable-nav a");

    window.addEventListener("scroll", () => {
        let current = "";
        const scrollPosition = window.scrollY + 150; 

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((a) => {
            a.classList.remove("active-link");
            if (current !== "" && a.getAttribute("href").includes(current)) {
                a.classList.add("active-link");
            }
        });
    });

    // 7. Tự điều khiển Scroll mượt (Sửa lỗi giật chớp trang)
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            const targetId = this.getAttribute("href");
            
            if(targetId && targetId.startsWith("#") && targetId.length > 1) {
                e.preventDefault(); 
                
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offsetTop = targetSection.getBoundingClientRect().top + window.scrollY - 100;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: "smooth"
                    });
                }
            }
        });
    });
});
