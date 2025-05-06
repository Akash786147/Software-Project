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

// Initialize databases at the start of DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize databases
    facultyDB.init();
    studentDB.init();
    courseDB.init();

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

    // Page-specific initializations
    if (currentPage === 'students.html' || currentPage === '') {
        // Student page initialization
        updateStudentTable();
        
        // Set up course populating for assignment modal
        document.querySelectorAll('[data-modal="assignCourseModal"]').forEach(btn => {
            btn.addEventListener('click', populateCourseOptions);
        });
    }
    
    if (currentPage === 'faculty.html') {
        // Faculty page initialization
        updateFacultyTable();
    }
    
    if (currentPage === 'courses.html') {
        // Course page initialization
        updateCourseList();
    }

    document.querySelectorAll('[data-modal]').forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            if (modalId === 'assignCourseModal') {
                populateFacultyDropdown();
                populateStudentDropdown();
                populateCourseOptions();
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

    // Course search functionality
    const courseSearch = document.getElementById('courseSearch');
    if (courseSearch) {
        courseSearch.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            const courses = courseDB.getAllCourses();
            const filteredCourses = courses.filter(course => {
                return course.code.toLowerCase().includes(searchTerm) || 
                       course.name.toLowerCase().includes(searchTerm) || 
                       course.faculty.toLowerCase().includes(searchTerm);
            });
            
            updateCourseList(filteredCourses);
        });
    }
    
    // Course semester filter
    const semesterFilter = document.getElementById('semesterFilter');
    if (semesterFilter) {
        semesterFilter.addEventListener('change', function() {
            const selectedSemester = this.value;
            const courses = courseDB.getAllCourses();
            
            if (!selectedSemester) {
                updateCourseList(courses);
                return;
            }
            
            const filteredCourses = courses.filter(course => {
                return course.semester === selectedSemester;
            });
            
            updateCourseList(filteredCourses);
        });
    }
    
    // Creating a new course - initialize the form
    document.querySelectorAll('[data-modal="addCourseModal"]').forEach(button => {
        button.addEventListener('click', function() {
            const form = document.getElementById('addCourseForm');
            const isEditMode = form.dataset.editCode;
            
            if (!isEditMode) {
                // Reset form and set button text
                form.reset();
                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) submitButton.textContent = 'Create Course';
                
                // Enable course code field for new courses
                const courseCodeField = document.getElementById('courseCode');
                if (courseCodeField) courseCodeField.readOnly = false;
            }
        });
    });
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

// Database initialization
const db = new SQLite.Database('school.db');

// Create tables if they don't exist
db.serialize(() => {
    // Classes table
    db.run(`CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        batch TEXT NOT NULL,
        branch TEXT NOT NULL,
        class_name TEXT NOT NULL,
        total_students INTEGER DEFAULT 0,
        class_teacher_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Subject Teachers table
    db.run(`CREATE TABLE IF NOT EXISTS subject_teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        class_id INTEGER,
        subject TEXT NOT NULL,
        teacher_id TEXT NOT NULL,
        FOREIGN KEY (class_id) REFERENCES classes(id)
    )`);

    // Students table
    db.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        class_id INTEGER,
        enroll_number TEXT NOT NULL,
        FOREIGN KEY (class_id) REFERENCES classes(id)
    )`);
});



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


// Class Management Functions
class ClassManager {
    // Create a new class
    static async createClass(classData) {
        const { batch, branch, className, subjectTeachers, students } = classData;
        
        try {
            const result = await db.run(
                `INSERT INTO classes (batch, branch, class_name)
                 VALUES (?, ?, ?)`,
                [batch, branch, className]
            );
            
            const classId = result.lastID;
            
            // Add subject teachers
            for (const teacher of subjectTeachers) {
                if (teacher.subject && teacher.teacherId) {
                    await this.addSubjectTeacher(classId, teacher.subject, teacher.teacherId);
                }
            }
            
            // Add students
            for (const student of students) {
                if (student.enrollNumber) {
                    await this.addStudent(classId, student.enrollNumber);
                }
            }
            
            return classId;
        } catch (error) {
            console.error('Error creating class:', error);
            throw error;
        }
    }

    // Update an existing class
    static async updateClass(classId, classData) {
        const { batch, branch, className, subjectTeachers, students } = classData;
        
        try {
            await db.run(
                `UPDATE classes 
                 SET batch = ?, branch = ?, class_name = ?
                 WHERE id = ?`,
                [batch, branch, className, classId]
            );
            
            // Update subject teachers
            await db.run('DELETE FROM subject_teachers WHERE class_id = ?', [classId]);
            for (const teacher of subjectTeachers) {
                if (teacher.subject && teacher.teacherId) {
                    await this.addSubjectTeacher(classId, teacher.subject, teacher.teacherId);
                }
            }
            
            // Update students
            await db.run('DELETE FROM students WHERE class_id = ?', [classId]);
            for (const student of students) {
                if (student.enrollNumber) {
                    await this.addStudent(classId, student.enrollNumber);
                }
            }
        } catch (error) {
            console.error('Error updating class:', error);
            throw error;
        }
    }

    // Get class details
    static getClassDetails(classId) {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM classes WHERE id = ?`,
                [classId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    }

    // Delete a class
    static deleteClass(classId) {
        return new Promise((resolve, reject) => {
            db.run(
                `DELETE FROM classes WHERE id = ?`,
                [classId],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }

    // Get all classes for a batch and school
    static getClassesByBatchAndSchool(batch, school) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM classes WHERE batch = ? AND school = ?`,
                [batch, school],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    // Add subject teacher
    static addSubjectTeacher(classId, subject, teacherId) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO subject_teachers (class_id, subject, teacher_id)
                 VALUES (?, ?, ?)`,
                [classId, subject, teacherId],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    // Get subject teachers for a class
    static getSubjectTeachers(classId) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM subject_teachers WHERE class_id = ?`,
                [classId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    // Add student
    static addStudent(classId, studentData) {
        return new Promise((resolve, reject) => {
            const { enrollNumber } = studentData;
            
            db.run(
                `INSERT INTO students (class_id, enroll_number)
                 VALUES (?, ?)`,
                [classId, enrollNumber],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    // Get students for a class
    static getStudents(classId) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM students WHERE class_id = ?`,
                [classId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    // Get all faculty
    static async getFaculty() {
        try {
            const faculty = await db.all('SELECT * FROM faculty');
            return faculty;
        } catch (error) {
            console.error('Error getting faculty:', error);
            throw error;
        }
    }

    // Get all courses
    static async getCourses() {
        try {
            const courses = await db.all('SELECT * FROM courses');
            return courses;
        } catch (error) {
            console.error('Error getting courses:', error);
            throw error;
        }
    }
}

// LocalStorage Cache Management
class ClassCache {
    static getCachedClasses() {
        const cached = localStorage.getItem('classes');
        return cached ? JSON.parse(cached) : null;
    }

    static setCachedClasses(classes) {
        localStorage.setItem('classes', JSON.stringify(classes));
    }

    static clearCache() {
        localStorage.removeItem('classes');
    }

    static getDraftClass() {
        const draft = localStorage.getItem('classDraft');
        return draft ? JSON.parse(draft) : null;
    }

    static setDraftClass(classData) {
        localStorage.setItem('classDraft', JSON.stringify(classData));
    }

    static clearDraft() {
        localStorage.removeItem('classDraft');
    }
}

// Export the classes for use in other files
window.ClassManager = ClassManager;
window.ClassCache = ClassCache;

// Event Handlers and UI Updates
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI elements
    const batchSelect = document.getElementById('batchSelect');
    const schoolSelect = document.getElementById('schoolSelect');
    const classSelect = document.getElementById('classSelect');
    const createClassBtn = document.getElementById('createClassBtn');
    const deleteClassBtn = document.getElementById('deleteClassBtn');
    const editClassBtn = document.getElementById('editClassBtn');
    const facultySelect = document.getElementById('modalFaculty');
    const courseSelect = document.getElementById('modalCourse');

    // Load initial data
    loadBatches();
    loadSchools();
    loadFaculty();
    loadCourses();

    // Event Listeners
    batchSelect.addEventListener('change', handleBatchChange);
    schoolSelect.addEventListener('change', handleSchoolChange);
    classSelect.addEventListener('change', handleClassChange);
    createClassBtn.addEventListener('click', showCreateClassModal);
    deleteClassBtn.addEventListener('click', handleDeleteClass);
    editClassBtn.addEventListener('click', showEditClassModal);

    // Load cached data if available
    const cachedClasses = ClassCache.getCachedClasses();
    if (cachedClasses) {
        updateClassSelect(cachedClasses);
    }
});

// Load batches from database
async function loadBatches() {
    try {
        const batches = await ClassManager.getBatches();
        const batchSelect = document.getElementById('batchSelect');
        batchSelect.innerHTML = '<option value="">Select Batch</option>';
        batches.forEach(batch => {
            const option = document.createElement('option');
            option.value = batch;
            option.textContent = batch;
            batchSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading batches:', error);
        showError('Failed to load batches');
    }
}

// Load schools from database
async function loadSchools() {
    try {
        const schools = await ClassManager.getSchools();
        const schoolSelect = document.getElementById('schoolSelect');
        schoolSelect.innerHTML = '<option value="">Select School</option>';
        schools.forEach(school => {
            const option = document.createElement('option');
            option.value = school;
            option.textContent = school;
            schoolSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading schools:', error);
        showError('Failed to load schools');
    }
}

// Load faculty from database
async function loadFaculty() {
    try {
        const faculty = await ClassManager.getFaculty();
        const facultySelect = document.getElementById('modalFaculty');
        facultySelect.innerHTML = '<option value="">Select Faculty</option>';
        faculty.forEach(f => {
            const option = document.createElement('option');
            option.value = f.id;
            option.textContent = f.name;
            facultySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading faculty:', error);
        showError('Failed to load faculty');
    }
}

// Load courses from database
async function loadCourses() {
    try {
        const courses = await ClassManager.getCourses();
        const courseSelect = document.getElementById('modalCourse');
        courseSelect.innerHTML = '<option value="">Select Course</option>';
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.name;
            courseSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading courses:', error);
        showError('Failed to load courses');
    }
}

// Handle batch selection change
async function handleBatchChange() {
    const batch = document.getElementById('batchSelect').value;
    const school = document.getElementById('schoolSelect').value;
    
    if (batch && school) {
        try {
            const classes = await ClassManager.getClassesByBatchAndSchool(batch, school);
            ClassCache.setCachedClasses(classes);
            updateClassSelect(classes);
        } catch (error) {
            console.error('Error loading classes:', error);
            showError('Failed to load classes');
        }
    }
}

// Handle school selection change
async function handleSchoolChange() {
    const batch = document.getElementById('batchSelect').value;
    const school = document.getElementById('schoolSelect').value;
    
    if (batch && school) {
        try {
            const classes = await ClassManager.getClassesByBatchAndSchool(batch, school);
            ClassCache.setCachedClasses(classes);
            updateClassSelect(classes);
        } catch (error) {
            console.error('Error loading classes:', error);
            showError('Failed to load classes');
        }
    }
}

// Update class selection dropdown
function updateClassSelect(classes) {
    const classSelect = document.getElementById('classSelect');
    classSelect.innerHTML = '<option value="">Select Class</option>';
    
    classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls.id;
        option.textContent = cls.class_name;
        classSelect.appendChild(option);
    });
}

// Handle class selection change
async function handleClassChange() {
    const classId = document.getElementById('classSelect').value;
    if (classId) {
        try {
            const classDetails = await ClassManager.getClassDetails(classId);
            const subjectTeachers = await ClassManager.getSubjectTeachers(classId);
            const students = await ClassManager.getStudents(classId);
            
            updateClassDetails(classDetails, subjectTeachers, students);
        } catch (error) {
            console.error('Error loading class details:', error);
            showError('Failed to load class details');
        }
    } else {
        hideClassDetails();
    }
}

// Update class details display
function updateClassDetails(classDetails, subjectTeachers, students) {
    const detailsCard = document.getElementById('classDetailsCard');
    detailsCard.style.display = 'block';

    // Update basic information
    document.getElementById('batchInfo').textContent = classDetails.batch;
    document.getElementById('schoolInfo').textContent = classDetails.school;
    document.getElementById('totalStudentsInfo').textContent = classDetails.total_students;

    // Update subject teachers
    const teachersList = document.getElementById('subjectTeachersList');
    teachersList.innerHTML = '';
    subjectTeachers.forEach(teacher => {
        const li = document.createElement('li');
        li.textContent = `${teacher.subject}: ${teacher.teacher_id}`;
        teachersList.appendChild(li);
    });

    // Update students
    const studentsList = document.getElementById('studentsList');
    studentsList.innerHTML = '';
    students.forEach(student => {
        const li = document.createElement('li');
        li.textContent = `${student.enroll_number}: ${student.name}`;
        studentsList.appendChild(li);
    });
}

// Hide class details
function hideClassDetails() {
    const detailsCard = document.getElementById('classDetailsCard');
    detailsCard.style.display = 'none';
}

// Show create class modal
function showCreateClassModal() {
    const modal = document.getElementById('createClassModal');
    modal.style.display = 'block';
    
    // Load draft if exists
    const draft = ClassCache.getDraftClass();
    if (draft) {
        document.getElementById('modalClassName').value = draft.className || '';
    }
}

// Handle create class form submission
async function handleCreateClass(event) {
    event.preventDefault();
    
    const formData = {
        batch: document.getElementById('modalBatch').value,
        school: document.getElementById('modalSchool').value,
        className: document.getElementById('modalClassName').value,
        faculty: document.getElementById('modalFaculty').value,
        course: document.getElementById('modalCourse').value,
        subjectTeachers: Array.from(document.querySelectorAll('.subject-teacher-row')).map(row => ({
            subject: row.querySelector('.subject-select').value,
            teacherId: row.querySelector('.teacher-select').value
        })),
        students: Array.from(document.querySelectorAll('.student-row')).map(row => ({
            enrollNumber: row.querySelector('.student-inputs input').value
        }))
    };

    try {
        const classId = await ClassManager.createClass(formData);
        ClassCache.clearCache();
        handleBatchChange();
        hideModal('createClassModal');
        showSuccess('Class created successfully');
    } catch (error) {
        console.error('Error creating class:', error);
        showError('Failed to create class');
    }
}

// Show edit class modal
async function showEditClassModal() {
    const classId = document.getElementById('classSelect').value;
    if (!classId) return;

    try {
        const classDetails = await ClassManager.getClassDetails(classId);
        const subjectTeachers = await ClassManager.getSubjectTeachers(classId);
        const students = await ClassManager.getStudents(classId);

        const modal = document.getElementById('editClassModal');
        modal.style.display = 'block';

        // Populate form with class details
        document.getElementById('editClassName').value = classDetails.class_name;
        document.getElementById('editClassTeacher').value = classDetails.class_teacher_id;

        // Populate subject teachers
        const teachersContainer = document.getElementById('editSubjectTeachersContainer');
        teachersContainer.innerHTML = '';
        subjectTeachers.forEach(teacher => {
            addSubjectTeacherRow(teachersContainer, teacher.subject, teacher.teacher_id);
        });

        // Populate students
        const studentsContainer = document.getElementById('editStudentsContainer');
        studentsContainer.innerHTML = '';
        students.forEach(student => {
            addStudentRow(studentsContainer, student.enroll_number, student.name, student.email, student.phone);
        });
    } catch (error) {
        console.error('Error loading class details for edit:', error);
        showError('Failed to load class details');
    }
}

// Handle edit class form submission
async function handleEditClass(event) {
    event.preventDefault();
    
    const classId = document.getElementById('classSelect').value;
    const formData = {
        batch: document.getElementById('modalBatch').value,
        school: document.getElementById('modalSchool').value,
        className: document.getElementById('modalClassName').value,
        faculty: document.getElementById('modalFaculty').value,
        course: document.getElementById('modalCourse').value,
        subjectTeachers: Array.from(document.querySelectorAll('.subject-teacher-row')).map(row => ({
            subject: row.querySelector('.subject-select').value,
            teacherId: row.querySelector('.teacher-select').value
        })),
        students: Array.from(document.querySelectorAll('.student-row')).map(row => ({
            enrollNumber: row.querySelector('.student-inputs input').value
        }))
    };

    try {
        await ClassManager.updateClass(classId, formData);
        ClassCache.clearCache();
        handleClassChange();
        hideModal('editClassModal');
        showSuccess('Class updated successfully');
    } catch (error) {
        console.error('Error updating class:', error);
        showError('Failed to update class');
    }
}

// Handle delete class
async function handleDeleteClass() {
    const classId = document.getElementById('classSelect').value;
    if (!classId) return;

    if (confirm('Are you sure you want to delete this class?')) {
        try {
            await ClassManager.deleteClass(classId);
            ClassCache.clearCache();
            handleBatchChange();
            hideClassDetails();
            showSuccess('Class deleted successfully');
        } catch (error) {
            console.error('Error deleting class:', error);
            showError('Failed to delete class');
        }
    }
}

// Utility functions
function showError(message) {
    // Implement error notification
    alert(message);
}

function showSuccess(message) {
    // Implement success notification
    alert(message);
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Add event listeners for form submissions
document.getElementById('createClassForm').addEventListener('submit', handleCreateClass);
document.getElementById('editClassForm').addEventListener('submit', handleEditClass);

// Initialize database tables
async function initializeDatabase() {
    try {
        // Create classes table
        await db.run(`
            CREATE TABLE IF NOT EXISTS classes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                batch TEXT NOT NULL,
                branch TEXT NOT NULL,
                class_name TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create subject_teachers table
        await db.run(`
            CREATE TABLE IF NOT EXISTS subject_teachers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                class_id INTEGER NOT NULL,
                subject TEXT NOT NULL,
                teacher_id TEXT NOT NULL,
                FOREIGN KEY (class_id) REFERENCES classes(id)
            )
        `);

        // Create students table
        await db.run(`
            CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                class_id INTEGER NOT NULL,
                enroll_number TEXT NOT NULL,
                FOREIGN KEY (class_id) REFERENCES classes(id)
            )
        `);
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

// Initialize database when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initializeDatabase();
    } catch (error) {
        console.error('Error during initialization:', error);
        showError('Failed to initialize application');
    }
});

// Functions for student management
function populateStudentDropdown() {
    const studentSelect = document.getElementById('studentSelect');
    if (!studentSelect) return;

    // Keep only the first option
    while (studentSelect.options.length > 1) {
        studentSelect.remove(1);
    }

    studentDB.getAllStudents().forEach(s => {
        const option = document.createElement('option');
        option.value = s.id;
        option.textContent = `${s.id} - ${s.firstName} ${s.lastName}`;
        studentSelect.appendChild(option);
    });

    // Initialize Select2 if available
    if (typeof $ !== 'undefined' && $.fn.select2) {
        $(studentSelect).select2({
            placeholder: "Search and select student...",
            allowClear: true,
            width: '100%'
        });
    }
}

function populateCourseOptions() {
    // Get elements that display course options
    const courseCheckboxes = document.querySelector('[data-course-checkboxes]');
    const courseSelect = document.getElementById('courseSelect');
    
    // Get courses from localStorage
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    
    // Populate checkboxes in assign course modal
    if (courseCheckboxes) {
        courseCheckboxes.innerHTML = '';
        courses.forEach((course, index) => {
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'checkbox-container';
            checkboxDiv.innerHTML = `
                <input type="checkbox" id="course${index}" name="courses" value="${course.code}">
                <label for="course${index}">${course.code} - ${course.name}</label>
            `;
            courseCheckboxes.appendChild(checkboxDiv);
        });
    }
    
    // Populate course select dropdown
    if (courseSelect) {
        // Keep only the first option
        while (courseSelect.options.length > 1) {
            courseSelect.remove(1);
        }
        
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.code;
            option.textContent = `${course.code} - ${course.name}`;
            courseSelect.appendChild(option);
        });
        
        // Initialize Select2 if available
        if (typeof $ !== 'undefined' && $.fn.select2) {
            $(courseSelect).select2({
                placeholder: "Search and select course...",
                allowClear: true,
                width: '100%'
            });
        }
    }
}

function getEnrolledCourses(studentId) {
    return studentDB.getEnrolledCourses(studentId);
}

function renderEnrolledCourses(studentId) {
    const enrollments = getEnrolledCourses(studentId);
    const tbody = document.querySelector('#viewStudentModal table.data-table tbody');
    if (!tbody) return;

    // Clear previous data
    tbody.innerHTML = '';

    if (enrollments.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5">No courses enrolled.</td>';
        tbody.appendChild(row);
        return;
    }

    // Get course information from localStorage
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const faculty = JSON.parse(localStorage.getItem('faculty')) || [];

    enrollments.forEach(enrollment => {
        const course = courses.find(c => c.code === enrollment.courseCode) || { 
            name: enrollment.courseCode, 
            semester: '-', 
            faculty: '-' 
        };
        
        // Find faculty name
        let facultyName = course.faculty;
        const facultyId = 
            (JSON.parse(localStorage.getItem('courseAssignments')) || [])
            .find(a => a.courseCode === enrollment.courseCode)?.facultyId;
        
        if (facultyId) {
            const facultyMember = faculty.find(f => f.id === facultyId);
            if (facultyMember) {
                facultyName = facultyMember.name;
            }
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${enrollment.courseCode}</td>
            <td>${course.name}</td>
            <td>Semester ${enrollment.semester || course.semester}</td>
            <td>${facultyName}</td>
            <td><span class="status submitted">Active</span></td>
        `;
        tbody.appendChild(row);
    });
}

function updateStudentTable(students) {
    const table = document.getElementById('studentTable');
    if (!table) return;
    
    const studentList = students || studentDB.getAllStudents();
    const tbody = document.createElement('tbody');

    if (studentList.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6">No students found.</td>';
        tbody.appendChild(row);
    } else {
        studentList.forEach(student => {
            const row = document.createElement('tr');
            const fullName = `${student.firstName || ''} ${student.lastName || ''}`.trim();
            
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${fullName}</td>
                <td>${student.program || ''}</td>
                <td>${student.year || ''}</td>
                <td>${student.email || ''}</td>
                <td>
                    <button class="action-btn" title="View Student" onclick="viewStudent('${student.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" title="Update Student" onclick="editStudent('${student.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" title="Delete Student" onclick="deleteStudent('${student.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="action-btn" title="Assign Courses" onclick="assignCoursesToStudent('${student.id}')">
                        <i class="fas fa-book"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Replace the existing tbody
    const existingTbody = table.querySelector('tbody');
    if (existingTbody) existingTbody.remove();
    table.appendChild(tbody);
}

function viewStudent(id) {
    const student = studentDB.getStudentById(id);
    if (!student) return;
    
    // Populate student info
    document.getElementById('view-studentId').textContent = student.id;
    document.getElementById('view-studentName').textContent = `${student.firstName || ''} ${student.lastName || ''}`.trim();
    document.getElementById('view-program').textContent = student.program || '';
    document.getElementById('view-year').textContent = student.year || '';
    document.getElementById('view-email').textContent = student.email || '';
    document.getElementById('view-phone').textContent = student.phone || '';
    document.getElementById('view-dob').textContent = student.dob ? new Date(student.dob).toLocaleDateString() : '';
    document.getElementById('view-address').textContent = student.address || '';
    
    // Render enrolled courses
    renderEnrolledCourses(id);
    
    // Show the modal
    openModal('viewStudentModal');
}

function editStudent(id) {
    const student = studentDB.getStudentById(id);
    if (!student) return;
    
    // Set form to edit mode
    const form = document.getElementById('addStudentForm');
    form.dataset.editId = id;
    
    // Populate form fields
    document.getElementById('studentId').value = student.id;
    document.getElementById('firstName').value = student.firstName || '';
    document.getElementById('lastName').value = student.lastName || '';
    document.getElementById('program').value = student.program || '';
    document.getElementById('year').value = student.year || '';
    document.getElementById('email').value = student.email || '';
    document.getElementById('phone').value = student.phone || '';
    document.getElementById('dob').value = student.dob || '';
    document.getElementById('address').value = student.address || '';
    
    // Change submit button text
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.textContent = 'Update Student';
    
    // Show the modal
    openModal('addStudentModal');
}

function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
        if (studentDB.deleteStudent(id)) {
            alert('Student deleted successfully.');
            updateStudentTable();
        } else {
            alert('Failed to delete student.');
        }
    }
}

function assignCoursesToStudent(id) {
    const student = studentDB.getStudentById(id);
    if (!student) return;
    
    // Populate the course options
    populateCourseOptions();
    
    // Pre-select the student
    const studentSelect = document.getElementById('studentSelect');
    if (studentSelect) studentSelect.value = id;
    
    // Show the modal
    openModal('assignCourseModal');
}

// Add event handler for the student form submission
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Student form handling
    const addStudentForm = document.getElementById('addStudentForm');
    if (addStudentForm) {
        addStudentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const student = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                program: formData.get('program'),
                year: formData.get('year'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                dob: formData.get('dob'),
                address: formData.get('address')
            };
            
            const editId = this.dataset.editId;
            
            if (editId) {
                // Update existing student
                if (studentDB.updateStudent(editId, student)) {
                    alert('Student updated successfully!');
                    const submitButton = this.querySelector('button[type="submit"]');
                    if (submitButton) submitButton.textContent = 'Create Student';
                    this.dataset.editId = '';
                } else {
                    alert('Failed to update student.');
                }
            } else {
                // Create new student
                student.id = formData.get('studentId') || '';
                const newStudent = studentDB.createStudent(student);
                if (newStudent) {
                    alert('Student created successfully!');
                } else {
                    alert('Failed to create student.');
                }
            }
            
            // Reset form and update table
            this.reset();
            closeModal('addStudentModal');
            updateStudentTable();
        });
    }
    
    // Assign course form handling
    const assignCourseForm = document.getElementById('assignCourseForm');
    if (assignCourseForm) {
        assignCourseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const studentId = document.getElementById('studentSelect').value;
            const semester = document.getElementById('semester').value;
            
            // Get selected courses
            const selectedCourses = [];
            document.querySelectorAll('input[name="courses"]:checked').forEach(checkbox => {
                selectedCourses.push(checkbox.value);
            });
            
            if (!studentId || selectedCourses.length === 0) {
                alert('Please select a student and at least one course.');
                return;
            }
            
            // Assign each selected course
            let allSuccess = true;
            selectedCourses.forEach(courseCode => {
                const enrollment = {
                    studentId,
                    courseCode,
                    semester,
                    date: new Date().toISOString()
                };
                
                if (!studentDB.assignCourse(enrollment)) {
                    allSuccess = false;
                }
            });
            
            if (allSuccess) {
                alert('Courses assigned successfully!');
                this.reset();
                closeModal('assignCourseModal');
            } else {
                alert('Some courses could not be assigned.');
            }
        });
    }
    
    // Initialize student table if on the student page
    const studentTable = document.getElementById('studentTable');
    if (studentTable) {
        updateStudentTable();
        populateCourseOptions();
    }
    
    // Add event listeners for search and filter
    const studentSearch = document.getElementById('studentSearch');
    if (studentSearch) {
        studentSearch.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            const students = studentDB.getAllStudents();
            const filteredStudents = students.filter(student => {
                const name = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase();
                const program = (student.program || '').toLowerCase();
                const email = (student.email || '').toLowerCase();
                const id = (student.id || '').toLowerCase();
                
                return name.includes(searchTerm) || 
                       program.includes(searchTerm) || 
                       email.includes(searchTerm) || 
                       id.includes(searchTerm);
            });
            
            updateStudentTable(filteredStudents);
        });
    }
    
    const programFilter = document.getElementById('programFilter');
    const yearFilter = document.getElementById('yearFilter');
    const searchStudentsBtn = document.getElementById('searchStudentsBtn');
    
    if (searchStudentsBtn && programFilter && yearFilter) {
        searchStudentsBtn.addEventListener('click', function() {
            const programValue = programFilter.value;
            const yearValue = yearFilter.value;
            const searchTerm = studentSearch ? studentSearch.value.toLowerCase() : '';
            
            const students = studentDB.getAllStudents();
            const filteredStudents = students.filter(student => {
                const matchesProgram = !programValue || (student.program || '') === programValue;
                const matchesYear = !yearValue || (student.year || '') === yearValue;
                const matchesSearch = !searchTerm || 
                    `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase().includes(searchTerm) ||
                    (student.email || '').toLowerCase().includes(searchTerm) ||
                    (student.id || '').toLowerCase().includes(searchTerm);
                
                return matchesProgram && matchesYear && matchesSearch;
            });
            
            updateStudentTable(filteredStudents);
        });
    }
    
    // Initialize studentId input for new students
    document.querySelectorAll('[data-modal="addStudentModal"]').forEach(button => {
        button.addEventListener('click', function() {
            const form = document.getElementById('addStudentForm');
            const isEditMode = form.dataset.editId;
            
            if (!isEditMode) {
                const studentList = studentDB.getAllStudents();
                const newId = 'STU' + (studentList.length + 1).toString().padStart(3, '0');
                document.getElementById('studentId').value = newId;
                
                // Reset form and set button text
                form.reset();
                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) submitButton.textContent = 'Create Student';
            }
        });
    });
});

// Course operation functions
function viewCourse(code) {
    const course = courseDB.getCourseByCode(code);
    if (!course) return;
    
    // Populate course info in view modal
    const viewModal = document.getElementById('viewCourseModal');
    if (!viewModal) return;
    
    document.getElementById('view-courseCode').textContent = course.code;
    document.getElementById('view-courseName').textContent = course.name;
    document.getElementById('view-credits').textContent = course.credits;
    document.getElementById('view-sessions').textContent = course.sessions;
    document.getElementById('view-faculty').textContent = course.faculty;
    document.getElementById('view-semester').textContent = `Semester ${course.semester}`;
    
    // Show enrolled students if available
    const studentsTable = viewModal.querySelector('table.students-table tbody');
    if (studentsTable) {
        const enrolledStudents = courseDB.getEnrolledStudents(code);
        studentsTable.innerHTML = '';
        
        if (enrolledStudents.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="4">No students enrolled.</td>';
            studentsTable.appendChild(row);
        } else {
            enrolledStudents.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.firstName} ${student.lastName}</td>
                    <td>${student.program}</td>
                    <td>${student.year}</td>
                `;
                studentsTable.appendChild(row);
            });
        }
    }
    
    // Show assigned faculty if available
    const assignedFaculty = courseDB.getAssignedFaculty(code);
    const facultyInfo = viewModal.querySelector('.faculty-info');
    if (facultyInfo) {
        if (assignedFaculty) {
            facultyInfo.innerHTML = `
                <p><strong>Assigned Faculty:</strong> ${assignedFaculty.name}</p>
                <p><strong>Department:</strong> ${assignedFaculty.department}</p>
                <p><strong>Email:</strong> ${assignedFaculty.email}</p>
            `;
        } else {
            facultyInfo.innerHTML = '<p>No faculty assigned to this course.</p>';
        }
    }
    
    openModal('viewCourseModal');
}

function editCourse(code) {
    const course = courseDB.getCourseByCode(code);
    if (!course) return;
    
    // Set form to edit mode
    const form = document.getElementById('addCourseForm');
    form.dataset.editCode = code;
    
    // Populate form fields
    document.getElementById('courseCode').value = course.code;
    document.getElementById('courseName').value = course.name;
    document.getElementById('credits').value = course.credits;
    document.getElementById('sessions').value = course.sessions;
    document.getElementById('faculty').value = course.faculty;
    document.getElementById('semester').value = course.semester;
    
    // Change submit button text
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.textContent = 'Update Course';
    
    // Disable course code field in edit mode
    const courseCodeField = document.getElementById('courseCode');
    if (courseCodeField) courseCodeField.readOnly = true;
    
    // Show the modal
    openModal('addCourseModal');
}

function deleteCourse(code) {
    if (confirm('Are you sure you want to delete this course? This will also remove all faculty assignments and student enrollments for this course.')) {
        if (courseDB.deleteCourse(code)) {
            alert('Course deleted successfully.');
            
            // Update course list if updateCourseList function exists
            if (typeof updateCourseList === 'function') {
                updateCourseList();
            }
        } else {
            alert('Failed to delete course.');
        }
    }
}

function updateCourseList(courses) {
    const courseTable = document.getElementById('courseTable');
    if (!courseTable) return;
    
    const tbody = document.createElement('tbody');
    
    if (courses.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="6">No courses found.</td>';
        tbody.appendChild(row);
    } else {
        courses.forEach(course => {
            const row = document.createElement('tr');
            row.setAttribute('data-semester', course.semester);
            
            row.innerHTML = `
                <td>${course.code}</td>
                <td>${course.name}</td>
                <td>${course.sessions}</td>
                <td>${course.credits}</td>
                <td>${course.faculty}</td>
                <td>
                    <button class="action-btn" title="View Course" onclick="viewCourse('${course.code}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" title="Update Course" onclick="editCourse('${course.code}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" title="Delete Course" onclick="deleteCourse('${course.code}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    // Replace the existing tbody
    const existingTbody = courseTable.querySelector('tbody');
    if (existingTbody) existingTbody.remove();
    courseTable.appendChild(tbody);
} 