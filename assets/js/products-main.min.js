/**
 * Products Main JavaScript - Tajawaz Solutions (Product Digital)
 * Handle filtering, searching, and rendering products
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
  }
  
  /**
   * Render products based on filters
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
    
    // Update results count
    if (resultsCount) {
      resultsCount.textContent = `Menampilkan ${productsToShow.length} dari ${filteredProducts.length} produk`;
    }
    
    // Clear container
    productsContainer.innerHTML = '';
    
    // Render products
    if (productsToShow.length === 0) {
      productsContainer.innerHTML = `
        <div class="no-results-product-digital" data-testid="no-results-product-digital">
          <i class="fa-solid fa-box-open"></i>
          <h4>Tidak Ada Produk Ditemukan</h4>
          <p>Coba ubah filter atau kata kunci pencarian</p>
        </div>
      `;
    } else {
      productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.innerHTML += productCard;
      });
    }
    
    // Update load more button
    if (loadMoreBtn) {
      if (hasMore) {
        loadMoreBtn.style.display = 'inline-block';
        loadMoreBtn.textContent = `Muat Lebih Banyak (${filteredProducts.length - endIndex} produk lagi)`;
      } else {
        loadMoreBtn.style.display = 'none';
      }
    }
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
   * Create product card HTML
   */
  function createProductCard(product) {
    const badgeHTML = product.badge ? 
      `<span class="product-digital-badge" data-testid="product-digital-badge-${product.id}">${product.badge}</span>` : '';
    
    const originalPriceHTML = product.originalPrice ?
      `<span class="original-price" data-testid="product-digital-original-price-${product.id}">${product.originalPrice}</span>` : '';
    
    return `
      <div class="product-digital-card" data-testid="product-digital-card-${product.id}" data-product-id="${product.id}" style="display: flex; flex-direction: column;">
        ${badgeHTML}
        <div class="product-digital-image" style="position: relative; flex-shrink: 0;">
          <img 
            src="${product.image}" 
            alt="${product.title}" 
            loading="lazy"
            width="600"
            height="400"
            data-testid="product-digital-image-${product.id}"
            style="display: block; width: 100%; height: 100%; object-fit: cover;"
          >
        </div>
        <div class="product-digital-content" style="display: flex; flex-direction: column; flex: 1; padding: 1.25rem; position: relative; z-index: 2;">
          <div class="product-digital-category" data-testid="product-digital-category-${product.id}" style="display: inline-block;">${product.category}</div>
          <h4 data-testid="product-digital-title-${product.id}" style="display: block;">${product.title}</h4>
          <p data-testid="product-digital-description-${product.id}" style="display: block;">${product.description}</p>
          <div class="product-digital-footer" style="display: block; margin-top: auto;">
            <div class="product-digital-price" data-testid="product-digital-price-${product.id}" style="display: flex; align-items: center;">
              ${originalPriceHTML}
              <span class="current-price" data-testid="product-digital-current-price-${product.id}" style="display: inline-block;">${product.price}</span>
            </div>
            <a href="${product.link}" class="btn" data-testid="product-digital-cta-${product.id}" aria-label="Lihat detail ${product.title}" style="display: flex;">
              <span>Lihat Detail</span>
              <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Setup filter buttons
   */
  function setupFilters() {
    filterButtons.forEach(btn => {
      // Use both click and touchend for better iOS support
      const handleFilterClick = function(e) {
        // Prevent double-firing on iOS
        if (e.type === 'touchend') {
          e.preventDefault();
        }
        
        // Update active state
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-pressed', 'true');
        
        // Update filter
        currentFilter = this.getAttribute('data-filter');
        currentPage = 1; // Reset pagination
        
        // Re-render
        renderProducts();
      };
      
      // Add both event listeners for iOS compatibility
      btn.addEventListener('click', handleFilterClick);
      btn.addEventListener('touchend', handleFilterClick, { passive: false });
    });
  }
  
  /**
   * Setup search functionality
   */
  function setupSearch() {
    if (!searchInput) return;
    
    let searchTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentSearch = this.value.trim();
        currentPage = 1; // Reset pagination
        renderProducts();
      }, 300); // Debounce 300ms
    });
  }
  
  /**
   * Setup load more button
   */
  function setupLoadMore() {
    if (!loadMoreBtn) return;
    
    // iOS-compatible event handler
    const handleLoadMore = function(e) {
      // Prevent double-firing on iOS
      if (e.type === 'touchend') {
        e.preventDefault();
      }
      
      currentPage++;
      renderProducts();
      
      // Scroll to new products with iOS-compatible scrolling
      setTimeout(() => {
        const allProducts = document.querySelectorAll('.product-card');
        if (allProducts.length > 0) {
          const lastVisibleIndex = Math.min((currentPage - 1) * PRODUCTS_PER_PAGE, allProducts.length - 1);
          // Use scrollIntoView with iOS-safe options
          allProducts[lastVisibleIndex].scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 100);
    };
    
    loadMoreBtn.addEventListener('click', handleLoadMore);
    loadMoreBtn.addEventListener('touchend', handleLoadMore, { passive: false });
  }
});
