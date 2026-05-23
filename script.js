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
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(function() {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
