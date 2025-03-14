document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Elements
    const projectCards = document.querySelectorAll('.project-card');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const projectCategories = document.querySelector('.project-categories');

    // Initial animations with proper timing
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    tl.from(projectCategories, {
        opacity: 0,
        y: 20,
        duration: 0.7
    })
    .from(projectCards, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.12
    }, '-=0.4');

    // Project filtering with smooth transitions
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button with animation
            categoryButtons.forEach(btn => {
                if (btn !== button) {
                    gsap.to(btn, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    btn.classList.remove('active');
                }
            });
            
            // Animate active button
            gsap.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: "back.out(1.5)"
            });
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            // Animate projects based on filter with staggered timing
            let visibleCards = 0;
            let visibleCount = 0;
            
            // First count how many cards will be visible
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    visibleCount++;
                }
            });
            
            // Then animate with proper timing
            projectCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                const shouldShow = filter === 'all' || category === filter;

                // Create timeline for each card
                const cardTl = gsap.timeline({
                    defaults: { ease: "power3.out" }
                });

                if (shouldShow) {
                    // Show card with staggered delay
                    visibleCards++;
                    card.style.display = 'block';
                    cardTl.to(card, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.5,
                        delay: 0.05 * (visibleCards - 1)
                    });
                } else {
                    // Hide card
                    cardTl.to(card, {
                        opacity: 0,
                        y: 20,
                        scale: 0.95,
                        duration: 0.4,
                        ease: "power2.in",
                        onComplete: () => {
                            card.style.display = 'none';
                            // Force ScrollTrigger to recalculate after cards are hidden/shown
                            ScrollTrigger.refresh();
                        }
                    });
                }
            });
            
            // After all animations, refresh ScrollTrigger to ensure proper layout
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 600);
        });
    });

    // Enhanced scroll animations with better triggers
    projectCards.forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top bottom-=100",
                toggleActions: "play none none reverse",
                once: false
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power3.out",
            delay: i * 0.08
        });
    });

    // Improved hover animations for project cards
    projectCards.forEach(card => {
        const image = card.querySelector('.project-image img');
        const overlay = card.querySelector('.project-overlay');
        const links = card.querySelector('.project-links');
        
        // Create hover animation timeline with faster transitions
        const hoverTl = gsap.timeline({ paused: true });
        
        hoverTl
            .to(overlay, {
                opacity: 1,
                duration: 0.2,
                ease: "power2.out"
            })
            .to(image, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            }, 0); // Start at the same time as overlay

        // Add hover listeners
        card.addEventListener('mouseenter', () => hoverTl.play());
        card.addEventListener('mouseleave', () => hoverTl.reverse());
    });

    // Optimize ScrollTrigger batch for better performance
    ScrollTrigger.batch(".project-card", {
        interval: 0.1,
        batchMax: 3,
        onEnter: batch => gsap.to(batch, {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            overwrite: true
        }),
        onLeave: batch => gsap.set(batch, {
            opacity: 0,
            y: 30,
            overwrite: true
        }),
        onEnterBack: batch => gsap.to(batch, {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            overwrite: true
        }),
        onLeaveBack: batch => gsap.set(batch, {
            opacity: 0,
            y: -30,
            overwrite: true
        })
    });

    // Add resize handler for responsive adjustments
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });

    // Cleanup
    return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
});
