// BUNGKUS KE DALAM FUNGSI 1
function headerInteraction(){
  // NAVBAR SEARCH
  const searchToggle = document.getElementById("searchToggle");
  const navSearch = document.querySelector(".nav-search");
  const navInput = document.getElementById("navSearchInput");
  const logo = document.getElementById("logo");
  
  if (searchToggle) {
    searchToggle.addEventListener("click", () => {
      navSearch.classList.toggle("active");
      logo.classList.toggle("hidden");
      navInput.focus();
    });
  }
  
  if (navInput) {
    navInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const keyword = navInput.value.trim();
        if (keyword !== "") {
          window.location.href = `katalog.html?search=${encodeURIComponent(keyword)}`;
        }
      }
    });
  }
  
  // DEFAULT ACTIVE 
  const firstLink = document.querySelector('nav a[data-section="beranda"]');
  const currentPage = window.location.pathname.split("/").pop();
  if (firstLink && (currentPage === "index.html" || currentPage === "")) {
    firstLink.classList.add("active");
  }
  
  // HAMBURGER
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.querySelector(".menu");
  
  if (hamburger) {
      hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
      });  
  }
}

// KATALOG (Aman)
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const cards = document.querySelectorAll(".card-katalog");
  const filterButtons = document.querySelectorAll(".filter-btn");
  let activeFilter = "all";

  function applyFilter() {
    if (!searchInput) return;
    const keyword = searchInput.value.toLowerCase();
    cards.forEach(card => {
      const category = card.dataset.category;
      const text = card.innerText.toLowerCase();
      const matchSearch = text.includes(keyword);
      const matchFilter = activeFilter === "all" || category === activeFilter;
      card.style.display = (matchSearch && matchFilter) ? "block" : "none";
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilter);
  }

  filterButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      filterButtons.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      activeFilter = this.dataset.filter;
      applyFilter();
    });
  });

  const urlParams = new URLSearchParams(window.location.search);
  const searchFromURL = urlParams.get("search");
  const categoryFromURL = urlParams.get("category");

  if (searchFromURL && searchInput) {
    searchInput.value = searchFromURL.toLowerCase();
  }

  if (categoryFromURL) {
    activeFilter = categoryFromURL;
    filterButtons.forEach(btn => {
      if (btn.dataset.filter === categoryFromURL) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }
  applyFilter();
});

// BUNGKUS SCROLLSPY KE DALAM FUNGSI 2
function initScrollSpy() {
  const currentPage = window.location.pathname.split("/").pop();

  if (currentPage === "index.html" || currentPage === "") {
    if (window.innerWidth > 1024) { 
        const sections = document.querySelectorAll("section");
        const navLinks = document.querySelectorAll("nav a");
        let isClicking = false;

        navLinks.forEach(link => {
          link.addEventListener("click", function () {
            isClicking = true;
            navLinks.forEach(l => l.classList.remove("active"));
            this.classList.add("active");
            setTimeout(() => { isClicking = false; }, 500);
          });
        });
        
        window.addEventListener("scroll", () => {
          if (isClicking) return; // Cegah lompat saat menu diklik
          
          let current = "";
          if (window.scrollY < 100) {
            current = "beranda";
          } else {
            sections.forEach(section => {
              const sectionTop = section.offsetTop - 150;
              if (window.scrollY >= sectionTop) {
                current = section.getAttribute("id");
              }
            });
          }
        
          navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.dataset.section === current) {
              link.classList.add("active");
            }
          });
        }); 
    }
  }
}

// Denah Interaktif
document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil elemen-elemen yang kita butuhkan dari HTML
    const tooltip = document.getElementById('desktop-tooltip');
    const infoCard = document.getElementById('mobile-info-card');
    const infoTitle = document.getElementById('info-title');
    const infoCategory = document.getElementById('info-category');
    const btnClose = document.getElementById('info-close');
    
    // 2. Ambil semua elemen SVG yang sudah diberi class
    const lapakElements = document.querySelectorAll('.lapak-sayur-buah-dan-jajanan, .lapak-olahan-dan-jajanan, .lapak-non-halal, .lapak-basah, .lapak-kuliner, .kios-besar, .kios-kecil, .kios-fnb, .atm, .mushola, .area-pengelola, .toilet');

    // Fungsi kecil untuk membersihkan format ID (Contoh: "sayur-1" jadi "Sayur 1")
    function formatText(text) {
        if (!text) return "Tanpa Nama";
        return text.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // 3. Pasang "telinga" (Event Listener) ke setiap lapak
    lapakElements.forEach(lapak => {
        
        // HOVER (DESKTOP)
        // ---- A. LOGIKA HOVER (DESKTOP) ----
        lapak.addEventListener('mouseenter', () => {
            // Ambil data nama dan kategori (sama seperti logika klik)
            const namaLapak = formatText(lapak.id);
            const kategoriLapak = formatText(lapak.getAttribute('class'));

            // Masukkan struktur HTML ke dalam tooltip
            tooltip.innerHTML = `
                <div class="tooltip-title">${namaLapak}</div>
                <div class="tooltip-category">Kategori: ${kategoriLapak}</div>
            `;
            
            tooltip.style.opacity = '1'; // Munculkan pop-up
        });

        lapak.addEventListener('mousemove', (e) => {
            // Buat tooltip mengikuti posisi kursor (ditambah 15px agar tidak menabrak kursor)
            tooltip.style.left = (e.pageX + 15) + 'px';
            tooltip.style.top = (e.pageY + 15) + 'px';
        });

        lapak.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });


        // KLIK (HYBRID: DESKTOP & MOBILE) ----
        lapak.addEventListener('click', (e) => {
            // Sembunyikan tooltip agar tidak mengganggu (terutama di layar sentuh)
            tooltip.style.opacity = '0'; 

            // Ambil data lapak yang diklik
            const namaLapak = formatText(lapak.id);
            const kategoriLapak = formatText(lapak.className);

            // Masukkan data ke dalam Info Card
            infoTitle.textContent = namaLapak;
            infoCategory.textContent = "Kategori: " + kategoriLapak;
            
            // Munculkan panel Info Card dengan menambahkan class 'show'
            infoCard.classList.add('show');
        });
    });

    // 4. Menutup Info Card
    btnClose.addEventListener('click', () => {
        infoCard.classList.remove('show');
    });
    
    // 5. FILTER KATEGORI
    const filterButtons = document.querySelectorAll('.btn-filter');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. Hapus status 'active' dari semua tombol, lalu aktifkan tombol yang sedang diklik
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
    
            // 2. Baca kategori apa yang diminta dari atribut 'data-filter'
            const targetFilter = btn.getAttribute('data-filter');
    
            // 3. Seleksi semua lapak
            lapakElements.forEach(lapak => {
                if (targetFilter === 'all') {
                    // Jika klik "Semua", hilangkan efek redup di semua lapak
                    lapak.classList.remove('lapak-dimmed');
                } else {
                    // Jika class lapak cocok dengan filter yang diklik, terangkan. 
                    // Jika tidak cocok, redupkan!
                    if (lapak.classList.contains(targetFilter)) {
                        lapak.classList.remove('lapak-dimmed');
                    } else {
                        lapak.classList.add('lapak-dimmed');
                    }
                }
            });
        });
    });

    // ZOOM
    const svgMap = document.querySelector('.denah-container svg');
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const btnZoomReset = document.getElementById('btn-zoom-reset');

    // Nilai awal zoom (1 = 100%)
    let currentScale = 1;
    const scaleStep = 0.3; // Seberapa besar zoom setiap klik
    const maxScale = 3;    // Maksimal perbesaran (300%)
    const minScale = 0.5;  // Maksimal pengecilan (50%)

    // Fungsi untuk menerapkan zoom ke CSS
    function applyZoom() {
        svgMap.style.transform = `scale(${currentScale})`;
    }

    // Tombol Perbesar
    btnZoomIn.addEventListener('click', () => {
        if (currentScale < maxScale) {
            currentScale += scaleStep;
            applyZoom();
        }
    });

    // Tombol Perkecil
    btnZoomOut.addEventListener('click', () => {
        if (currentScale > minScale) {
            currentScale -= scaleStep;
            applyZoom();
        }
    });

    // Tombol Reset
    btnZoomReset.addEventListener('click', () => {
        currentScale = 1;
        applyZoom();
        
        // Pilihan tambahan: Kembalikan scroll ke pojok kiri atas
        const container = document.querySelector('.denah-container');
        if(container) {
            container.scrollTop = 0;
            container.scrollLeft = 0;
        }
    });
});