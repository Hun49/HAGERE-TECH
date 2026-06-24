const initApp = () => {
    const menuToggle = document.getElementById('menu-toggle');
    const closeBtn = document.getElementById('close-btn');
    const sidebar = document.getElementById('mobile-sidebar');
    const overlay = document.getElementById('mobile-overlay');

    const openMenu = () => {
        if (sidebar) {
            sidebar.classList.add('active');
            sidebar.setAttribute('aria-hidden', 'false');
        }
        if (overlay) overlay.classList.add('active');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Move focus to first focusable element in sidebar
        if (sidebar) {
            const firstFocusable = sidebar.querySelector('a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) firstFocusable.focus();
        }
    };

    const closeMenu = () => {
        if (sidebar) {
            sidebar.classList.remove('active');
            sidebar.setAttribute('aria-hidden', 'true');
        }
        if (overlay) overlay.classList.remove('active');
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.focus(); // Return focus
        }
        document.body.style.overflow = '';
    };

    if (menuToggle) menuToggle.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    // Escape key to close menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('active')) {
            closeMenu();
        }
    });

    // Focus trapping for sidebar
    if (sidebar) {
        sidebar.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                const focusableElements = sidebar.querySelectorAll('a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])');
                if (focusableElements.length > 0) {
                    const firstFocusable = focusableElements[0];
                    const lastFocusable = focusableElements[focusableElements.length - 1];

                    if (e.shiftKey) { // Shift + Tab
                        if (document.activeElement === firstFocusable) {
                            lastFocusable.focus();
                            e.preventDefault();
                        }
                    } else { // Tab
                        if (document.activeElement === lastFocusable) {
                            firstFocusable.focus();
                            e.preventDefault();
                        }
                    }
                }
            }
        });
    }

    // Swipe functionality for mobile sidebar
    let touchStartX = 0;
    let touchEndX = 0;

    const handleSwipe = () => {
        const swipeDistance = touchEndX - touchStartX;
        // Swipe right (positive distance) to close the right-aligned menu
        if (swipeDistance > 50) {
            closeMenu();
        }
    };

    if (sidebar) {
        sidebar.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sidebar.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    // Active link highlighting based on current path
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href === currentPath || (href === '/' && (currentPath === '' || currentPath === '/index.html'))) {
            link.classList.add('active');
        } else if (currentPath !== '/' && href !== '/' && currentPath.includes(href)) {
            link.classList.add('active');
        }
    });

    // Contact Form AJAX Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const statusDiv = document.getElementById('form-status');
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            
            if (!statusDiv || !submitBtn) return;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            statusDiv.className = '';
            statusDiv.style.display = 'none';
            
            const data = new FormData(contactForm);
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    statusDiv.style.display = 'block';
                    statusDiv.style.background = 'rgba(16, 185, 129, 0.1)';
                    statusDiv.style.color = 'var(--accent-emerald)';
                    statusDiv.style.border = '1px solid rgba(16, 185, 129, 0.2)';
                    statusDiv.textContent = 'Message sent successfully. We will get back to you soon.';
                    contactForm.reset();
                    
                    setTimeout(() => {
                        statusDiv.style.display = 'none';
                    }, 5000);
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    statusDiv.style.display = 'block';
                    statusDiv.style.background = 'rgba(239, 68, 68, 0.1)';
                    statusDiv.style.color = '#ef4444';
                    statusDiv.style.border = '1px solid rgba(239, 68, 68, 0.2)';
                    statusDiv.textContent = errorData.error || 'Server error: There was a problem processing your request. Please try again later.';
                    
                    setTimeout(() => {
                        statusDiv.style.display = 'none';
                    }, 5000);
                }
            } catch (error) {
                statusDiv.style.display = 'block';
                statusDiv.style.background = 'rgba(239, 68, 68, 0.1)';
                statusDiv.style.color = '#ef4444';
                statusDiv.style.border = '1px solid rgba(239, 68, 68, 0.2)';
                statusDiv.textContent = 'Network error: Please check your internet connection and try again.';
                
                setTimeout(() => {
                    statusDiv.style.display = 'none';
                }, 5000);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
