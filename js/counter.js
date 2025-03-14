document.addEventListener('DOMContentLoaded', () => {
    // Function to check if an element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }

    // Function to animate counting with GSAP
    function animateCounter(element, target) {
        if (element.dataset.counted === 'true') return;
        
        element.dataset.counted = 'true';
        element.textContent = '0';
        
        // Add a small random delay for each counter to create a staggered effect
        const delay = Math.random() * 0.5;
        
        gsap.to(element, {
            duration: 2,
            delay: delay,
            innerText: target,
            snap: { innerText: 1 }, // Snap to integer values
            ease: "power2.out",
            onUpdate: function() {
                // Add a pulsing effect during counting
                if (Math.random() > 0.7) {
                    gsap.to(element, {
                        scale: 1.05,
                        duration: 0.1,
                        yoyo: true,
                        repeat: 1
                    });
                }
            },
            onComplete: function() {
                // Add a final highlight effect
                gsap.fromTo(element, 
                    { textShadow: "0 0 20px rgba(0, 255, 179, 0.7)" },
                    { textShadow: "0 0 10px rgba(0, 255, 179, 0.3)", duration: 1.5 }
                );
            }
        });
    }

    // Get all stat number elements
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const targetValue = parseInt(element.textContent, 10);
                animateCounter(element, targetValue);
                
                // Stop observing once animation is triggered
                observer.unobserve(element);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });
    
    // Observe each stat number
    statNumbers.forEach(statNumber => {
        observer.observe(statNumber);
    });
    
    // Fallback for browsers that don't support Intersection Observer
    if (!('IntersectionObserver' in window)) {
        function checkAndAnimate() {
            statNumbers.forEach(statNumber => {
                if (isInViewport(statNumber) && !statNumber.dataset.counted) {
                    const targetValue = parseInt(statNumber.textContent, 10);
                    animateCounter(statNumber, targetValue);
                }
            });
        }
        
        window.addEventListener('scroll', checkAndAnimate);
        checkAndAnimate(); // Check on initial load
    }
});
