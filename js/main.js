/**
 * Dan Vokey's Plumbing Services
 * Main JavaScript File
 */

(function() {
    'use strict';

    // ========================================
    // DOM Elements
    // ========================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const contactForm = document.getElementById('contactForm');

    // ========================================
    // Mobile Navigation Toggle
    // ========================================
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ========================================
    // Navbar Scroll Effect
    // ========================================
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Throttle scroll events for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(handleScroll);
    });

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Contact Form Handling
    // ========================================
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Basic validation
            let isValid = true;
            const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
            
            requiredFields.forEach(function(field) {
                const input = document.getElementById(field);
                if (input && !input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ef4444';
                } else if (input) {
                    input.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailInput = document.getElementById('email');
            if (emailInput && !isValidEmail(emailInput.value)) {
                showNotification('Please enter a valid email address.', 'error');
                emailInput.style.borderColor = '#ef4444';
                return;
            }
            
            // Simulate form submission (since this is a static site)
            showNotification('Thank you! Your request has been submitted. We will contact you soon.', 'success');
            
            // Reset form
            this.reset();
            
            // Log form data (for demonstration)
            console.log('Form submitted:', data);
        });
    }

    // ========================================
    // Utility Functions
    // ========================================
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Notification system
    function showNotification(message, type) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(function(n) {
            n.remove();
        });
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification notification-' + type;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 500;
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        `;
        
        // Set background color based on type
        if (type === 'success') {
            notification.style.backgroundColor = '#10b981';
            notification.style.color = '#ffffff';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#ef4444';
            notification.style.color = '#ffffff';
        }
        
        // Add animation styles
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes slideOutRight {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(function() {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(function() {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // ========================================
    // Intersection Observer for Animations
    // ========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.service-card, .testimonial-card, .why-choose-card, .value-card, .team-card').forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    // Add animation styles
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(animationStyle);

    // ========================================
    // Phone Number Formatting
    // ========================================
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 10) {
                value = '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6, 10);
            } else if (value.length >= 6) {
                value = '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6);
            } else if (value.length >= 3) {
                value = '(' + value.substring(0, 3) + ') ' + value.substring(3);
            }
            
            e.target.value = value;
        });
    }

    // ========================================
    // Lazy Loading Images (if any)
    // ========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(function(img) {
            imageObserver.observe(img);
        });
    }

    // ========================================
    // Active Navigation Link
    // ========================================
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(function(link) {
            link.classList.remove('active');
            const linkPath = link.getAttribute('href');
            
            if (linkPath && currentPath.includes(linkPath) && linkPath !== 'index.html') {
                link.classList.add('active');
            } else if (currentPath.endsWith('/') && linkPath === 'index.html') {
                link.classList.add('active');
            } else if (currentPath.endsWith('index.html') && linkPath === 'index.html') {
                link.classList.add('active');
            }
        });
    }

    setActiveNavLink();

    // ========================================
    // Console Welcome Message
    // ========================================
    console.log('%c🔧 Dan Vokey\'s Plumbing Services', 'font-size: 24px; font-weight: bold; color: #0066cc;');
    console.log('%cProfessional plumbing services in Kingston, Ontario', 'font-size: 14px; color: #4b5563;');
    console.log('%c📞 613-561-8075 | 📧 danvokeyplumbing@gmail.com', 'font-size: 12px; color: #6b7280;');

})();
