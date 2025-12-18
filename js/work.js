// Work Page - Firebase Integration & Dynamic Loading
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);

    // DOM Elements
    const projectsGrid = document.getElementById('projectsGrid');
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const emptyState = document.getElementById('emptyState');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    const retryBtn = document.getElementById('retryBtn');
    const categoryButtons = document.querySelectorAll('.category-btn');

    // State
    let allProjects = [];
    let filteredProjects = [];
    let currentFilter = 'all';
    let searchQuery = '';

    // ============================================
    // FIREBASE - LOAD PROJECTS
    // ============================================

    async function loadProjects() {
        try {
            showLoading();

            // Fetch projects from Firestore
            const snapshot = await db.collection('projects')
                .orderBy('order', 'asc')
                .get();

            allProjects = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Update category counts
            updateCategoryCounts();

            // Initial display
            filterProjects();

            hideLoading();

            // If no projects, show empty state (not error)
            if (allProjects.length === 0) {
                showEmpty();
            }

        } catch (error) {
            console.error('Error loading projects:', error);

            // Check if it's a permissions error or missing index
            if (error.code === 'permission-denied') {
                console.error('Permission denied. Please check Firestore rules.');
            } else if (error.code === 'failed-precondition') {
                console.error('Missing index. Creating index...');
            }

            // Only show error for actual errors, not empty database
            hideLoading();
            showError();
        }
    }

    // ============================================
    // DISPLAY PROJECTS
    // ============================================

    function displayProjects(projects) {
        projectsGrid.innerHTML = '';

        if (projects.length === 0) {
            showEmpty();
            return;
        }

        hideEmpty();

        projects.forEach((project, index) => {
            const card = createProjectCard(project, index);
            projectsGrid.appendChild(card);
        });

        // Animate cards
        animateCards();
    }

    // ============================================
    // CREATE PROJECT CARD
    // ============================================

    function createProjectCard(project, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-category', project.category);
        card.style.animationDelay = `${index * 0.1}s`;

        // Parse technologies (handle both array and comma-separated string)
        let techArray = [];
        if (Array.isArray(project.technologies)) {
            techArray = project.technologies;
        } else if (typeof project.technologies === 'string') {
            techArray = project.technologies.split(',').map(t => t.trim());
        }

        card.innerHTML = `
            <div class="project-content">
                <div class="project-image">
                    <img src="${project.imageUrl}" alt="${project.title}" loading="lazy" onerror="this.src='https://placehold.co/600x400/1a1a1a/00ffb3?text=${encodeURIComponent(project.title)}'">
                    <div class="project-overlay">
                        <div class="project-links">
                            ${project.githubUrl ? `
                                <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="View on GitHub">
                                    <i class="fab fa-github"></i>
                                </a>
                            ` : ''}
                            ${project.liveUrl ? `
                                <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="View live demo">
                                    <i class="fas fa-external-link-alt"></i>
                                </a>
                            ` : ''}
                        </div>
                    </div>
                    ${project.featured ? '<div class="featured-badge">Featured</div>' : ''}
                </div>
                <div class="project-info">
                    <span class="project-number">${String(index + 1).padStart(2, '0')}</span>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="tech-stack">
                        ${techArray.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    // ============================================
    // FILTER & SEARCH
    // ============================================

    function filterProjects() {
        let filtered = allProjects;

        // Filter by category
        if (currentFilter !== 'all') {
            filtered = filtered.filter(p => p.category === currentFilter);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                (Array.isArray(p.technologies) && p.technologies.some(t => t.toLowerCase().includes(query))) ||
                (typeof p.technologies === 'string' && p.technologies.toLowerCase().includes(query))
            );
        }

        filteredProjects = filtered;
        displayProjects(filtered);
    }

    // ============================================
    // CATEGORY COUNTS
    // ============================================

    function updateCategoryCounts() {
        const counts = {
            all: allProjects.length,
            web: allProjects.filter(p => p.category === 'web').length,
            ai: allProjects.filter(p => p.category === 'ai').length,
            analytics: allProjects.filter(p => p.category === 'analytics').length,
            collaboration: allProjects.filter(p => p.category === 'collaboration').length
        };

        Object.keys(counts).forEach(category => {
            const countEl = document.getElementById(`count-${category}`);
            if (countEl) {
                countEl.textContent = counts[category];
            }
        });
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================

    // Category filter buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update filter
            currentFilter = button.getAttribute('data-filter');
            filterProjects();

            // Animate button
            gsap.fromTo(button,
                { scale: 0.95 },
                { scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
            );
        });
    });

    // Search input
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();

        // Show/hide clear button
        if (searchQuery) {
            clearSearchBtn.classList.add('active');
        } else {
            clearSearchBtn.classList.remove('active');
        }

        filterProjects();
    });

    // Clear search
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.classList.remove('active');
        filterProjects();
        searchInput.focus();
    });

    // Retry button
    retryBtn.addEventListener('click', () => {
        loadProjects();
    });

    // ============================================
    // ANIMATIONS
    // ============================================

    function animateCards() {
        const cards = document.querySelectorAll('.project-card');

        // Kill any existing animations on these cards
        gsap.killTweensOf(cards);

        // Simple fade in animation - no scroll triggers that cause disappearing
        gsap.fromTo(cards,
            {
                opacity: 0,
                y: 20
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: 'power2.out',
                clearProps: 'transform', // Clear transform after animation
                onComplete: () => {
                    // Ensure all cards are visible and stay visible
                    cards.forEach(card => {
                        card.classList.add('visible');
                        card.style.opacity = '1';
                    });
                }
            }
        );
    }

    // ============================================
    // STATE MANAGEMENT
    // ============================================

    function showLoading() {
        loadingState.style.display = 'block';
        projectsGrid.style.display = 'none';
        errorState.style.display = 'none';
        emptyState.style.display = 'none';
    }

    function hideLoading() {
        loadingState.style.display = 'none';
        projectsGrid.style.display = 'grid';
    }

    function showError() {
        loadingState.style.display = 'none';
        projectsGrid.style.display = 'none';
        errorState.style.display = 'block';
        emptyState.style.display = 'none';
    }

    function showEmpty() {
        emptyState.style.display = 'block';
        projectsGrid.style.display = 'none';
    }

    function hideEmpty() {
        emptyState.style.display = 'none';
        projectsGrid.style.display = 'grid';
    }

    // ============================================
    // REAL-TIME UPDATES (Optional)
    // ============================================

    function setupRealtimeListener() {
        db.collection('projects')
            .orderBy('order', 'asc')
            .onSnapshot((snapshot) => {
                allProjects = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                updateCategoryCounts();
                filterProjects();
            }, (error) => {
                console.error('Error in realtime listener:', error);
            });
    }

    // ============================================
    // INITIALIZE
    // ============================================

    // Load projects on page load
    loadProjects();

    // Optional: Enable real-time updates
    // Uncomment the line below to enable real-time project updates
    // setupRealtimeListener();

    // Refresh ScrollTrigger on window resize
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    });
});
