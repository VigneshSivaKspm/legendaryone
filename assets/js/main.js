(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  document.addEventListener("DOMContentLoaded", () => {
    console.log('DOMContentLoaded event fired');
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

    if (mobileNavToggleBtn) {
      console.log('Mobile nav toggle button found');
      function mobileNavToogle() {
        document.querySelector('body').classList.toggle('mobile-nav-active');
        mobileNavToggleBtn.classList.toggle('bi-list');
        mobileNavToggleBtn.classList.toggle('bi-x');
      }

      mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
    } else {
      console.warn("Mobile nav toggle button not found in the DOM.");
    }
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);

          // Check if there's a waiting service worker
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            console.log('A waiting service worker is found and SKIP_WAITING is triggered.');
          }

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('A new service worker is being installed.');

            newWorker.addEventListener('statechange', () => {
              console.log('Service worker state changed to:', newWorker.state);

              // When a new service worker has been installed
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Inform user about the new version
                alert('A new version of the site is available. Refreshing...');

                console.log('New service worker installed. Page will refresh now.');

                // Force the service worker to take control and update the page without clearing the cache
                newWorker.postMessage({ type: 'SKIP_WAITING' });
              }
            });
          });

          // Listen for the "SKIP_WAITING" message to immediately activate the service worker
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'SKIP_WAITING') {
              console.log('Received SKIP_WAITING message from service worker');
              // Force a page refresh to get the latest updates
              window.location.reload();
            }
          });
        }).catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
      });
    } else {
      console.error('Service Worker is not supported in this browser.');
    }


    /**
     * Lazy load images and iframes
     */
    const lazyImages = document.querySelectorAll("img[loading='lazy']");
    const lazyIframes = document.querySelectorAll("iframe[loading='lazy']");

    const lazyLoad = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          element.src = element.dataset.src;
          element.classList.add("loaded");
          observer.unobserve(element);
        }
      });
    };

    const observer = new IntersectionObserver(lazyLoad, {
      rootMargin: "0px 0px 200px 0px"
    });

    lazyImages.forEach(image => {
      observer.observe(image);
    });

    lazyIframes.forEach(iframe => {
      observer.observe(iframe);
    });

  });

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
      filters.addEventListener('click', function () {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();


  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Scroll progress bar
   */
  const progressBar = document.createElement('div');
  progressBar.id = 'progress-bar';
  document.body.appendChild(progressBar);

  function updateProgressBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateProgressBar);
  window.addEventListener('load', updateProgressBar);

  document.addEventListener("DOMContentLoaded", () => {
    const logoParts = document.querySelectorAll(".logo-part");
    const dynamicText = document.getElementById("dynamic-text");
    const tagline = document.getElementById("tagline");

    // Array of texts to display
    const texts = ["Key To The", "Infinite", "Innovations", "Legendary One"];

    let delay = 0;

    // Animate each logo part and display text
    logoParts.forEach((part, index) => {
      setTimeout(() => {
        // Animate the current logo part
        part.style.animation = "logo-appear 1s ease forwards";

        // Update text dynamically
        dynamicText.textContent = texts[index];
        dynamicText.style.opacity = "0";
        dynamicText.style.animation = "text-fade 1s ease forwards";

        // On the last part, show company name
        if (index === 3) {
          dynamicText.textContent = "Legendary One";
        }

        // Show tagline after the last part
        if (index === logoParts.length - 1) {
          setTimeout(() => {
            tagline.style.animation = "text-fade 1s ease forwards";
          }, 1000);
        }
      }, delay);

      delay += 1500; // Delay between each part
    });

    // Theme toggle functionality
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
      document.documentElement.setAttribute('data-theme', currentTheme);

      if (currentTheme === 'light') {
        toggleSwitch.checked = true;
      }
    }

    function switchTheme(e) {
      if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    }

    toggleSwitch.addEventListener('change', switchTheme, false);
  });


})();