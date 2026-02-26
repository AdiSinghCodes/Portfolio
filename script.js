// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all sections
            sections.forEach(section => section.classList.remove('active-section'));
            
            // Show target section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active-section');
            }
            
            // Scroll to top of main content
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && !this.classList.contains('nav-link')) {
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

    // Add hover effect to cards
    const interestCards = document.querySelectorAll('.interest-card');
    interestCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 8px 20px rgba(249, 168, 38, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });

    // Mobile menu toggle (for responsive design)
    function createMobileMenuToggle() {
        if (window.innerWidth <= 768) {
            const menuToggle = document.createElement('button');
            menuToggle.className = 'mobile-menu-toggle';
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 200;
                background: var(--accent-gold);
                border: none;
                padding: 12px 16px;
                border-radius: 8px;
                cursor: pointer;
                display: none;
            `;
            
            if (window.innerWidth <= 768) {
                menuToggle.style.display = 'block';
            }
            
            document.body.appendChild(menuToggle);
            
            menuToggle.addEventListener('click', function() {
                const sidebar = document.querySelector('.sidebar');
                sidebar.classList.toggle('open');
            });
        }
    }

    createMobileMenuToggle();
    
    window.addEventListener('resize', function() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        if (window.innerWidth <= 768 && !toggle) {
            createMobileMenuToggle();
        } else if (window.innerWidth > 768 && toggle) {
            toggle.remove();
        }
    });

    // Recommendations Carousel with Auto-slide
    const track = document.getElementById('recommendationsTrack');
    const progressContainer = document.getElementById('recommendationsProgress');
    let currentIndex = 0;
    let cardsToShow = getCardsToShow();
    let autoSlideInterval;
    let totalCards = 5;

    function getCardsToShow() {
        if (window.innerWidth > 1200) return 3;
        if (window.innerWidth > 768) return 2;
        return 1;
    }

    function createProgressDots() {
        if (!progressContainer) return;
        
        progressContainer.innerHTML = '';
        
        // Create progress track
        const trackElement = document.createElement('div');
        trackElement.className = 'progress-track';
        
        // Create draggable progress bar
        const bar = document.createElement('div');
        bar.className = 'progress-bar';
        bar.id = 'progressBar';
        
        trackElement.appendChild(bar);
        progressContainer.appendChild(trackElement);
        
        // Initialize drag functionality
        initProgressDrag(trackElement, bar);
        
        // Initialize bar position
        updateProgressBar();
    }

    function initProgressDrag(trackElement, bar) {
        let isDragging = false;
        
        function updateScrollFromPosition(clientX) {
            const trackRect = trackElement.getBoundingClientRect();
            const position = clientX - trackRect.left;
            let percentage = Math.max(0, Math.min(1, position / trackRect.width));
            
            // Calculate total scrollable width
            const recommendationsTrack = document.getElementById('recommendationsTrack');
            if (!recommendationsTrack) return;
            
            const trackWidth = recommendationsTrack.scrollWidth;
            const containerWidth = recommendationsTrack.parentElement.offsetWidth;
            const maxScroll = Math.max(0, trackWidth - containerWidth);
            
            // Calculate scroll position
            const scrollPosition = percentage * maxScroll;
            
            // Disable transition for smooth drag
            recommendationsTrack.style.transition = 'none';
            
            // Update track position
            recommendationsTrack.style.transform = `translateX(-${scrollPosition}px)`;
            
            // Update progress bar
            const barWidth = Math.min(100, (containerWidth / trackWidth) * 100);
            bar.style.transition = 'none';
            bar.style.left = `${percentage * (100 - barWidth)}%`;
            bar.style.width = `${barWidth}%`;
        }

        function onDragStart(e) {
            isDragging = true;
            const clientX = e.clientX || e.touches[0].clientX;
            updateScrollFromPosition(clientX);
            e.preventDefault();
        }

        function onDragMove(e) {
            if (!isDragging) return;
            
            const clientX = e.clientX || e.touches[0].clientX;
            updateScrollFromPosition(clientX);
            e.preventDefault();
        }

        function onDragEnd() {
            if (isDragging) {
                isDragging = false;
                // Re-enable transition for keyboard/swipe
                const recommendationsTrack = document.getElementById('recommendationsTrack');
                if (recommendationsTrack) {
                    recommendationsTrack.style.transition = 'transform 0.3s ease';
                }
            }
        }

        // Mouse events - on both bar and track
        bar.addEventListener('mousedown', onDragStart);
        trackElement.addEventListener('mousedown', onDragStart);
        
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);

        // Touch events - on both bar and track
        bar.addEventListener('touchstart', onDragStart, { passive: false });
        trackElement.addEventListener('touchstart', onDragStart, { passive: false });
        
        document.addEventListener('touchmove', onDragMove, { passive: false });
        document.addEventListener('touchend', onDragEnd);
    }

    function updateProgressBar() {
        const progressBar = document.getElementById('progressBar');
        if (!progressBar || !track) return;
        
        const trackWidth = track.scrollWidth;
        const containerWidth = track.parentElement.offsetWidth;
        const barWidth = Math.min(100, (containerWidth / trackWidth) * 100);
        
        progressBar.style.left = '0%';
        progressBar.style.width = `${barWidth}%`;
    }

    function updateCarousel() {
        if (!track) return;
        
        const cardWidth = track.querySelector('.recommendation-card')?.offsetWidth || 0;
        const gap = 24;
        const offset = currentIndex * (cardWidth + gap) * cardsToShow;
        track.style.transform = `translateX(-${offset}px)`;
        
        updateProgressBar();
    }

    function nextSlide() {
        const maxIndex = Math.ceil(totalCards / cardsToShow) - 1;
        currentIndex = (currentIndex + 1) > maxIndex ? 0 : currentIndex + 1;
        updateCarousel();
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 4000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    // Update carousel on window resize
    window.addEventListener('resize', () => {
        const newCardsToShow = getCardsToShow();
        if (newCardsToShow !== cardsToShow) {
            cardsToShow = newCardsToShow;
            currentIndex = 0;
            createProgressDots();
            updateCarousel();
        }
    });

    // Initial setup
    if (track && progressContainer) {
        setTimeout(() => {
            createProgressDots();
            updateCarousel();
        }, 100);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                const maxIndex = Math.ceil(totalCards / cardsToShow) - 1;
                currentIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
                updateCarousel();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const maxIndex = Math.ceil(totalCards / cardsToShow) - 1;
            
            if (touchStartX - touchEndX > swipeThreshold) {
                // Swipe left - go to next
                currentIndex = (currentIndex + 1) > maxIndex ? 0 : currentIndex + 1;
                updateCarousel();
            } else if (touchEndX - touchStartX > swipeThreshold) {
                // Swipe right - go to previous
                currentIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
                updateCarousel();
            }
        }
    }

    // Recommendation Modal
    const modal = document.getElementById('recommendationModal');
    const modalClose = document.getElementById('modalClose');
    const modalName = document.getElementById('modalName');
    const modalFullText = document.getElementById('modalFullText');
    const modalProfileLink = document.getElementById('modalProfileLink');
    const modalAvatarImg = document.getElementById('modalAvatarImg');

    // Open modal when clicking a recommendation card
    const recommendationCards = document.querySelectorAll('.recommendation-card');
    recommendationCards.forEach(card => {
        card.addEventListener('click', () => {
            const name = card.querySelector('.recommender-name').textContent;
            const fullText = card.getAttribute('data-full-text');
            const profileUrl = card.getAttribute('data-profile');
            const avatarSrc = card.querySelector('.avatar-img').src;

            // Set modal content
            modalName.textContent = name;
            modalFullText.textContent = fullText;
            modalProfileLink.setAttribute('data-url', profileUrl);
            modalAvatarImg.src = avatarSrc;

            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Handle profile link button click
    if (modalProfileLink) {
        modalProfileLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const url = modalProfileLink.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        });
    }

    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close modal on X button click
    if (modalClose) {
        modalClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal();
        });
    }

    // Close modal on overlay click (only on the dark background)
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(function() {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
