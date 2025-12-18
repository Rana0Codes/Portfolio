// Resume page navigation
document.addEventListener('DOMContentLoaded', () => {
    const sections = ['experience', 'education', 'skills', 'about'];
    const buttons = document.querySelectorAll('.nav-button');
    
    // Function to hide all sections
    const hideAllSections = () => {
        sections.forEach(section => {
            const el = document.querySelector(`.${section}-section`);
            if (el) {
                el.classList.remove('active');
            }
        });
    };
    
    // Function to show a specific section
    const showSection = (sectionName) => {
        hideAllSections();
        const section = document.querySelector(`.${sectionName}-section`);
        if (section) {
            section.classList.add('active');
        }
    };
    
    // Initialize with experience section
    hideAllSections();
    showSection('experience');
    document.querySelector('.nav-button:nth-child(1)').classList.add('active');
    
    // Handle button clicks
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // Update button states
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show selected section
            showSection(sections[index]);
        });
    });
});
