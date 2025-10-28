// Search page functionality
document.addEventListener('DOMContentLoaded', () => {
    initSearchPage();
    initFiltering();
    initAOS();
    displayDate();
    initMobileMenu();
});

// Display current date and time with auto-update
function displayDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        function updateDateTime() {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
            };
            const dateString = now.toLocaleDateString('en-US', options);
            const timeString = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            });
            
            // Display date with time
            dateElement.textContent = `${dateString} - ${timeString}`;
        }
        
        // Initial update
        updateDateTime();
        
        // Update every second
        setInterval(updateDateTime, 1000);
    }
}

// Mobile menu toggle
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// Initialize AOS
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
}

// Initialize search page
function initSearchPage() {
    // Get search query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    
    const mainSearchInput = document.getElementById('main-search-input');
    const searchInput = document.getElementById('search-input');
    const searchQueryDisplay = document.getElementById('search-query-display');
    
    // Set search inputs to query value
    if (searchQuery) {
        if (mainSearchInput) mainSearchInput.value = searchQuery;
        if (searchInput) searchInput.value = searchQuery;
        if (searchQueryDisplay) {
            searchQueryDisplay.textContent = `Search results for: "${searchQuery}"`;
        }
        
        // Perform search
        performSearch(searchQuery);
    } else {
        if (searchQueryDisplay) {
            searchQueryDisplay.textContent = 'Browse all articles';
        }
        updateResultsCount();
    }
    
    // Handle search form submission
    const mainSearchForm = document.getElementById('main-search-form');
    if (mainSearchForm) {
        mainSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = mainSearchInput.value.trim();
            if (query) {
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            }
        });
    }
    
    // Handle header search
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            }
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                }
            }
        });
    }
}

// Perform search
function performSearch(query) {
    const articleCards = document.querySelectorAll('.article-card');
    const noResults = document.getElementById('no-results');
    const resultsContainer = document.getElementById('search-results-container');
    let visibleCount = 0;
    
    const searchTerm = query.toLowerCase();
    
    articleCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const content = card.querySelector('p').textContent.toLowerCase();
        const category = card.querySelector('.category-badge').textContent.toLowerCase();
        
        // Check if search term matches title, content, or category
        if (title.includes(searchTerm) || content.includes(searchTerm) || category.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease';
            visibleCount++;
            
            // Highlight search terms
            highlightSearchTerm(card, searchTerm);
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show/hide no results message
    if (visibleCount === 0) {
        if (noResults) noResults.style.display = 'block';
        if (resultsContainer) resultsContainer.style.display = 'none';
    } else {
        if (noResults) noResults.style.display = 'none';
        if (resultsContainer) resultsContainer.style.display = 'grid';
    }
    
    updateResultsCount(visibleCount, query);
}

// Highlight search terms in results
function highlightSearchTerm(card, term) {
    // This is a simplified version - in production, you'd want more sophisticated highlighting
    const title = card.querySelector('h3');
    if (title) {
        const originalText = title.textContent;
        const regex = new RegExp(`(${term})`, 'gi');
        // Note: In a real implementation, you'd want to use proper DOM manipulation
        // to avoid XSS vulnerabilities
    }
}

// Update results count
function updateResultsCount(count = null, query = null) {
    const resultsCount = document.getElementById('results-count');
    if (!resultsCount) return;
    
    if (count === null) {
        const visibleCards = document.querySelectorAll('.article-card[style*="display: block"], .article-card:not([style*="display: none"])');
        count = visibleCards.length;
    }
    
    if (count === 0) {
        resultsCount.textContent = 'No results found';
    } else if (query) {
        resultsCount.textContent = `Found ${count} ${count === 1 ? 'article' : 'articles'} for "${query}"`;
    } else {
        resultsCount.textContent = `Showing ${count} ${count === 1 ? 'article' : 'articles'}`;
    }
}

// Initialize filtering
function initFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const articleCards = document.querySelectorAll('.article-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            let visibleCount = 0;
            
            articleCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease';
                    visibleCount++;
                } else {
                    if (card.classList.contains(filterValue)) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeInUp 0.5s ease';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
            
            // Update results count
            const categoryName = button.textContent;
            const resultsCount = document.getElementById('results-count');
            if (resultsCount) {
                if (filterValue === 'all') {
                    resultsCount.textContent = `Showing all ${visibleCount} articles`;
                } else {
                    resultsCount.textContent = `Showing ${visibleCount} ${categoryName} ${visibleCount === 1 ? 'article' : 'articles'}`;
                }
            }
            
            // Show/hide no results
            const noResults = document.getElementById('no-results');
            const resultsContainer = document.getElementById('search-results-container');
            if (visibleCount === 0) {
                if (noResults) noResults.style.display = 'block';
                if (resultsContainer) resultsContainer.style.display = 'none';
            } else {
                if (noResults) noResults.style.display = 'none';
                if (resultsContainer) resultsContainer.style.display = 'grid';
            }
        });
    });
}

// Add smooth scrolling to all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Newsletter form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        alert(`Thank you for subscribing! We'll send updates to ${email}`);
        newsletterForm.reset();
    });
}

// Add hover effect to popular topics
document.querySelectorAll('a[href*="search.html?q="]').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.backgroundColor = 'var(--primary-color)';
        this.style.color = 'white';
        this.style.transform = 'translateY(-2px)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'white';
        this.style.color = 'var(--primary-color)';
        this.style.transform = 'translateY(0)';
    });
});

