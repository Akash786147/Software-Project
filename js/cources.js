// Tabs functionality (if used on courses.html)
function showTab(tabId) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).style.display = 'block';
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    localStorage.setItem('activeTab', tabId);
}

document.addEventListener('DOMContentLoaded', function() {
    // Tabs (if present)
    const activeTab = localStorage.getItem('activeTab') || 'tab1';
    if (document.querySelector('.tab')) showTab(activeTab);
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            showTab(tabId);
        });
    });

    // Set active nav item
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Modal open/close
    const modalButtons = document.querySelectorAll('[data-modal]');
    modalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            document.getElementById(modalId).style.display = 'block';
        });
    });
    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Search functionality for courses
    setupSearch('courseSearch', 'courseTable', [0, 1, 4]);

    // Semester filter
    document.getElementById('semesterFilter').addEventListener('change', function() {
        const semesterValue = this.value;
        const rows = document.querySelectorAll('#courseTable tbody tr');
        rows.forEach(row => {
            const rowSemester = row.getAttribute('data-semester');
            if (semesterValue === '' || rowSemester === semesterValue) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Add Course form submission
    document.getElementById('addCourseForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const code = document.getElementById('courseCode').value;
        const name = document.getElementById('courseName').value;
        const sessions = document.getElementById('sessions').value;
        const credits = document.getElementById('credits').value;
        const faculty = document.getElementById('faculty').value;
        const semester = document.getElementById('semester').value;

        // Create new row
        const tbody = document.querySelector('#courseTable tbody');
        const tr = document.createElement('tr');
        tr.setAttribute('data-semester', semester);
        tr.innerHTML = `
            <td>${code}</td>
            <td>${name}</td>
            <td>${sessions}</td>
            <td>${credits}</td>
            <td>${faculty}</td>
            <td>
                <button class="action-btn" title="View Course" data-action="view" data-id="${code}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn" title="Update Course" data-action="edit" data-id="${code}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" title="Delete Course" data-action="delete" data-id="${code}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);

        // Re-attach event listeners for new row
        tr.querySelector('[data-action="view"]').addEventListener('click', function() {
            openModal('viewCourseModal');
        });
        tr.querySelector('[data-action="edit"]').addEventListener('click', function() {
            openModal('updateCourseModal');
        });
        tr.querySelector('[data-action="delete"]').addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this course?')) {
                tr.remove();
            }
        });

        // Hide modal and reset form
        document.getElementById('addCourseModal').style.display = 'none';
        this.reset();
        document.getElementById('semesterFilter').dispatchEvent(new Event('change'));
    });
});

// Search utility
function setupSearch(inputId, tableId, columns) {
    const searchInput = document.getElementById(inputId);
    if (!searchInput) return;
    searchInput.addEventListener('keyup', function() {
        const searchTerm = this.value.toLowerCase();
        const table = document.getElementById(tableId);
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            let match = false;
            columns.forEach(colIndex => {
                const cell = row.querySelectorAll('td')[colIndex];
                if (cell) {
                    const text = cell.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        match = true;
                    }
                }
            });
            row.style.display = match ? '' : 'none';
        });
    });
}

// Modal open utility
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
} 