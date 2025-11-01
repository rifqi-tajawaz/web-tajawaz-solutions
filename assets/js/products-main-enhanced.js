/**
 * Enhanced Products Main JavaScript - Tajawaz Solutions (Product Digital)
 * Professional & Modern with smooth interactions
 * Handle filtering, searching, and rendering products with animations
 */

document.addEventListener('DOMContentLoaded', function() {
  // Configuration
  const PRODUCTS_PER_PAGE = 9;
  let currentPage = 1;
  let currentFilter = 'Semua';
  let currentSearch = '';
  
  // DOM Elements
  const productsContainer = document.getElementById('products-digital-container');
  const filterButtons = document.querySelectorAll('[data-filter]');
  const searchInput = document.getElementById('product-digital-search');
  const loadMoreBtn = document.getElementById('load-more-btn-product-digital');
  const resultsCount = document.getElementById('results-count-product-digital');
  
  // Initialize
  init();
  
  function init() {
    renderProducts();
    setupFilters();
    setupSearch();
    setupLoadMore();
    addScrollAnimations();
  }
  
  /**
   * Render products based on filters with smooth animations
   */
  function renderProducts() {
    if (!productsContainer) return;
    
    // Get filtered products
    let filteredProducts = filterProducts();
    
    // Calculate pagination
    const startIndex = 0;
    const endIndex = currentPage * PRODUCTS_PER_PAGE;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    const hasMore = endIndex < filteredProducts.length;
    
    // Update results count with animation
    if (resultsCount) {
      resultsCount.style.opacity = '0';
      setTimeout(() => {
        resultsCount.textContent = `Menampilkan ${productsToShow.length} dari ${filteredProducts.length} produk`;
        resultsCount.style.transition = 'opacity 0.3s ease';
        resultsCount.style.opacity = '1';
      }, 150);
    }
    
    // Fade out animation
    productsContainer.style.opacity = '0';
    productsContainer.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
      // Clear container
      productsContainer.innerHTML = '';
      
      // Render products
      if (productsToShow.length === 0) {
        productsContainer.innerHTML = `
          <div class="no-results-product-digital animate-fade-in" data-testid="no-results-product-digital">
            <i class="fa-solid fa-box-open"></i>
            <h4>Tidak Ada Produk Ditemukan</h4>
            <p>Coba ubah filter atau kata kunci pencarian</p>
          </div>
        `;
      } else {
        productsToShow.forEach((product, index) => {
          const productCard = createProductCard(product, index);
          productsContainer.innerHTML += productCard;
        });
        
        // Add hover and click interactions after render
        setTimeout(() => {
          addCardInteractions();
        }, 100);
      }
      
      // Fade in animation
      productsContainer.style.opacity = '1';
      
      // Update load more button
      if (loadMoreBtn) {
        if (hasMore) {
          loadMoreBtn.style.display = 'inline-flex';
          const remainingCount = filteredProducts.length - endIndex;
          loadMoreBtn.innerHTML = `
            <span class="btn-title">
              <span>Tampilkan Lebih Banyak (${remainingCount})</span>
            </span>
            <span class="icon-circle">
              <i class="fa-solid fa-arrow-down"></i>
            </span>
          `;
        } else {
          loadMoreBtn.style.display = 'none';
        }
      }
    }, 300);
  }
  
  /**
   * Filter products based on category and search
   */
  function filterProducts() {
    let filtered = [...productsData];
    
    // Filter by category
    if (currentFilter !== 'Semua') {
      filtered = filtered.filter(p => p.category === currentFilter);
    }
    
    // Filter by search
    if (currentSearch) {
      const searchLower = currentSearch.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    return filtered;
  }
  
  /**
   * Create enhanced product card HTML with animations
   */
  function createProductCard(product, index) {
    const badgeHTML = product.badge ? 
      `<span class="product-digital-badge" data-testid="product-digital-badge-${product.id}">${product.badge}</span>` : '';
    
    const originalPriceHTML = product.originalPrice ?
      `<span class="original-price" data-testid="product-digital-original-price-${product.id}">${product.originalPrice}</span>` : '';
    
    // Animation delay for stagger effect
    const delay = (index % 9) * 0.1;
    
    return `
      <div class="product-digital-card animate-fade-in" 
           data-testid="product-digital-card-${product.id}" 
           data-product-id="${product.id}"
           style="animation-delay: ${delay}s;">
        ${badgeHTML}
        <div class="product-digital-image">
          <img 
            src="${product.image}" 
            alt="${product.title}" 
            loading="lazy"
            width="600"
            height="400"
            data-testid="product-digital-image-${product.id}"
          >
        </div>
        <div class="product-digital-content">
          <div class="product-digital-category" data-category="${product.category}" data-testid="product-digital-category-${product.id}">
            ${product.category}
          </div>
          <h4 data-testid="product-digital-title-${product.id}">${product.title}</h4>
          <p data-testid="product-digital-description-${product.id}">${product.description}</p>
          <div class="product-digital-footer">
            <div class="product-digital-price" data-testid="product-digital-price-${product.id}">
              ${originalPriceHTML}
              <span class="current-price" data-testid="product-digital-current-price-${product.id}">${product.price}</span>
            </div>
            <a href="${product.link}" 
               class="btn" 
               data-testid="product-digital-cta-${product.id}" 
               aria-label="Lihat detail ${product.title}">
              <span>Lihat Detail</span>
              <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Add card interactions (hover effects, click analytics, etc.)
   */
  function addCardInteractions() {
    const cards = document.querySelectorAll('.product-digital-card');
    
    cards.forEach(card => {
      // Add magnetic effect on mouse move
      card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        const rotateX = deltaY * 3;
        const rotateY = deltaX * 3;
        
        card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
      });
      
      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
      });
      
      // Add ripple effect on click
      card.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') return; // Don't trigger on button click
        
        const ripple = document.createElement('span');
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(95, 45, 237, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        card.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
    
    // Add ripple animation style
    if (!document.getElementById('ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  /**
   * Setup filter buttons with smooth transitions
   */
  function setupFilters() {
    filterButtons.forEach(btn => {
      // Use both click and touchend for better iOS support
      const handleFilterClick = function(e) {
        // Prevent double-firing on iOS
        if (e.type === 'touchend') {
          e.preventDefault();
        }
        
        // Add click animation
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
          btn.style.transform = '';
        }, 150);
        
        // Update active state with animation
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-pressed', 'true');
        
        // Update filter
        currentFilter = this.getAttribute('data-filter');
        currentPage = 1; // Reset pagination
        
        // Re-render with animation
        renderProducts();
        
        // Optional: Log analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'filter_products', {
            'filter_category': currentFilter
          });
        }
      };
      
      // Add both event listeners for iOS compatibility
      btn.addEventListener('click', handleFilterClick);
      btn.addEventListener('touchend', handleFilterClick, { passive: false });
    });
  }
  
  /**
   * Setup search functionality with debounce
   */
  function setupSearch() {
    if (!searchInput) return;
    
    let searchTimeout;
    
    // Add loading indicator
    const searchWrapper = searchInput.parentElement;
    
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      
      // Show loading state
      searchWrapper.classList.add('searching');
      
      searchTimeout = setTimeout(() => {
        currentSearch = this.value.trim();
        currentPage = 1; // Reset pagination
        renderProducts();
        
        // Remove loading state
        searchWrapper.classList.remove('searching');
        
        // Optional: Log analytics
        if (typeof gtag !== 'undefined' && currentSearch) {
          gtag('event', 'search_products', {
            'search_term': currentSearch
          });
        }
      }, 300); // Debounce 300ms
    });
    
    // Add clear button functionality if exists
    const clearBtn = document.querySelector('[data-clear-search]');
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        currentSearch = '';
        currentPage = 1;
        renderProducts();
      });
    }
  }
  
  /**
   * Setup load more button with animation
   */
  function setupLoadMore() {
    if (!loadMoreBtn) return;
    
    // iOS-compatible event handler
    const handleLoadMore = function(e) {
      // Prevent double-firing on iOS
      if (e.type === 'touchend') {
        e.preventDefault();
      }
      
      // Add loading animation
      const originalHTML = loadMoreBtn.innerHTML;
      loadMoreBtn.innerHTML = `
        <span class="btn-title">
          <span>Memuat...</span>
        </span>
        <span class="icon-circle">
          <i class="fa-solid fa-spinner fa-spin"></i>
        </span>
      `;
      loadMoreBtn.disabled = true;
      
      // Simulate loading delay for smooth UX
      setTimeout(() => {
        currentPage++;
        renderProducts();
        loadMoreBtn.disabled = false;
        
        // Scroll to new products with iOS-compatible scrolling
        setTimeout(() => {
          const allProducts = document.querySelectorAll('.product-digital-card');
          if (allProducts.length > 0) {
            const lastVisibleIndex = Math.min((currentPage - 1) * PRODUCTS_PER_PAGE, allProducts.length - 1);
            // Use scrollIntoView with iOS-safe options
            allProducts[lastVisibleIndex].scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
          }
        }, 400);
        
        // Optional: Log analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'load_more_products', {
            'page': currentPage
          });
        }
      }, 500);
    };
    
    loadMoreBtn.addEventListener('click', handleLoadMore);
    loadMoreBtn.addEventListener('touchend', handleLoadMore, { passive: false });
  }
  
  /**
   * Add scroll-triggered animations for sections
   */
  function addScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      observer.observe(section);
    });
  }
  
  /**
   * Add smooth scroll behavior for anchor links
   */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
  
  /**
   * Initialize lazy loading for images (if not already handled)
   */
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.src; // Trigger loading
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
  }
  
  /**
   * Performance optimization: Debounce window resize
   */
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Re-calculate card positions if needed
      console.log('Window resized, recalculating layout...');
    }, 250);
  });
  
  /**
   * Add keyboard navigation support
   */
  document.addEventListener('keydown', function(e) {
    // Navigate filters with arrow keys
    if (e.target.classList.contains('filter-btn-product-digital')) {
      const buttons = Array.from(filterButtons);
      const currentIndex = buttons.indexOf(e.target);
      
      if (e.key === 'ArrowRight' && currentIndex < buttons.length - 1) {
        e.preventDefault();
        buttons[currentIndex + 1].focus();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        buttons[currentIndex - 1].focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.target.click();
      }
    }
  });
  
  // Log initialization
  console.log('Enhanced Products Page Initialized ✨');
});
