document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const serviceItems = document.querySelectorAll('.service-item');
    const processItems = document.querySelectorAll('.process-item');
    
    // Add hover effects and click functionality to service items
    serviceItems.forEach(item => {
        // Add click functionality
        item.addEventListener('click', function() {
            // Get the service name from the h2 element
            const serviceName = this.querySelector('h2').textContent;
            
            // Redirect to contact page with service pre-selected
            window.location.href = `contact.html?service=${encodeURIComponent(serviceName)}`;
        });
    });
    
    // Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#00ffb3"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    }
                },
                "opacity": {
                    "value": 0.2,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#00ffb3",
                    "opacity": 0.1,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 0.3
                        }
                    },
                    "push": {
                        "particles_nb": 4
                    }
                }
            },
            "retina_detect": true
        });
    }
    
    // Animation for service items on page load
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
        
        // Animate service items
        tl.from('.service-item', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
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
        
        // Add scroll animations
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
        
        // Animate process line
        gsap.from('.process-container::before', {
            scrollTrigger: {
                trigger: '.process-container',
                start: "top 70%",
                toggleActions: "play none none none"
            },
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.5,
            ease: "power3.inOut"
        });
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
});
