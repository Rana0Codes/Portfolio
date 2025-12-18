document.addEventListener('DOMContentLoaded', function () {
    // Initialize particle background with more subtle settings
    initParticles();

    // Form handling
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value.trim();

            // Basic validation
            if (!name || !email || !service || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            // Name validation (at least 2 characters)
            if (name.length < 2) {
                showNotification('Please enter a valid name', 'error');
                return;
            }

            // Email validation
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Message validation (at least 10 characters)
            if (message.length < 10) {
                showNotification('Please enter a message with at least 10 characters', 'error');
                return;
            }

            // Add loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.querySelector('.btn-text').textContent;
            const btnIcon = submitBtn.querySelector('.btn-icon i');
            const originalIconClass = btnIcon.className;

            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            submitBtn.querySelector('.btn-text').textContent = 'Sending...';
            btnIcon.className = 'fas fa-spinner fa-spin';

            // Collect form data
            const formData = new FormData(contactForm);

            // Update the subject to include the service
            formData.set('subject', `Portfolio Contact: ${service} - ${name}`);

            try {
                // Send form data to Web3Forms
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Show success message
                    showNotification('✓ Message sent successfully! I\'ll get back to you soon.', 'success');

                    // Reset form
                    contactForm.reset();

                    // Remove any focused states
                    document.querySelectorAll('.form-group').forEach(group => {
                        group.classList.remove('focused');
                    });
                } else {
                    // Show error message with details if available
                    const errorMsg = data.message || 'There was a problem sending your message. Please try again.';
                    showNotification('✗ ' + errorMsg, 'error');
                    console.error('Form submission error:', data);
                }
            } catch (error) {
                console.error('Network error:', error);
                showNotification('✗ Network error. Please check your connection and try again.', 'error');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                submitBtn.querySelector('.btn-text').textContent = originalBtnText;
                btnIcon.className = originalIconClass;

                // Add animation class
                contactForm.classList.add('form-submitted');

                // Remove animation class after animation completes
                setTimeout(() => {
                    contactForm.classList.remove('form-submitted');
                }, 500);
            }
        });
    }

    // Function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Function to show notification
    function showNotification(message, type) {
        // Check if notification container exists, if not create it
        let notificationContainer = document.querySelector('.notification-container');

        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = message;

        // Add to container
        notificationContainer.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');

            // Remove from DOM after animation completes
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Function to initialize particle background
    function initParticles() {
        const canvas = document.getElementById('particles');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 50; // Reduced count for subtlety
        const primaryColor = '#00ff7f';

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5, // Smaller particles
                color: i % 8 === 0 ? primaryColor : '#ffffff',
                speedX: Math.random() * 0.3 - 0.15, // Slower movement
                speedY: Math.random() * 0.3 - 0.15, // Slower movement
                opacity: Math.random() * 0.3 + 0.05 // More transparent
            });
        }

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Move particles
                p.x += p.speedX;
                p.y += p.speedY;

                // Wrap around edges
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            // Draw connecting lines (fewer and more subtle)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 0.3;

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];
                    const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

                    if (distance < 80) { // Shorter connection distance
                        ctx.globalAlpha = 0.5 - (distance / 80);
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            ctx.globalAlpha = 1;
        }

        // Handle window resize
        window.addEventListener('resize', function () {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        // Start animation
        animate();
    }

    // Add hover effects for better interactivity
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 5px 15px rgba(0, 255, 127, 0.3)';
        });

        link.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Add focus effects for form inputs
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('focused');
        });
    });
});
