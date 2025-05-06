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
        const courses = this.getAllCourses();
        const index = courses.findIndex(course => course.code === code);
        
        if (index === -1) return false;

        courses[index] = {
            ...courses[index],
            ...courseData,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem('courses', JSON.stringify(courses));
        return true;
    },

    deleteCourse(code) {
        let courses = this.getAllCourses();
        courses = courses.filter(course => course.code !== code);
        localStorage.setItem('courses', JSON.stringify(courses));

        // Also remove any assignments for this course
        let assignments = JSON.parse(localStorage.getItem('courseAssignments')) || [];
        assignments = assignments.filter(assignment => assignment.courseCode !== code);
        localStorage.setItem('courseAssignments', JSON.stringify(assignments));

        return true;
    }
};

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
                document.getElementById('addCourseModal').style.display = 'none';
            } else {
                console.log('Failed to create course - duplicate code');
                alert('Error: Course code already exists!');
            }
        });
    } else {
        console.log('Add course form not found!');
    }

    // Edit Course Form Submission
    const editCourseForm = document.getElementById('editCourseForm');
    if (editCourseForm) {
        editCourseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const courseData = {
                code: formData.get('courseCode'),
                name: formData.get('courseName'),
                credits: parseInt(formData.get('credits')),
                sessions: parseInt(formData.get('sessions')),
                faculty: formData.get('faculty'),
                semester: formData.get('semester')
            };

            const result = courseDB.updateCourse(courseData.code, courseData);
            if (result) {
                alert('Course updated successfully!');
                this.reset();
                updateCourseTable();
                document.getElementById('editCourseModal').style.display = 'none';
            } else {
                alert('Error updating course!');
            }
        });
    }

    // Update Course Table
    function updateCourseTable() {
        const tbody = document.querySelector('#courseTable tbody');
        if (!tbody) return;

        const courses = courseDB.getAllCourses();
        tbody.innerHTML = '';

        if (courses.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="7">No courses found.</td>';
            tbody.appendChild(row);
            return;
        }

        courses.forEach(course => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${course.code}</td>
                <td>${course.name}</td>
                <td>${course.credits}</td>
                <td>${course.sessions}</td>
                <td>${course.faculty || '-'}</td>
                <td>${course.semester}</td>
                <td>
                    <button class="btn btn-sm btn-primary view-course" data-code="${course.code}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning edit-course" data-code="${course.code}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-course" data-code="${course.code}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Attach event listeners to action buttons
        attachActionListeners();
    }

    // Attach event listeners to action buttons
    function attachActionListeners() {
        // View Course
        document.querySelectorAll('.view-course').forEach(button => {
            button.addEventListener('click', function() {
                const code = this.getAttribute('data-code');
                const course = courseDB.getCourseByCode(code);
                if (course) {
                    // Populate view modal
                    document.getElementById('viewCourseCode').textContent = course.code;
                    document.getElementById('viewCourseName').textContent = course.name;
                    document.getElementById('viewCourseCredits').textContent = course.credits;
                    document.getElementById('viewCourseSessions').textContent = course.sessions;
                    document.getElementById('viewCourseFaculty').textContent = course.faculty || '-';
                    document.getElementById('viewCourseSemester').textContent = course.semester;
                    
                    // Show modal
                    document.getElementById('viewCourseModal').style.display = 'block';
                }
            });
        });

        // Edit Course
        document.querySelectorAll('.edit-course').forEach(button => {
            button.addEventListener('click', function() {
                const code = this.getAttribute('data-code');
                const course = courseDB.getCourseByCode(code);
                if (course) {
                    // Populate edit form
                    const form = document.getElementById('editCourseForm');
                    form.querySelector('[name="courseCode"]').value = course.code;
                    form.querySelector('[name="courseName"]').value = course.name;
                    form.querySelector('[name="credits"]').value = course.credits;
                    form.querySelector('[name="sessions"]').value = course.sessions;
                    form.querySelector('[name="faculty"]').value = course.faculty || '';
                    form.querySelector('[name="semester"]').value = course.semester;
                    
                    // Show modal
                    document.getElementById('editCourseModal').style.display = 'block';
                }
            });
        });

        // Delete Course
        document.querySelectorAll('.delete-course').forEach(button => {
            button.addEventListener('click', function() {
                const code = this.getAttribute('data-code');
                if (confirm('Are you sure you want to delete this course?')) {
                    if (courseDB.deleteCourse(code)) {
                        alert('Course deleted successfully!');
                        updateCourseTable();
                    } else {
                        alert('Error deleting course!');
                    }
                }
            });
        });
    }

    // Initial table update
    updateCourseTable();
}); 