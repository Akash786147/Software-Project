// Show active tab content and hide others
function showTab(tabId) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });

    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab content and mark tab as active
    document.getElementById(tabId).style.display = 'block';
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

    // Store active tab in localStorage
    localStorage.setItem('activeTab', tabId);
}

// Initialize tabs when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get active tab from localStorage or default to first tab
    const activeTab = localStorage.getItem('activeTab') || 'tab1';
    showTab(activeTab);

    // Add click event listeners to all tabs
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

    // Initialize modals
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

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
});

// Simple data storage using localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Form submission handler
function handleFormSubmit(formId, dataKey, redirectUrl = null) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Add timestamp and ID
        data.id = Date.now();
        data.timestamp = new Date().toISOString();
        
        // Get existing data or initialize empty array
        const existingData = getData(dataKey) || [];
        existingData.push(data);
        
        // Save updated data
        saveData(dataKey, existingData);
        
        // Reset form
        form.reset();
        
        // Show success message
        alert('Data saved successfully!');
        
        // Redirect if URL provided
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    });
}

// Delete item from storage
function deleteItem(dataKey, itemId) {
    const existingData = getData(dataKey) || [];
    const updatedData = existingData.filter(item => item.id !== itemId);
    saveData(dataKey, updatedData);
    
    // Refresh the page or update UI
    location.reload();
}

// Search functionality
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