document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const serviceItems = document.querySelectorAll('.service-item');
    const processItems = document.querySelectorAll('.process-item');
    
    // Add click functionality to service items (redirect to contact page)
    serviceItems.forEach(item => {
        item.addEventListener('click', function() {
            // Get the service name from the h2 element
            const serviceName = this.querySelector('h2').textContent;
            
            // Redirect to contact page with service pre-selected
            window.location.href = `contact.html?service=${encodeURIComponent(serviceName)}`;
        });
        
        // Add keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `Learn more about ${item.querySelector('h2').textContent}`);
        
        // Handle keyboard navigation
        item.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // GSAP Animations (if GSAP is available)
    if (window.gsap) {
        // Create a timeline for better control
        const tl = gsap.timeline();
        
        // Animate the title section
        tl.from('.section-title', {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
        
        // Animate service items with stagger
        tl.from('.service-item', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
        }, "-=0.5");
        
        // Animate process section
        tl.from('.process-title', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, "-=0.2");
        
        tl.from('.process-item', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
        }, "-=0.5");
        
        // Add ScrollTrigger animations if available
        if (window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
            
            // Animate skill tags on scroll
            gsap.utils.toArray('.service-skills').forEach(skillSet => {
                gsap.from(skillSet.children, {
                    scrollTrigger: {
                        trigger: skillSet,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    },
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: "back.out(1.7)"
                });
            });
            
            // Animate process icons on scroll
            gsap.utils.toArray('.process-icon').forEach(icon => {
                gsap.from(icon, {
                    scrollTrigger: {
                        trigger: icon,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    },
                    scale: 0,
                    rotation: 180,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                });
            });
        }
    }
    
    // Add hover animations for process items
    processItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            if (window.gsap) {
                gsap.to(this.querySelector('.process-icon'), {
                    y: -10,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (window.gsap) {
                gsap.to(this.querySelector('.process-icon'), {
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    });
    
    // Add smooth scroll behavior for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
