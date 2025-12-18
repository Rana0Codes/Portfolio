// Admin Panel - Firebase Authentication & CRUD Operations
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginScreen = document.getElementById('loginScreen');
    const adminDashboard = document.getElementById('adminDashboard');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const logoutBtn = document.getElementById('logoutBtn');
    const userEmail = document.getElementById('userEmail');
    const addProjectBtn = document.getElementById('addProjectBtn');
    const projectModal = document.getElementById('projectModal');
    const deleteModal = document.getElementById('deleteModal');
    const projectForm = document.getElementById('projectForm');
    const projectsTableBody = document.getElementById('projectsTableBody');
    const totalProjectsEl = document.getElementById('totalProjects');
    const imageUrlInput = document.getElementById('projectImageUrl');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');

    let currentProjectId = null;
    let projectToDelete = null;

    // ============================================
    // AUTHENTICATION
    // ============================================

    // Check auth state
    auth.onAuthStateChanged((user) => {
        if (user) {
            showDashboard(user);
            loadProjects();
        } else {
            showLogin();
        }
    });

    // Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await auth.signInWithEmailAndPassword(email, password);
            loginError.textContent = '';
            loginError.classList.remove('show');
        } catch (error) {
            loginError.textContent = error.message;
            loginError.classList.add('show');
        }
    });

    // Logout
    logoutBtn.addEventListener('click', async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error('Logout error:', error);
        }
    });

    function showLogin() {
        loginScreen.style.display = 'flex';
        adminDashboard.style.display = 'none';
    }

    function showDashboard(user) {
        loginScreen.style.display = 'none';
        adminDashboard.style.display = 'block';
        userEmail.textContent = user.email;
    }

    // ============================================
    // LOAD PROJECTS
    // ============================================

    async function loadProjects() {
        try {
            const snapshot = await db.collection('projects')
                .orderBy('order', 'asc')
                .get();

            const projects = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            displayProjects(projects);
            totalProjectsEl.textContent = projects.length;

        } catch (error) {
            console.error('Error loading projects:', error);
            alert('Error loading projects: ' + error.message);
        }
    }

    // ============================================
    // DISPLAY PROJECTS
    // ============================================

    function displayProjects(projects) {
        projectsTableBody.innerHTML = '';

        if (projects.length === 0) {
            projectsTableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: #888;">
                        No projects yet. Click "Add New Project" to create one.
                    </td>
                </tr>
            `;
            return;
        }

        projects.forEach(project => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${project.order}</td>
                <td><strong>${project.title}</strong></td>
                <td><span class="category-badge">${getCategoryName(project.category)}</span></td>
                <td>${project.featured ? '<i class="fas fa-star featured-indicator"></i>' : '-'}</td>
                <td class="table-actions">
                    <button class="btn btn-small btn-secondary" onclick="editProject('${project.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-small btn-danger" onclick="confirmDelete('${project.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            projectsTableBody.appendChild(row);
        });
    }

    function getCategoryName(category) {
        const names = {
            web: 'Web Apps',
            ai: 'AI/ML',
            analytics: 'Analytics',
            collaboration: 'Collaboration'
        };
        return names[category] || category;
    }

    // ============================================
    // ADD/EDIT PROJECT
    // ============================================

    addProjectBtn.addEventListener('click', () => {
        openProjectModal();
    });

    function openProjectModal(projectId = null) {
        currentProjectId = projectId;
        projectForm.reset();
        imagePreview.style.display = 'none';

        if (projectId) {
            document.getElementById('modalTitle').textContent = 'Edit Project';
            loadProjectData(projectId);
        } else {
            document.getElementById('modalTitle').textContent = 'Add New Project';
        }

        projectModal.classList.add('show');
    }

    async function loadProjectData(projectId) {
        try {
            const doc = await db.collection('projects').doc(projectId).get();
            if (doc.exists) {
                const data = doc.data();
                document.getElementById('projectId').value = projectId;
                document.getElementById('projectTitle').value = data.title;
                document.getElementById('projectCategory').value = data.category;
                document.getElementById('projectDescription').value = data.description;
                document.getElementById('projectImageUrl').value = data.imageUrl;
                document.getElementById('projectGithubUrl').value = data.githubUrl || '';
                document.getElementById('projectLiveUrl').value = data.liveUrl || '';

                // Handle technologies (array or string)
                let techString = '';
                if (Array.isArray(data.technologies)) {
                    techString = data.technologies.join(', ');
                } else if (typeof data.technologies === 'string') {
                    techString = data.technologies;
                }
                document.getElementById('projectTechnologies').value = techString;

                document.getElementById('projectOrder').value = data.order;
                document.getElementById('projectFeatured').checked = data.featured || false;

                // Show image preview
                if (data.imageUrl) {
                    previewImg.src = data.imageUrl;
                    imagePreview.style.display = 'block';
                }
            }
        } catch (error) {
            console.error('Error loading project:', error);
            alert('Error loading project: ' + error.message);
        }
    }

    // Image URL preview
    imageUrlInput.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            previewImg.src = url;
            previewImg.onerror = () => {
                imagePreview.style.display = 'none';
            };
            previewImg.onload = () => {
                imagePreview.style.display = 'block';
            };
        } else {
            imagePreview.style.display = 'none';
        }
    });

    // Save project
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const projectData = {
            title: document.getElementById('projectTitle').value.trim(),
            category: document.getElementById('projectCategory').value,
            description: document.getElementById('projectDescription').value.trim(),
            imageUrl: document.getElementById('projectImageUrl').value.trim(),
            githubUrl: document.getElementById('projectGithubUrl').value.trim(),
            liveUrl: document.getElementById('projectLiveUrl').value.trim(),
            technologies: document.getElementById('projectTechnologies').value
                .split(',')
                .map(t => t.trim())
                .filter(t => t),
            order: parseInt(document.getElementById('projectOrder').value),
            featured: document.getElementById('projectFeatured').checked,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            if (currentProjectId) {
                // Update existing project
                await db.collection('projects').doc(currentProjectId).update(projectData);
                alert('Project updated successfully!');
            } else {
                // Add new project
                projectData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                await db.collection('projects').add(projectData);
                alert('Project added successfully!');
            }

            closeProjectModal();
            loadProjects();

        } catch (error) {
            console.error('Error saving project:', error);
            alert('Error saving project: ' + error.message);
        }
    });

    // ============================================
    // DELETE PROJECT
    // ============================================

    window.confirmDelete = (projectId) => {
        projectToDelete = projectId;
        deleteModal.classList.add('show');
    };

    document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
        if (!projectToDelete) return;

        try {
            await db.collection('projects').doc(projectToDelete).delete();
            alert('Project deleted successfully!');
            closeDeleteModal();
            loadProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Error deleting project: ' + error.message);
        }
    });

    // ============================================
    // MODAL CONTROLS
    // ============================================

    window.editProject = (projectId) => {
        openProjectModal(projectId);
    };

    document.getElementById('closeModal').addEventListener('click', closeProjectModal);
    document.getElementById('cancelBtn').addEventListener('click', closeProjectModal);

    function closeProjectModal() {
        projectModal.classList.remove('show');
        currentProjectId = null;
    }

    document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);

    function closeDeleteModal() {
        deleteModal.classList.remove('show');
        projectToDelete = null;
    }

    // Close modals on outside click
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeProjectModal();
        }
    });

    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });
});
