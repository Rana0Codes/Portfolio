document.addEventListener('DOMContentLoaded', () => {
    // Get the image circle element
    const imageCircle = document.querySelector('.image-circle');
    if (!imageCircle) return;
    
    // Add subtle animations with GSAP if available
    if (typeof gsap !== 'undefined') {
        // Initial animation for the profile image
        gsap.from('.image-circle', {
            duration: 1,
            scale: 0.95,
            opacity: 0,
            ease: "power2.out",
            delay: 0.3
        });
        
        // Subtle hover effect
        imageCircle.addEventListener('mouseenter', () => {
            gsap.to(imageCircle, {
                duration: 0.3,
                boxShadow: '0 0 20px rgba(0, 255, 179, 0.4)',
                scale: 1.02,
                ease: "power1.out"
            });
        });
        
        imageCircle.addEventListener('mouseleave', () => {
            gsap.to(imageCircle, {
                duration: 0.3,
                boxShadow: '0 0 15px rgba(0, 255, 179, 0.2)',
                scale: 1,
                ease: "power1.in"
            });
        });
    }
});
