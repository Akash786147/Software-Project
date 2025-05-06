// Course Database Implementation
window.courseDB = {
    init() {
        console.log('Initializing course database...');
        // Initialize course data in localStorage if not exists
        if (!localStorage.getItem('courses')) {
            console.log('Creating new courses array in localStorage');
            localStorage.setItem('courses', JSON.stringify([]));
        } else {
            console.log('Existing courses found in localStorage:', this.getAllCourses());
        }
    },

    getAllCourses() {
        const courses = JSON.parse(localStorage.getItem('courses')) || [];
        console.log('Retrieved courses from localStorage:', courses);
        return courses;
    },

    getCourseByCode(code) {
        const courses = this.getAllCourses();
        const course = courses.find(course => course.code === code);
        console.log('Found course by code:', code, course);
        return course;
    },

    createCourse(courseData) {
        console.log('Creating new course:', courseData);
        const courses = this.getAllCourses();
        
        // Check if course code already exists
        if (courses.some(course => course.code === courseData.code)) {
            console.log('Course code already exists:', courseData.code);
            return null;
        }

        const newCourse = {
            code: courseData.code,
            name: courseData.name,
            credits: courseData.credits,
            sessions: courseData.sessions,
            faculty: courseData.faculty,
            semester: courseData.semester,
            createdAt: new Date().toISOString()
        };

        courses.push(newCourse);
        localStorage.setItem('courses', JSON.stringify(courses));
        console.log('Course created successfully:', newCourse);
        return newCourse;
    },

    updateCourse(code, courseData) {
        console.log('Updating course:', code, courseData);
        const courses = this.getAllCourses();
        const index = courses.findIndex(course => course.code === code);
        
        if (index === -1) {
            console.log('Course not found:', code);
            return false;
        }

        courses[index] = {
            ...courses[index],
            ...courseData,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem('courses', JSON.stringify(courses));
        console.log('Course updated successfully:', courses[index]);
        return true;
    },

    deleteCourse(code) {
        console.log('Deleting course:', code);
        let courses = this.getAllCourses();
        courses = courses.filter(course => course.code !== code);
        localStorage.setItem('courses', JSON.stringify(courses));

        // Also remove any assignments for this course
        let assignments = JSON.parse(localStorage.getItem('courseAssignments')) || [];
        assignments = assignments.filter(assignment => assignment.courseCode !== code);
        localStorage.setItem('courseAssignments', JSON.stringify(assignments));

        console.log('Course deleted successfully');
        return true;
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing course management...');
    
    // Initialize course database
    courseDB.init();

    // Add Course Form Submission
    const addCourseForm = document.getElementById('addCourseForm');
    if (addCourseForm) {
        console.log('Add course form found, attaching submit handler');
        addCourseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Add course form submitted');
            
            const formData = new FormData(this);
            const courseData = {
                code: formData.get('courseCode'),
                name: formData.get('courseName'),
                credits: parseInt(formData.get('credits')),
                sessions: parseInt(formData.get('sessions')),
                faculty: formData.get('faculty'),
                semester: formData.get('semester')
            };
            console.log('Form data collected:', courseData);

            const result = courseDB.createCourse(courseData);
            if (result) {
                console.log('Course created successfully');
                alert('Course added successfully!');
                this.reset();
                updateCourseTable();
                closeModal('addCourseModal');
            } else {
                console.log('Failed to create course - duplicate code');
                alert('Error: Course code already exists!');
            }
        });
    } else {
        console.log('Add course form not found!');
    }

    // Update Course Table
    function updateCourseTable() {
        console.log('Updating course table');
        const tbody = document.querySelector('#courseTable tbody');
        if (!tbody) {
            console.log('Course table body not found');
            return;
        }

        const courses = courseDB.getAllCourses();
        tbody.innerHTML = '';

        if (courses.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="6">No courses found.</td>';
            tbody.appendChild(row);
            return;
        }

        courses.forEach(course => {
            const row = document.createElement('tr');
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
        console.log('Course table updated successfully');
    }

    // View Course Function
    window.viewCourse = function(code) {
        console.log('Viewing course:', code);
        const course = courseDB.getCourseByCode(code);
        if (course) {
            document.getElementById('view-courseCode').textContent = course.code;
            document.getElementById('view-courseName').textContent = course.name;
            document.getElementById('view-credits').textContent = course.credits;
            document.getElementById('view-sessions').textContent = course.sessions;
            document.getElementById('view-faculty').textContent = course.faculty;
            document.getElementById('view-semester').textContent = `Semester ${course.semester}`;
            openModal('viewCourseModal');
        }
    };

    // Edit Course Function
    window.editCourse = function(code) {
        console.log('Editing course:', code);
        const course = courseDB.getCourseByCode(code);
        if (course) {
            const form = document.getElementById('addCourseForm');
            form.dataset.editCode = code;
            
            document.getElementById('courseCode').value = course.code;
            document.getElementById('courseName').value = course.name;
            document.getElementById('credits').value = course.credits;
            document.getElementById('sessions').value = course.sessions;
            document.getElementById('faculty').value = course.faculty;
            document.getElementById('semester').value = course.semester;
            
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) submitButton.textContent = 'Update Course';
            
            document.getElementById('courseCode').readOnly = true;
            openModal('addCourseModal');
        }
    };

    // Delete Course Function
    window.deleteCourse = function(code) {
        console.log('Deleting course:', code);
        if (confirm('Are you sure you want to delete this course? This will also remove all faculty assignments and student enrollments for this course.')) {
            if (courseDB.deleteCourse(code)) {
                alert('Course deleted successfully.');
                updateCourseTable();
            } else {
                alert('Failed to delete course.');
            }
        }
    };

    // Modal Functions
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'block';
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'none';
    };

    // Close modal when clicking the X
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Add modal open functionality for buttons with data-modal attribute
    document.querySelectorAll('[data-modal]').forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    // Initialize search functionality
    const searchInput = document.getElementById('courseSearch');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            const courses = courseDB.getAllCourses();
            const filteredCourses = courses.filter(course => {
                return course.code.toLowerCase().includes(searchTerm) || 
                       course.name.toLowerCase().includes(searchTerm) || 
                       course.faculty.toLowerCase().includes(searchTerm);
            });
            updateCourseTable(filteredCourses);
        });
    }

    // Initialize semester filter
    const semesterFilter = document.getElementById('semesterFilter');
    if (semesterFilter) {
        semesterFilter.addEventListener('change', function() {
            const selectedSemester = this.value;
            const courses = courseDB.getAllCourses();
            
            if (!selectedSemester) {
                updateCourseTable(courses);
                return;
            }
            
            const filteredCourses = courses.filter(course => {
                return course.semester === selectedSemester;
            });
            
            updateCourseTable(filteredCourses);
        });
    }

    // Initial table update
    updateCourseTable();
}); 