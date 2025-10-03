// Typing Animation
const services = ["Detailed Woodwork", "Furniture Design", "Renovation & Remodeling", "Furniture Repair"];
let serviceIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 150;

function typeService() {
    const currentService = services[serviceIndex];
    const typingElement = document.getElementById("typing");
    
    if (isDeleting) {
        typingElement.textContent = currentService.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingElement.textContent = currentService.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 150;
    }
    
    if (!isDeleting && charIndex === currentService.length) {
        typingSpeed = 1500;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        serviceIndex = (serviceIndex + 1) % services.length;
        typingSpeed = 500;
    }
    
    setTimeout(typeService, typingSpeed);
}

// Document Ready Function
$(document).ready(function(){
    // Initialize Owl Carousel for videos
    $('.video-carousel').owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        dots: true,
        autoplay: false,
        responsive: {
            0: { items: 1 },
            768: { items: 2 },
            1200: { items: 3 }
        }
    });

    // Initialize Owl Carousel for gallery
    $('.gallery-carousel').owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        dots: true,
        autoplay: false,
        responsive: {
            0: { items: 1 },
            600: { items: 2 },
            1000: { items: 3 }
        }
    });
    
    // Initialize reviews carousel
    $('.reviews-carousel').owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
            0: { items: 1 },
            768: { items: 2 },
            1200: { items: 3 }
        }
    });

    // Setup quote form functionality inside jQuery ready
    setupQuoteForm();

    // Video autoplay on mobile carousel navigation
    $('.video-carousel').on('initialized.owl.carousel changed.owl.carousel', function(event) {
        if (window.innerWidth < 768) { // mobile
            setTimeout(function() {
                // Pause all videos
                $('.video-portfolio video').each(function() {
                    this.pause();
                });
                
                // Play active video
                var activeVideos = $('.owl-item.active .video-container video');
                if (activeVideos.length > 0) {
                    var video = activeVideos[0];
                    video.currentTime = 0; // Restart video
                    video.play().catch(function(error) {
                        console.log('Autoplay prevented:', error);
                    });
                    // Hide play button for active video
                    $(video).closest('.video-container').find('.play-button').css('opacity', '0');
                }
            }, 100); // Small delay to ensure slide is complete
        }
    });
    
    // Initial mobile autoplay after setup
    if (window.innerWidth < 768) {
        setTimeout(function() {
            $('.video-portfolio video').each(function() {
                this.pause();
            });
            var firstVideo = $('.owl-item.active .video-container video');
            if (firstVideo.length > 0) {
                firstVideo[0].play().catch(console.log);
                $('.owl-item.active .play-button').css('opacity', '0');
            }
        }, 500);
    }
    
    $(window).on('resize', function() {
        if (window.innerWidth >= 768) {
            // Pause all videos when switching to desktop
            $('.video-portfolio video').each(function() {
                this.pause();
                // Show play buttons on desktop
                $(this).closest('.video-container').find('.play-button').css('opacity', '1');
            });
        }
    });
});

// Theme Toggle Function
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('#themeToggle i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Video Player Setup
function setupVideoPlayer() {
    const modal = document.getElementById('videoModal');
    const modalVideo = modal.querySelector('video');
    const closeModal = modal.querySelector('.close-modal');

    // Event delegation for play buttons
    document.addEventListener('click', function(e) {
        if (e.target.matches('.play-button')) {
            e.stopPropagation();
            const video = e.target.closest('.video-container').querySelector('video');
            if (video.paused) {
                video.play().catch(console.log);
                e.target.style.opacity = '0';
            } else {
                video.pause();
                e.target.style.opacity = '1';
            }
        }
    });

    // Event delegation for video play state (show/hide play button)
    document.addEventListener('play', function(e) {
        if (e.target.matches('.video-container video')) {
            const playButton = e.target.closest('.video-container').querySelector('.play-button');
            if (playButton) playButton.style.opacity = '0';
        }
    }, true);

    document.addEventListener('pause', function(e) {
        if (e.target.matches('.video-container video')) {
            const playButton = e.target.closest('.video-container').querySelector('.play-button');
            if (playButton) playButton.style.opacity = '1';
        }
    }, true);

    // Event delegation for fullscreen video click
    document.addEventListener('click', function(e) {
        if (e.target.matches('.video-container video') && !e.target.closest('.modal')) {
            modalVideo.src = e.target.src;
            modal.style.display = 'block';
            modalVideo.play();
        }
    });

    // Close modal handlers
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        modalVideo.pause();
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            modalVideo.pause();
        }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            modalVideo.pause();
        }
    });
}

// Gallery Lightbox Setup
function setupGalleryLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    // Remove video support if not needed
    // const lightboxVideo = document.querySelector('.lightbox-video');
    const closeLightbox = document.getElementById('closeLightbox');
    const galleryItems = document.querySelectorAll('.gallery-item img'); // Use img for click

    galleryItems.forEach(img => {
        img.addEventListener('click', function (e) {
            e.stopPropagation();
            lightboxImg.src = this.src;
            lightboxImg.style.display = 'block';
            // if (lightboxVideo) lightboxVideo.style.display = 'none';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    closeLightbox.addEventListener('click', function () {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    });

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Optional: close on ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Contact Form Setup
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) {
        return;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! Muhammad Farid will get back to you soon.');
        this.reset();
    });
}

// Quote Form Functionality
function setupQuoteForm() {
    // Service selection
    const serviceOptions = document.querySelectorAll('.service-option');
    let selectedService = 'furniture';
    
    serviceOptions.forEach(option => {
        option.addEventListener('click', function() {
            serviceOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedService = this.getAttribute('data-service');
            updateQuoteSummary();
        });
    });
    
    // Step navigation
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = this.getAttribute('data-next');
            navigateToStep(nextStep);
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = this.getAttribute('data-prev');
            navigateToStep(prevStep);
        });
    });
    
    // Submit quote via WhatsApp
    const submitButton = document.getElementById('submit-quote');
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            submitQuoteViaWhatsApp();
        });
    }
    
    function navigateToStep(step) {
        // Hide all steps
        document.querySelectorAll('.quote-step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });
        
        // Show target step
        document.getElementById('step' + step).classList.add('active');
        
        // Update step indicator
        document.querySelectorAll('.step-dot').forEach(dot => {
            dot.classList.remove('active');
            if (parseInt(dot.getAttribute('data-step')) <= parseInt(step)) {
                dot.classList.add('active');
            }
        });
    }
    
    function updateQuoteSummary() {
        const serviceTitles = {
            'furniture': 'Custom Furniture',
            'renovation': 'Home Renovation',
            'doors-windows': 'Doors & Windows',
            'restoration': 'Restoration & Repair'
        };
        
        const timelines = {
            'furniture': '4-6 weeks',
            'renovation': '6-12 weeks',
            'doors-windows': '2-4 weeks',
            'restoration': '3-5 weeks'
        };
        
        const materials = {
            'furniture': 'Premium Hardwood',
            'renovation': 'Custom Materials',
            'doors-windows': 'Solid Wood',
            'restoration': 'Period-Appropriate'
        };
        
        const labor = {
            'furniture': 'Master Craftsman',
            'renovation': 'Team of Experts',
            'doors-windows': 'Precision Specialist',
            'restoration': 'Restoration Expert'
        };
        
        document.getElementById('summary-service').textContent = serviceTitles[selectedService];
        document.getElementById('summary-timeline').textContent = timelines[selectedService];
        document.getElementById('summary-materials').textContent = materials[selectedService];
        document.getElementById('summary-labor').textContent = labor[selectedService];
    }
    
    function submitQuoteViaWhatsApp() {
        // Get form data
        const firstName = document.getElementById('firstName')?.value || '';
        const lastName = document.getElementById('lastName')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const phone = document.getElementById('phone')?.value || '';
        const timeline = document.getElementById('timeline')?.value || '';
        const details = document.getElementById('details')?.value || '';
        
        // Get quote summary
        const service = document.getElementById('summary-service')?.textContent || '';
        const estimatedTimeline = document.getElementById('summary-timeline')?.textContent || '';
        const materials = document.getElementById('summary-materials')?.textContent || '';
        const laborType = document.getElementById('summary-labor')?.textContent || '';
        
        // Create WhatsApp message
        const message = `*New Quote Request*%0A%0A` +
                       `*Customer Details:*%0A` +
                       `Name: ${firstName} ${lastName}%0A` +
                       `Email: ${email}%0A` +
                       `Phone: ${phone}%0A` +
                       `Timeline: ${timeline}%0A%0A` +
                       `*Project Details:*%0A` +
                       `${details}%0A%0A` +
                       `*Quote Summary:*%0A` +
                       `Service: ${service}%0A` +
                       `Estimated Timeline: ${estimatedTimeline}%0A` +
                       `Materials: ${materials}%0A` +
                       `Labor: ${laborType}%0A` +
                       `Pricing: Shared during consultation%0A%0A` +
                       `*This is an automated quote request from WoodCraft Masters website*`;
        
        // Open WhatsApp
        window.open(`https://wa.me/92320968687?text=${message}`, '_blank');
        
        // Show confirmation
        alert('Your quote request has been sent via WhatsApp! We will contact you shortly.');
    }
    
    // Initialize with default selection
    if (serviceOptions.length > 0) {
        serviceOptions[0].click();
    }
}

function setupCategoryFilter() {
    const buttons = document.querySelectorAll('.category-btn');
    const container = document.querySelector('.gallery-container');
    const items = Array.from(document.querySelectorAll('.gallery-item'));

    if (!buttons.length || !container || !items.length) {
        return;
    }

    items.forEach((item, index) => {
        item.dataset.initialIndex = index;
    });

    const reorderItems = (orderedItems) => {
        orderedItems.forEach(item => {
            container.appendChild(item);
        });
    };

    const showCategory = (category) => {
        const visibleItems = [];

        items.forEach(item => {
            const matches = category === 'all' || item.dataset.category === category;
            item.classList.toggle('hidden', !matches);
            if (matches) {
                visibleItems.push(item);
            }
        });

        if (category === 'all') {
            const originalOrder = items
                .slice()
                .sort((a, b) => Number(a.dataset.initialIndex) - Number(b.dataset.initialIndex));
            reorderItems(originalOrder);
        } else {
            const hiddenItems = items.filter(item => !visibleItems.includes(item))
                .sort((a, b) => Number(a.dataset.initialIndex) - Number(b.dataset.initialIndex));
            const ordered = visibleItems
                .sort((a, b) => Number(a.dataset.initialIndex) - Number(b.dataset.initialIndex))
                .concat(hiddenItems);
            reorderItems(ordered);
        }
    };

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            if (!category) {
                return;
            }

            buttons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });

            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            showCategory(category);
        });
    });

    showCategory('all');
}

function setupColorPalette() {
    const board = document.getElementById('colorBoard');
    if (!board) {
        return;
    }

    const root = document.documentElement;
    const options = board.querySelectorAll('.color-option');
    const resetButton = board.querySelector('.color-reset');
    const computed = getComputedStyle(root);

    const defaultPalette = {
        primary: computed.getPropertyValue('--primary').trim(),
        secondary: computed.getPropertyValue('--secondary').trim(),
        accent: computed.getPropertyValue('--accent').trim(),
        section: computed.getPropertyValue('--section-bg').trim(),
        card: computed.getPropertyValue('--card-bg').trim()
    };

    const applyPalette = (palette) => {
        if (!palette) return;

        const mappings = {
            primary: '--primary',
            secondary: '--secondary',
            accent: '--accent',
            section: '--section-bg',
            card: '--card-bg'
        };

        Object.entries(mappings).forEach(([key, variable]) => {
            if (palette[key]) {
                root.style.setProperty(variable, palette[key]);
            }
        });
    };

    options.forEach(option => {
        option.addEventListener('click', () => {
            try {
                const palette = JSON.parse(option.dataset.palette);
                applyPalette(palette);
            } catch (error) {
                console.error('Invalid palette data', error);
            }
        });
    });

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            applyPalette(defaultPalette);
        });
    }
}

function setupAmbientAudio() {
    const audio = document.getElementById('ambientAudio');
    const toggle = document.getElementById('audioToggle');

    if (!audio || !toggle) {
        return;
    }

    const updateState = (isPlaying) => {
        toggle.classList.toggle('is-playing', isPlaying);
        toggle.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    };

    const playAudio = () => {
        audio.play().then(() => {
            updateState(true);
        }).catch(() => {
            // Autoplay might be blocked; leave state untouched.
        });
    };

    const pauseAudio = () => {
        audio.pause();
        updateState(false);
    };

    toggle.addEventListener('click', () => {
        if (audio.paused) {
            playAudio();
        } else {
            pauseAudio();
        }
    });

    const handleFirstScroll = () => {
        if (audio.paused) {
            playAudio();
        }
        window.removeEventListener('scroll', handleFirstScroll);
    };

    window.addEventListener('scroll', handleFirstScroll, { once: true });

    audio.addEventListener('play', () => updateState(true));
    audio.addEventListener('pause', () => updateState(false));
}

function setupBackToTop() {
    const button = document.getElementById('backToTop');
    if (!button) {
        return;
    }

    const toggleVisibility = () => {
        if (window.scrollY > 320) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    };

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility();
}

const GREETING_STORAGE_KEY = 'greetingOverlayShown';

function initGreetingOverlay() {
    const overlay = document.getElementById('greetingOverlay');
    if (!overlay) return;

    const hideOverlay = () => {
        overlay.classList.remove('visible');
        overlay.setAttribute('aria-hidden', 'true');
        setTimeout(() => overlay.remove(), 400);
    };

    // Always show on load/refresh
    overlay.classList.add('visible');
    overlay.setAttribute('aria-hidden', 'false');

    const timeoutId = setTimeout(hideOverlay, 4000);

    overlay.addEventListener('click', () => {
        clearTimeout(timeoutId);
        hideOverlay();
    });
    overlay.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            clearTimeout(timeoutId);
            hideOverlay();
        }
    });
}

function setupHammer() {
    const button = document.getElementById('hammerBtn');
    if (!button) {
        return;
    }

    const toggleVisibility = () => {
        if (window.scrollY > 800) {  // Show after scrolling past hero and about
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    };

    button.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('#services').scrollIntoView({
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility();
}

// Set initial play button visibility
document.addEventListener('DOMContentLoaded', function() {
    const playButtons = document.querySelectorAll('.play-button');
    playButtons.forEach(button => {
        button.style.opacity = '1';
    });
    
    // Pause all videos initially
    const videos = document.querySelectorAll('.video-container video');
    videos.forEach(video => {
        video.pause();
        video.currentTime = 0;
    });
});

// In DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize typing animation
    typeService();

    initGreetingOverlay();
    
    // Theme toggle button event listener
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'var(--primary)';
            header.style.boxShadow = '0 2px 10px var(--shadow)';
        } else {
            header.style.background = 'linear-gradient(135deg, var(--primary), var(--accent))';
            header.style.boxShadow = 'none';
        }
    });
    
    // Video player functionality
    setupVideoPlayer();
    
    // Gallery lightbox functionality
    setupGalleryLightbox();
    
    // Form submission
    setupContactForm();
    
    // Category filtering
    setupCategoryFilter();

    // Color palette board
    setupColorPalette();

    // Ambient audio controller
    setupAmbientAudio();

    // Back to top button
    setupBackToTop();
    
    // Hammer button
    setupHammer();
});