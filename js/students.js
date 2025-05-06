// Student Database Implementation
window.studentDB = {
    init() {
        // Initialize student data in localStorage if not exists
        if (!localStorage.getItem('students')) {
            localStorage.setItem('students', JSON.stringify([]));
        }
        if (!localStorage.getItem('studentEnrollments')) {
            localStorage.setItem('studentEnrollments', JSON.stringify([]));
        }
    },

    getAllStudents() {
        return JSON.parse(localStorage.getItem('students')) || [];
    },

    getStudentById(id) {
        const students = this.getAllStudents();
        return students.find(student => student.id === id);
    },

    createStudent(studentData) {
        const students = this.getAllStudents();
        
        // Check if student ID already exists
        if (students.some(student => student.id === studentData.id)) {
            return null;
        }

        const newStudent = {
            id: studentData.id,
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            program: studentData.program,
            year: studentData.year,
            email: studentData.email,
            phone: studentData.phone,
            dob: studentData.dob,
            address: studentData.address,
            createdAt: new Date().toISOString()
        };

        students.push(newStudent);
        localStorage.setItem('students', JSON.stringify(students));
        return newStudent;
    },

    updateStudent(id, studentData) {
        const students = this.getAllStudents();
        const index = students.findIndex(student => student.id === id);
        
        if (index === -1) return false;

        students[index] = {
            ...students[index],
            ...studentData,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem('students', JSON.stringify(students));
        return true;
    },

    deleteStudent(id) {
        let students = this.getAllStudents();
        students = students.filter(student => student.id !== id);
        localStorage.setItem('students', JSON.stringify(students));

        // Also remove any enrollments for this student
        let enrollments = JSON.parse(localStorage.getItem('studentEnrollments')) || [];
        enrollments = enrollments.filter(enrollment => enrollment.studentId !== id);
        localStorage.setItem('studentEnrollments', JSON.stringify(enrollments));

        return true;
    },

    getEnrolledCourses(studentId) {
        const enrollments = JSON.parse(localStorage.getItem('studentEnrollments')) || [];
        return enrollments.filter(enrollment => enrollment.studentId === studentId);
    },

    assignCourse(enrollment) {
        const enrollments = JSON.parse(localStorage.getItem('studentEnrollments')) || [];
        
        // Check if student is already enrolled in this course
        if (enrollments.some(e => e.studentId === enrollment.studentId && e.courseCode === enrollment.courseCode)) {
            return false;
        }

        enrollments.push(enrollment);
        localStorage.setItem('studentEnrollments', JSON.stringify(enrollments));
        return true;
    },

    unassignCourse(studentId, courseCode) {
        let enrollments = JSON.parse(localStorage.getItem('studentEnrollments')) || [];
        enrollments = enrollments.filter(e => !(e.studentId === studentId && e.courseCode === courseCode));
        localStorage.setItem('studentEnrollments', JSON.stringify(enrollments));
        return true;
    }
}; 