document.addEventListener('DOMContentLoaded', () => {
    // Find the container - works on any page
    const container = document.querySelector('.hero') ||
        document.querySelector('.services-container') ||
        document.querySelector('.contact-container') ||
        document.querySelector('.work-container') ||
        document.querySelector('.resume-container') ||
        document.querySelector('main');

    if (!container) return; // Exit if no container found

    // Check if background elements already exist
    let bgElementsContainer = container.querySelector('.hero-bg-elements');

    if (!bgElementsContainer) {
        // Create background elements container
        bgElementsContainer = document.createElement('div');
        bgElementsContainer.className = 'hero-bg-elements';

        // Insert the container as the first child
        container.insertBefore(bgElementsContainer, container.firstChild);
    }


    // Create and add background elements
    const elements = [
        { className: 'bg-element bg-circle' },
        { className: 'bg-element bg-square' },
        { className: 'bg-element bg-dots' },
        { className: 'bg-element bg-line' },
        { className: 'bg-element bg-triangle' }
    ];

    // Add code element with content
    const codeElement = document.createElement('div');
    codeElement.className = 'bg-element bg-code';
    codeElement.innerHTML = `
        &lt;div class="code"&gt;
            function createExperience() {
                return innovation + creativity;
            }
        &lt;/div&gt;
    `;

    // Add all elements to the container
    elements.forEach(element => {
        const div = document.createElement('div');
        div.className = element.className;
        bgElementsContainer.appendChild(div);
    });

    // Add the code element
    bgElementsContainer.appendChild(codeElement);

    // Add GSAP animations if available
    if (typeof gsap !== 'undefined') {
        // Animate circle
        gsap.to('.bg-circle', {
            y: -30,
            duration: 8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Animate square
        gsap.to('.bg-square', {
            rotation: 360,
            duration: 30,
            repeat: -1,
            ease: "none"
        });

        // Animate dots
        gsap.to('.bg-dots', {
            scale: 1.1,
            opacity: 0.07,
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Animate line
        gsap.to('.bg-line', {
            opacity: 0.08,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Animate triangle
        gsap.to('.bg-triangle', {
            rotation: -360,
            duration: 40,
            repeat: -1,
            ease: "none"
        });

        // Animate code
        gsap.to('.bg-code', {
            opacity: 0.15,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Initial animation to fade in all elements
        gsap.from('.bg-element', {
            opacity: 0,
            scale: 0.8,
            duration: 1.5,
            stagger: 0.2,
            ease: "power2.out"
        });
    }
});
