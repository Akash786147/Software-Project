function showTab(tabId) {
    const tabContents = document.querySelectorAll('.tab-content');
    if (tabContents.length === 0) return;

    tabContents.forEach(content => content.style.display = 'none');
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));

    const selectedTab = document.getElementById(tabId);
    const selectedTabButton = document.querySelector(`[data-tab="${tabId}"]`);

    if (selectedTab && selectedTabButton) {
        selectedTab.style.display = 'block';
        selectedTabButton.classList.add('active');
        localStorage.setItem('activeTab', tabId);
    }
}

function populateFacultyDropdown() {
    const facultySelect = document.getElementById('facultySelect');
    if (!facultySelect) return;

    // Keep only the first option
    while (facultySelect.options.length > 1) {
        facultySelect.remove(1);
    }

    facultyDB.getAllFaculty().forEach(f => {
        const option = document.createElement('option');
        option.value = f.id;
        option.textContent = f.name;
        facultySelect.appendChild(option);
    });


    $(facultySelect).select2({
        placeholder: "Search and select faculty...",
        allowClear: true,
        width: '100%'
    });
}

function getAssignedCourses(facultyId) {
    const assignments = JSON.parse(localStorage.getItem('courseAssignments')) || [];
    return assignments.filter(a => a.facultyId === facultyId);
}

function renderAssignedCourses(facultyId) {
    const assignments = getAssignedCourses(facultyId);
    const tbody = document.querySelector('#viewFacultyModal table.data-table tbody');
    if (!tbody) return;

    // Clear previous rows to prevent duplicates
    tbody.innerHTML = '';

    if (assignments.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="3">No courses assigned.</td>';
        tbody.appendChild(row);
        return;
    }

    assignments.forEach(a => {
        const courseInfo = {
            'CSE2709': { name: 'Computer Organization and Architecture', credits: '3.0' },
            'CSE3005': { name: 'Software Engineering', credits: '3.0' },
            'CSE3709': { name: 'Mobile Application Development', credits: '3.0' },
            'PSP2709': { name: 'Design Thinking', credits: '2.0' },
            'CSE2032': { name: 'Machine Learning', credits: '4.0' },
            'CSE4002': { name: 'Advanced Computer Architecture', credits: '4.0' }
        }[a.courseCode] || { name: a.courseCode, credits: '-' };

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${a.courseCode}</td>
            <td>${courseInfo.name}</td>
            <td>${courseInfo.credits}</td>
        `;
        tbody.appendChild(row);
    });
}

// School to Department mapping
const schoolDepartments = {
    SOET: [
        'Computer Science and Engineering (CSE)',
        'Electronics and Communication Engineering (ECE)',
        'Mechanical Engineering (ME)',
        'Civil Engineering (CE)',
        'Electrical Engineering (EE)'
    ],
    SOM: [
        'Bachelor of Business Administration (BBA)',
        'BBA+MBA',
        'Master of Business Administration (MBA)',
        'Bachelor of Commerce (B.Com)'
    ],
    SOL: [
        'Bachelor of Arts and Bachelor of Law (BA LLB)',
        'Bachelor of Business Administration and Bachelor of Law (BBA LLB)'
    ],
    SOLS: [
        'Psychology',
        'Economics',
        'Political Science'
    ]
};

function updateDepartmentOptions() {
    const schoolSelect = document.getElementById('school');
    const departmentSelect = document.getElementById('department');
    if (!schoolSelect || !departmentSelect) return;
    const school = schoolSelect.value;
    departmentSelect.innerHTML = '<option value="">Select Department</option>';
    if (school && schoolDepartments[school]) {
        schoolDepartments[school].forEach(dep => {
            const option = document.createElement('option');
            option.value = dep;
            option.textContent = dep;
            departmentSelect.appendChild(option);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.facultyDB = {
        init: function() {
            if (!localStorage.getItem('faculty')) {
                localStorage.setItem('faculty', JSON.stringify([]));
            }
            if (!localStorage.getItem('courseAssignments')) {
                localStorage.setItem('courseAssignments', JSON.stringify([]));
            }
        },

        getAllFaculty: function() {
            return JSON.parse(localStorage.getItem('faculty')) || [];
        },

        createFaculty: function(facultyData) {
            const facultyList = this.getAllFaculty();
            const newFaculty = {
                ...facultyData,
                id: 'FAC' + (facultyList.length + 1).toString().padStart(3, '0')
            };
            facultyList.push(newFaculty);
            localStorage.setItem('faculty', JSON.stringify(facultyList));
            return newFaculty;
        },

        getFacultyById: function(id) {
            return this.getAllFaculty().find(f => f.id === id);
        },

        updateFaculty: function(id, facultyData) {
            const facultyList = this.getAllFaculty();
            const index = facultyList.findIndex(f => f.id === id);
            if (index !== -1) {
                facultyList[index] = { ...facultyList[index], ...facultyData };
                localStorage.setItem('faculty', JSON.stringify(facultyList));
                return true;
            }
            return false;
        },

        deleteFaculty: function(id) {
            const facultyList = this.getAllFaculty();
            const updatedList = facultyList.filter(f => f.id !== id);
            localStorage.setItem('faculty', JSON.stringify(updatedList));
            return true;
        },

        assignCourse: function(assignment) {
            const assignments = JSON.parse(localStorage.getItem('courseAssignments')) || [];
            assignments.push(assignment);
            localStorage.setItem('courseAssignments', JSON.stringify(assignments));
            return true;
        }
    };

    facultyDB.init();

    const tabs = document.querySelectorAll('.tab');
    if (tabs.length > 0) {
        const activeTab = localStorage.getItem('activeTab') || 'tab1';
        showTab(activeTab);
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                showTab(this.getAttribute('data-tab'));
            });
        });
    }

    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage || (currentPage === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });

    document.querySelectorAll('[data-modal]').forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            if (modalId === 'assignCourseModal') {
                populateFacultyDropdown();
                // Initialize Select2 for course select
                $('#courseSelect').select2({
                    placeholder: "Search and select course...",
                    allowClear: true,
                    width: '100%'
                });
            }
            openModal(modalId);
        });
    });

    document.querySelectorAll('.close-btn').forEach(button => {
        button.addEventListener('click', function() {
            closeModal(this.closest('.modal').id);
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    const addFacultyForm = document.getElementById('addFacultyForm');
    if (addFacultyForm) {
        document.querySelectorAll('[data-modal="addFacultyModal"]').forEach(button => {
            button.addEventListener('click', function() {
                const facultyList = facultyDB.getAllFaculty();
                const nextId = 'FAC' + (facultyList.length + 1).toString().padStart(3, '0');
                document.getElementById('facultyId').value = nextId;
            });
        });

        addFacultyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(addFacultyForm);
            const faculty = {
                school: formData.get('school'),
                department: formData.get('department'),
                name: formData.get('facultyName'),
                designation: formData.get('designation'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                joiningDate: formData.get('joiningDate')
            };

            const editId = this.dataset.editId;
            if (editId) {
                if (facultyDB.updateFaculty(editId, faculty)) {
                    alert('Faculty updated successfully!');
                    this.dataset.editId = '';
                    const submitBtn = this.querySelector('button[type="submit"]');
                    if (submitBtn) submitBtn.textContent = 'Add Faculty';
                }
            } else {
                const newFaculty = facultyDB.createFaculty(faculty);
                if (newFaculty) alert('Faculty created successfully!');
            }

            addFacultyForm.reset();
            closeModal('addFacultyModal');
            updateFacultyTable();
        });
    }

    const assignCourseForm = document.getElementById('assignCourseForm');
    if (assignCourseForm) {
        assignCourseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const assignment = {
                facultyId: document.getElementById('facultySelect').value,
                courseCode: document.getElementById('courseSelect').value
            };

            if (!assignment.facultyId || !assignment.courseCode) {
                alert('Please select both faculty and course');
                return;
            }

            if (facultyDB.assignCourse(assignment)) {
                alert('Course assigned successfully!');
                closeModal('assignCourseModal');
                assignCourseForm.reset();
                // Reset Select2 dropdowns
                $('#facultySelect').val('').trigger('change');
                $('#courseSelect').val('').trigger('change');
            }
        });
    }

    const searchInput = document.getElementById('facultySearch');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            const faculty = facultyDB.getAllFaculty();
            const filteredFaculty = faculty.filter(f => 
                f.name.toLowerCase().includes(searchTerm) ||
                f.department.toLowerCase().includes(searchTerm) ||
                f.designation.toLowerCase().includes(searchTerm) ||
                f.email.toLowerCase().includes(searchTerm) ||
                f.id.toLowerCase().includes(searchTerm)
            );
            updateFacultyTable(filteredFaculty);
        });
    }

    // School/Department dynamic update
    const schoolSelect = document.getElementById('school');
    if (schoolSelect) {
        schoolSelect.addEventListener('change', updateDepartmentOptions);
    }

    updateFacultyTable();
});

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function updateFacultyTable(facultyList = null) {
    const table = document.getElementById('facultyTable');
    if (!table) return;

    const faculty = facultyList || facultyDB.getAllFaculty();
    const tbody = table.querySelector('tbody');
    if (tbody) tbody.remove();

    const newTbody = document.createElement('tbody');
    faculty.forEach(f => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${f.id}</td>
            <td>${f.name}</td>
            <td>${f.school || ''}</td>
            <td>${f.department}</td>
            <td>${f.designation}</td>
            <td>${f.email}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewFaculty('${f.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="editFaculty('${f.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteFaculty('${f.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        newTbody.appendChild(row);
    });
    table.appendChild(newTbody);
}

function viewFaculty(id) {
    const faculty = facultyDB.getFacultyById(id);
    if (faculty) {
        document.getElementById('view-facultyId').textContent = faculty.id;
        document.getElementById('view-facultyName').textContent = faculty.name;
        document.getElementById('view-department').textContent = faculty.department;
        document.getElementById('view-designation').textContent = faculty.designation;
        document.getElementById('view-email').textContent = faculty.email;
        document.getElementById('view-phone').textContent = faculty.phone;
        document.getElementById('view-joiningDate').textContent = faculty.joiningDate;
        renderAssignedCourses(faculty.id);
        openModal('viewFacultyModal');
    }
}

function editFaculty(id) {
    const faculty = facultyDB.getFacultyById(id);
    if (faculty) {
        const form = document.getElementById('addFacultyForm');
        form.dataset.editId = id;

        document.getElementById('facultyName').value = faculty.name;
        document.getElementById('school').value = faculty.school || '';
        updateDepartmentOptions();
        document.getElementById('department').value = faculty.department || '';
        document.getElementById('designation').value = faculty.designation;
        document.getElementById('email').value = faculty.email;
        document.getElementById('phone').value = faculty.phone;
        document.getElementById('joiningDate').value = faculty.joiningDate;

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Save Changes';

        openModal('addFacultyModal');
    }
}

function deleteFaculty(id) {
    if (confirm('Are you sure you want to delete this faculty member?')) {
        if (facultyDB.deleteFaculty(id)) {
            updateFacultyTable();
        }
    }
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function handleFormSubmit(formId, dataKey, redirectUrl = null) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        data.id = Date.now();
        data.timestamp = new Date().toISOString();
        
        const existingData = getData(dataKey) || [];
        existingData.push(data);
        
        saveData(dataKey, existingData);
        form.reset();
        alert('Data saved successfully!');
        
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    });
}

function deleteItem(dataKey, itemId) {
    const existingData = getData(dataKey) || [];
    const updatedData = existingData.filter(item => item.id !== itemId);
    saveData(dataKey, updatedData);
    location.reload();
}

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
                if (cell && cell.textContent.toLowerCase().includes(searchTerm)) {
                    match = true;
                }
            });
            row.style.display = match ? '' : 'none';
        });
    });
}

const showLoading = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) element.innerHTML = '<div class="loading">Loading...</div>';
};

const showError = (message) => alert('Error: ' + message);
const showSuccess = (message) => alert('Success: ' + message);

function setupSearchableDropdown(searchInputId, selectId) {
    const searchInput = document.getElementById(searchInputId);
    const select = document.getElementById(selectId);
    if (!searchInput || !select) return;

    searchInput.addEventListener('keyup', function() {
        const searchTerm = this.value.toLowerCase();
        const options = select.getElementsByTagName('option');

        for (let i = 1; i < options.length; i++) { // Start from 1 to skip the first "Select" option
            const option = options[i];
            const text = option.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                option.style.display = '';
            } else {
                option.style.display = 'none';
            }
        }
    });
}

function setupSelectSearch(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;

    // Create a wrapper div
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);

    // Create search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'form-control';
    searchInput.style.marginBottom = '5px';
    searchInput.placeholder = 'Type to search...';
    wrapper.insertBefore(searchInput, select);

    // Add search functionality
    searchInput.addEventListener('keyup', function() {
        const searchTerm = this.value.toLowerCase();
        const options = select.getElementsByTagName('option');

        for (let i = 1; i < options.length; i++) { // Skip first option
            const option = options[i];
            const text = option.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                option.style.display = '';
            } else {
                option.style.display = 'none';
            }
        }
    });

    
    select.addEventListener('change', function() {
        searchInput.value = '';
        const options = select.getElementsByTagName('option');
        for (let i = 1; i < options.length; i++) {
            options[i].style.display = '';
        }
    });
} 