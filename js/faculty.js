// Faculty Database Implementation
window.facultyDB = {
    init() {
        // Initialize faculty data in localStorage if not exists
        if (!localStorage.getItem('faculty')) {
            localStorage.setItem('faculty', JSON.stringify([]));
        }
        if (!localStorage.getItem('courseAssignments')) {
            localStorage.setItem('courseAssignments', JSON.stringify([]));
        }
    },

    getAllFaculty() {
        return JSON.parse(localStorage.getItem('faculty')) || [];
    },

    getFacultyById(id) {
        const faculty = this.getAllFaculty();
        return faculty.find(f => f.id === id);
    },

    createFaculty(facultyData) {
        const faculty = this.getAllFaculty();
        const newId = 'FAC' + (faculty.length + 1).toString().padStart(3, '0');
        
        const newFaculty = {
            id: newId,
            ...facultyData
        };

        faculty.push(newFaculty);
        localStorage.setItem('faculty', JSON.stringify(faculty));
        return newFaculty;
    },

    updateFaculty(id, facultyData) {
        const faculty = this.getAllFaculty();
        const index = faculty.findIndex(f => f.id === id);
        
        if (index === -1) return false;

        faculty[index] = {
            ...faculty[index],
            ...facultyData
        };

        localStorage.setItem('faculty', JSON.stringify(faculty));
        return true;
    },

    deleteFaculty(id) {
        const faculty = this.getAllFaculty();
        const index = faculty.findIndex(f => f.id === id);
        
        if (index === -1) return false;

        faculty.splice(index, 1);
        localStorage.setItem('faculty', JSON.stringify(faculty));

        // Remove course assignments for this faculty
        const assignments = JSON.parse(localStorage.getItem('courseAssignments')) || [];
        const updatedAssignments = assignments.filter(a => a.facultyId !== id);
        localStorage.setItem('courseAssignments', JSON.stringify(updatedAssignments));

        return true;
    },

    assignCourse(assignment) {
        const assignments = JSON.parse(localStorage.getItem('courseAssignments')) || [];
        
        // Check if course is already assigned to another faculty
        const existingAssignment = assignments.find(a => a.courseCode === assignment.courseCode);
        if (existingAssignment) {
            if (existingAssignment.facultyId === assignment.facultyId) {
                return false; // Already assigned to this faculty
            }
            // Remove existing assignment
            const index = assignments.findIndex(a => a.courseCode === assignment.courseCode);
            assignments.splice(index, 1);
        }

        assignments.push(assignment);
        localStorage.setItem('courseAssignments', JSON.stringify(assignments));
        return true;
    },

    getAssignedCourses(facultyId) {
        const assignments = JSON.parse(localStorage.getItem('courseAssignments')) || [];
        return assignments.filter(a => a.facultyId === facultyId);
    }
}; 