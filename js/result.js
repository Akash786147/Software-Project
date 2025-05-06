// result.js - Implementation for Result Module

// Initial data structure for localStorage
const initialResultsData = [
  {
    "studentId": "STU001",
    "name": "Ravi Sharma",
    "semester": "Sem 4",
    "results": [
      { "course": "Data Structures", "internal": 28, "external": 45, "practical": 18 },
      { "course": "DBMS", "internal": 30, "external": 40, "practical": 20 }
    ]
  },
  {
    "studentId": "STU002",
    "name": "Anjali Verma",
    "semester": "Sem 4",
    "results": [
      { "course": "Data Structures", "internal": 25, "external": 42, "practical": 19 },
      { "course": "DBMS", "internal": 27, "external": 39, "practical": 18 }
    ]
  }
];

// Initialize localStorage data if not exists
function initResultsData() {
  if (!localStorage.getItem('studentResults')) {
    localStorage.setItem('studentResults', JSON.stringify(initialResultsData));
  }
}

// Get all student results
function getAllStudentResults() {
  return JSON.parse(localStorage.getItem('studentResults')) || [];
}

// Get results filtered by semester
function getResultsBySemester(semester) {
  const allResults = getAllStudentResults();
  if (!semester || semester === 'All') {
    return allResults;
  }
  return allResults.filter(student => student.semester === semester);
}

// Get results filtered by student name
function getResultsByName(name) {
  const allResults = getAllStudentResults();
  if (!name) {
    return allResults;
  }
  return allResults.filter(student => 
    student.name.toLowerCase().includes(name.toLowerCase())
  );
}

// Get results filtered by student ID
function getResultsByStudentId(studentId) {
  const allResults = getAllStudentResults();
  if (!studentId) {
    return allResults;
  }
  return allResults.filter(student => 
    student.studentId.toLowerCase().includes(studentId.toLowerCase())
  );
}

// Add a new student result
function addStudentResult(studentData) {
  const allResults = getAllStudentResults();
  allResults.push(studentData);
  localStorage.setItem('studentResults', JSON.stringify(allResults));
}

// Update an existing student result
function updateStudentResult(studentId, updatedData) {
  const allResults = getAllStudentResults();
  const index = allResults.findIndex(student => student.studentId === studentId);
  
  if (index !== -1) {
    allResults[index] = { ...allResults[index], ...updatedData };
    localStorage.setItem('studentResults', JSON.stringify(allResults));
    return true;
  }
  return false;
}

// Delete a student result
function deleteStudentResult(studentId) {
  let allResults = getAllStudentResults();
  allResults = allResults.filter(student => student.studentId !== studentId);
  localStorage.setItem('studentResults', JSON.stringify(allResults));
}

// Publish results for a specific semester
function publishResults(semester) {
  return `Result published and mailed to students of ${semester}`;
}

// Render results table based on filtered data
function renderResultsTable(filteredResults) {
  const resultTableBody = document.querySelector('#viewResults table tbody');
  resultTableBody.innerHTML = '';
  
  filteredResults.forEach(student => {
    student.results.forEach(result => {
      // Create the main row for the student result
      const row = document.createElement('tr');
      row.className = 'student-result-row';
      row.setAttribute('data-student-id', student.studentId);
      row.setAttribute('data-course', result.course);
      
      row.innerHTML = `
        <td>${student.studentId}</td>
        <td>${student.name}</td>
        <td>${result.course}</td>
        <td>${result.internal + result.external + result.practical}/100</td>
        <td>${calculateGrade(result.internal + result.external + result.practical, result.course)}</td>
        <td><span class="status submitted">Published</span></td>
        <td>
          <button class="action-btn show-marks-btn" title="Show Marks" data-id="${student.studentId}" data-course="${result.course}" style="background-color: #4a89dc; margin-right: 5px; padding: 5px 8px; border-radius: 4px; border: none; color: white; cursor: pointer;">
            <i class="fas fa-eye"></i> Show Marks
          </button>
          <button class="action-btn edit-result" data-id="${student.studentId}" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete-result" data-id="${student.studentId}" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      
      resultTableBody.appendChild(row);
      
      // Create a hidden details row that will be toggled when the "Show Marks" button is clicked
      const detailsRow = document.createElement('tr');
      detailsRow.className = 'marks-details-row';
      detailsRow.setAttribute('data-student-id', student.studentId);
      detailsRow.setAttribute('data-course', result.course);
      detailsRow.style.display = 'none'; // Hidden by default
      
      // Create a cell that spans the entire row
      const detailsCell = document.createElement('td');
      detailsCell.setAttribute('colspan', '7'); // Span all columns
      detailsCell.className = 'marks-details';
      
      // Style the details cell
      detailsCell.style.backgroundColor = '#f8f9fa';
      detailsCell.style.padding = '15px';
      detailsCell.style.borderBottom = '1px solid #ddd';
      
      // Create the detailed marks display
      detailsCell.innerHTML = `
        <div class="marks-breakdown" style="overflow-x: auto;">
          <h4>Marks Breakdown for ${student.name} - ${result.course}</h4>
          <table class="marks-table" style="width: 100%; max-width: 600px; margin-top: 10px; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Component</th>
                <th style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd;">Marks</th>
                <th style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd;">Out of</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Internal Assessment</td>
                <td style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd;">${result.internal}</td>
                <td style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd;">30</td>
              </tr>
              <tr>
                <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">External Examination</td>
                <td style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd;">${result.external}</td>
                <td style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd;">50</td>
              </tr>
              <tr>
                <td style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Practical Assessment</td>
                <td style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd;">${result.practical}</td>
                <td style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd;">20</td>
              </tr>
              <tr>
                <td style="padding: 8px; text-align: left; font-weight: bold;">Total</td>
                <td style="padding: 8px; text-align: center; font-weight: bold;">${result.internal + result.external + result.practical}</td>
                <td style="padding: 8px; text-align: center; font-weight: bold;">100</td>
              </tr>
            </tbody>
          </table>
          
          <!-- Mobile-friendly view that appears on smaller screens -->
          <div class="mobile-marks" style="display: none; margin-top: 15px;">
            <div style="padding: 10px; background-color: #eaf2ff; border-radius: 5px; margin-bottom: 8px;">
              <div style="font-weight: bold;">Internal Assessment</div>
              <div style="font-size: 16px; margin-top: 5px;">${result.internal} / 30</div>
            </div>
            <div style="padding: 10px; background-color: #eaf2ff; border-radius: 5px; margin-bottom: 8px;">
              <div style="font-weight: bold;">External Examination</div>
              <div style="font-size: 16px; margin-top: 5px;">${result.external} / 50</div>
            </div>
            <div style="padding: 10px; background-color: #eaf2ff; border-radius: 5px; margin-bottom: 8px;">
              <div style="font-weight: bold;">Practical Assessment</div>
              <div style="font-size: 16px; margin-top: 5px;">${result.practical} / 20</div>
            </div>
            <div style="padding: 10px; background-color: #e3f2fd; border-radius: 5px; font-weight: bold;">
              <div>Total</div>
              <div style="font-size: 18px; margin-top: 5px;">${result.internal + result.external + result.practical} / 100</div>
            </div>
          </div>
        </div>
        
        <!-- Add responsive styling -->
        <style>
          @media (max-width: 768px) {
            .marks-table {
              display: none;
            }
            .mobile-marks {
              display: block !important;
            }
          }
        </style>
      `;
      
      detailsRow.appendChild(detailsCell);
      resultTableBody.appendChild(detailsRow);
    });
  });
  
  // Add event listeners to edit, delete and show marks buttons
  addResultActionListeners();
}

// Calculate grade based on marks and defined ranges
function calculateGrade(marks, courseName = '') {
  // First try to get course-specific grade ranges if course name is provided
  let savedRanges = null;
  
  if (courseName) {
    savedRanges = JSON.parse(localStorage.getItem(`gradeRanges_${courseName}`));
  }
  
  // If no course-specific ranges or no course provided, fall back to general ranges
  if (!savedRanges) {
    savedRanges = JSON.parse(localStorage.getItem('gradeRanges'));
  }
  
  if (savedRanges && savedRanges.length > 0) {
    // Sort ranges by min value to ensure proper evaluation
    savedRanges.sort((a, b) => a.min - b.min);
    
    // Find the appropriate grade
    for (const range of savedRanges) {
      if (marks >= range.min && marks <= range.max) {
        return range.label;
      }
    }
  }
  
  // Default grading if no saved ranges
  if (marks >= 90) return 'A';
  else if (marks >= 85) return 'A-';
  else if (marks >= 80) return 'B+';
  else if (marks >= 75) return 'B';
  else if (marks >= 70) return 'B-';
  else if (marks >= 65) return 'C+';
  else if (marks >= 60) return 'C';
  else if (marks >= 50) return 'D';
  else return 'F';
}

// Add event listeners to buttons in results table
function addResultActionListeners() {
  // Edit result
  document.querySelectorAll('.edit-result').forEach(button => {
    button.addEventListener('click', function() {
      const studentId = this.getAttribute('data-id');
      showEditResultModal(studentId);
    });
  });
  
  // Delete result
  document.querySelectorAll('.delete-result').forEach(button => {
    button.addEventListener('click', function() {
      const studentId = this.getAttribute('data-id');
      if (confirm(`Are you sure you want to delete result for student ID: ${studentId}?`)) {
        deleteStudentResult(studentId);
        refreshResultsView();
      }
    });
  });
  
  // Show marks
  document.querySelectorAll('.show-marks-btn').forEach(button => {
    button.addEventListener('click', function() {
      // Get student ID and course from data attributes
      const studentId = this.getAttribute('data-id');
      const course = this.getAttribute('data-course');
      
      // Find the corresponding details row
      const detailsRow = document.querySelector(`.marks-details-row[data-student-id="${studentId}"][data-course="${course}"]`);
      
      // Toggle the visibility of the details row
      if (detailsRow) {
        // Check if the row is currently visible
        const isVisible = detailsRow.style.display === 'table-row';
        
        if (isVisible) {
          // If already visible, hide it
          detailsRow.style.display = 'none';
          // Update button text back to "Show Marks"
          this.innerHTML = '<i class="fas fa-eye"></i> Show Marks';
          // Reset the style to match other buttons
          this.style.backgroundColor = '#4a89dc';
        } else {
          // Hide all other visible marks detail rows first
          document.querySelectorAll('.marks-details-row').forEach(row => {
            row.style.display = 'none';
          });
          
          // Update all show marks buttons text to "Show Marks"
          document.querySelectorAll('.show-marks-btn').forEach(btn => {
            btn.innerHTML = '<i class="fas fa-eye"></i> Show Marks';
            btn.style.backgroundColor = '#4a89dc';
          });
          
          // Show this row
          detailsRow.style.display = 'table-row';
          // Update this button text to "Hide Marks"
          this.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Marks';
          // Change the button color to indicate active state
          this.style.backgroundColor = '#3a6baa';
        }
      }
    });
  });
}

// Show modal for editing a result
function showEditResultModal(studentId) {
  const allResults = getAllStudentResults();
  const student = allResults.find(s => s.studentId === studentId);
  
  if (!student) return;
  
  // Create modal dynamically if it doesn't exist
  let modal = document.getElementById('editResultModal');
  
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'editResultModal';
    modal.className = 'modal';
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit Student Result</h2>
          <span class="close-btn">&times;</span>
        </div>
        <div class="modal-body">
          <form id="editResultForm">
            <div class="form-group">
              <label for="editStudentId">Student ID</label>
              <input type="text" id="editStudentId" class="form-control" readonly>
            </div>
            <div class="form-group">
              <label for="editName">Name</label>
              <input type="text" id="editName" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="editSemester">Semester</label>
              <select id="editSemester" class="form-control" required>
                <option value="Sem 1">Semester 1</option>
                <option value="Sem 2">Semester 2</option>
                <option value="Sem 3">Semester 3</option>
                <option value="Sem 4">Semester 4</option>
              </select>
            </div>
            <div id="editCourseResults">
              <!-- Course results will be added dynamically -->
            </div>
            <div class="form-group">
              <button type="button" id="addCourseBtn" class="btn btn-secondary">Add Course</button>
            </div>
            <div class="form-group">
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close button functionality
    modal.querySelector('.close-btn').addEventListener('click', () => {
      modal.style.display = 'none';
    });
    
    // Add course button functionality
    document.getElementById('addCourseBtn').addEventListener('click', addNewCourseField);
    
    // Form submission
    document.getElementById('editResultForm').addEventListener('submit', function(e) {
      e.preventDefault();
      saveEditedResult();
    });
  }
  
  // Fill form with student data
  document.getElementById('editStudentId').value = student.studentId;
  document.getElementById('editName').value = student.name;
  document.getElementById('editSemester').value = student.semester;
  
  // Fill course results
  const coursesContainer = document.getElementById('editCourseResults');
  coursesContainer.innerHTML = '';
  
  student.results.forEach((result, index) => {
    const courseDiv = document.createElement('div');
    courseDiv.className = 'course-result';
    courseDiv.innerHTML = `
      <h4>Course ${index + 1}</h4>
      <div class="form-group">
        <label for="course${index}">Course Name</label>
        <input type="text" id="course${index}" class="form-control course-name" value="${result.course}" required>
      </div>
      <div class="form-group">
        <label for="internal${index}">Internal Marks</label>
        <input type="number" id="internal${index}" class="form-control internal-marks" value="${result.internal}" min="0" max="30" required>
      </div>
      <div class="form-group">
        <label for="external${index}">External Marks</label>
        <input type="number" id="external${index}" class="form-control external-marks" value="${result.external}" min="0" max="50" required>
      </div>
      <div class="form-group">
        <label for="practical${index}">Practical Marks</label>
        <input type="number" id="practical${index}" class="form-control practical-marks" value="${result.practical}" min="0" max="20" required>
      </div>
      <button type="button" class="btn btn-danger remove-course">Remove Course</button>
    `;
    
    coursesContainer.appendChild(courseDiv);
  });
  
  // Add event listeners to remove course buttons
  document.querySelectorAll('.remove-course').forEach(button => {
    button.addEventListener('click', function() {
      this.closest('.course-result').remove();
    });
  });
  
  // Show modal
  modal.style.display = 'block';
}

// Add new course field in edit modal
function addNewCourseField() {
  const coursesContainer = document.getElementById('editCourseResults');
  const index = document.querySelectorAll('.course-result').length;
  
  const courseDiv = document.createElement('div');
  courseDiv.className = 'course-result';
  courseDiv.innerHTML = `
    <h4>Course ${index + 1}</h4>
    <div class="form-group">
      <label for="course${index}">Course Name</label>
      <input type="text" id="course${index}" class="form-control course-name" required>
    </div>
    <div class="form-group">
      <label for="internal${index}">Internal Marks</label>
      <input type="number" id="internal${index}" class="form-control internal-marks" min="0" max="30" required>
    </div>
    <div class="form-group">
      <label for="external${index}">External Marks</label>
      <input type="number" id="external${index}" class="form-control external-marks" min="0" max="50" required>
    </div>
    <div class="form-group">
      <label for="practical${index}">Practical Marks</label>
      <input type="number" id="practical${index}" class="form-control practical-marks" min="0" max="20" required>
    </div>
    <button type="button" class="btn btn-danger remove-course">Remove Course</button>
  `;
  
  coursesContainer.appendChild(courseDiv);
  
  // Add event listener to remove button
  courseDiv.querySelector('.remove-course').addEventListener('click', function() {
    this.closest('.course-result').remove();
  });
}

// Save edited result
function saveEditedResult() {
  const studentId = document.getElementById('editStudentId').value;
  const name = document.getElementById('editName').value;
  const semester = document.getElementById('editSemester').value;
  
  // Get course results
  const courseResults = [];
  const courseElements = document.querySelectorAll('.course-result');
  
  courseElements.forEach(element => {
    const courseName = element.querySelector('.course-name').value;
    const internal = parseInt(element.querySelector('.internal-marks').value);
    const external = parseInt(element.querySelector('.external-marks').value);
    const practical = parseInt(element.querySelector('.practical-marks').value);
    
    courseResults.push({
      course: courseName,
      internal: internal,
      external: external,
      practical: practical
    });
  });
  
  // Update student data
  const updatedData = {
    studentId: studentId,
    name: name,
    semester: semester,
    results: courseResults
  };
  
  updateStudentResult(studentId, updatedData);
  
  // Close modal and refresh view
  document.getElementById('editResultModal').style.display = 'none';
  refreshResultsView();
}

// Show modal for adding a new result
function showAddResultModal() {
  // Create modal dynamically if it doesn't exist
  let modal = document.getElementById('addResultModal');
  
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'addResultModal';
    modal.className = 'modal';
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add New Student Result</h2>
          <span class="close-btn">&times;</span>
        </div>
        <div class="modal-body">
          <form id="addResultForm">
            <div class="form-group">
              <label for="addStudentId">Student ID</label>
              <input type="text" id="addStudentId" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="addName">Name</label>
              <input type="text" id="addName" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="addSemester">Semester</label>
              <select id="addSemester" class="form-control" required>
                <option value="Sem 1">Semester 1</option>
                <option value="Sem 2">Semester 2</option>
                <option value="Sem 3">Semester 3</option>
                <option value="Sem 4">Semester 4</option>
              </select>
            </div>
            <div id="addCourseResults">
              <div class="course-result">
                <h4>Course 1</h4>
                <div class="form-group">
                  <label for="addCourse0">Course Name</label>
                  <input type="text" id="addCourse0" class="form-control course-name" required>
                </div>
                <div class="form-group">
                  <label for="addInternal0">Internal Marks</label>
                  <input type="number" id="addInternal0" class="form-control internal-marks" min="0" max="30" required>
                </div>
                <div class="form-group">
                  <label for="addExternal0">External Marks</label>
                  <input type="number" id="addExternal0" class="form-control external-marks" min="0" max="50" required>
                </div>
                <div class="form-group">
                  <label for="addPractical0">Practical Marks</label>
                  <input type="number" id="addPractical0" class="form-control practical-marks" min="0" max="20" required>
                </div>
              </div>
            </div>
            <div class="form-group">
              <button type="button" id="addNewCourseBtn" class="btn btn-secondary">Add Course</button>
            </div>
            <div class="form-group">
              <button type="submit" class="btn btn-primary">Add Result</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close button functionality
    modal.querySelector('.close-btn').addEventListener('click', () => {
      modal.style.display = 'none';
    });
    
    // Add course button functionality
    document.getElementById('addNewCourseBtn').addEventListener('click', addNewCourseToNewResult);
    
    // Form submission
    document.getElementById('addResultForm').addEventListener('submit', function(e) {
      e.preventDefault();
      saveNewResult();
    });
  }
  
  // Clear form
  document.getElementById('addStudentId').value = '';
  document.getElementById('addName').value = '';
  document.getElementById('addSemester').value = 'Sem 1';
  
  // Reset course results
  const coursesContainer = document.getElementById('addCourseResults');
  coursesContainer.innerHTML = `
    <div class="course-result">
      <h4>Course 1</h4>
      <div class="form-group">
        <label for="addCourse0">Course Name</label>
        <input type="text" id="addCourse0" class="form-control course-name" required>
      </div>
      <div class="form-group">
        <label for="addInternal0">Internal Marks</label>
        <input type="number" id="addInternal0" class="form-control internal-marks" min="0" max="30" required>
      </div>
      <div class="form-group">
        <label for="addExternal0">External Marks</label>
        <input type="number" id="addExternal0" class="form-control external-marks" min="0" max="50" required>
      </div>
      <div class="form-group">
        <label for="addPractical0">Practical Marks</label>
        <input type="number" id="addPractical0" class="form-control practical-marks" min="0" max="20" required>
      </div>
      <button type="button" class="btn btn-danger remove-course">Remove Course</button>
    </div>
  `;
  
  // Add event listeners to remove course buttons
  document.querySelectorAll('.remove-course').forEach(button => {
    button.addEventListener('click', function() {
      if (document.querySelectorAll('.course-result').length > 1) {
        this.closest('.course-result').remove();
      } else {
        alert('At least one course is required.');
      }
    });
  });
  
  // Show modal
  modal.style.display = 'block';
}

// Add new course field in add result modal
function addNewCourseToNewResult() {
  const coursesContainer = document.getElementById('addCourseResults');
  const index = document.querySelectorAll('#addCourseResults .course-result').length;
  
  const courseDiv = document.createElement('div');
  courseDiv.className = 'course-result';
  courseDiv.innerHTML = `
    <h4>Course ${index + 1}</h4>
    <div class="form-group">
      <label for="addCourse${index}">Course Name</label>
      <input type="text" id="addCourse${index}" class="form-control course-name" required>
    </div>
    <div class="form-group">
      <label for="addInternal${index}">Internal Marks</label>
      <input type="number" id="addInternal${index}" class="form-control internal-marks" min="0" max="30" required>
    </div>
    <div class="form-group">
      <label for="addExternal${index}">External Marks</label>
      <input type="number" id="addExternal${index}" class="form-control external-marks" min="0" max="50" required>
    </div>
    <div class="form-group">
      <label for="addPractical${index}">Practical Marks</label>
      <input type="number" id="addPractical${index}" class="form-control practical-marks" min="0" max="20" required>
    </div>
    <button type="button" class="btn btn-danger remove-course">Remove Course</button>
  `;
  
  coursesContainer.appendChild(courseDiv);
  
  // Add event listener to remove button
  courseDiv.querySelector('.remove-course').addEventListener('click', function() {
    if (document.querySelectorAll('#addCourseResults .course-result').length > 1) {
      this.closest('.course-result').remove();
    } else {
      alert('At least one course is required.');
    }
  });
}

// Save new result
function saveNewResult() {
  const studentId = document.getElementById('addStudentId').value;
  const name = document.getElementById('addName').value;
  const semester = document.getElementById('addSemester').value;
  
  // Check if student ID already exists
  const allResults = getAllStudentResults();
  if (allResults.some(student => student.studentId === studentId)) {
    alert('Student ID already exists. Please use a different ID.');
    return;
  }
  
  // Get course results
  const courseResults = [];
  const courseElements = document.querySelectorAll('#addCourseResults .course-result');
  
  courseElements.forEach(element => {
    const courseName = element.querySelector('.course-name').value;
    const internal = parseInt(element.querySelector('.internal-marks').value);
    const external = parseInt(element.querySelector('.external-marks').value);
    const practical = parseInt(element.querySelector('.practical-marks').value);
    
    courseResults.push({
      course: courseName,
      internal: internal,
      external: external,
      practical: practical
    });
  });
  
  // Create new student data
  const newStudentData = {
    studentId: studentId,
    name: name,
    semester: semester,
    results: courseResults
  };
  
  addStudentResult(newStudentData);
  
  // Close modal and refresh view
  document.getElementById('addResultModal').style.display = 'none';
  refreshResultsView();
}

// Refresh results view with current filters
function refreshResultsView() {
  const semesterSelect = document.getElementById('semesterFilter');
  const selectedSemester = semesterSelect ? semesterSelect.value : 'All';
  
  const searchInput = document.getElementById('resultSearch');
  const searchTerm = searchInput ? searchInput.value : '';
  
  let filteredResults = getAllStudentResults();
  
  if (selectedSemester !== 'All') {
    filteredResults = filteredResults.filter(student => student.semester === selectedSemester);
  }
  
  if (searchTerm) {
    filteredResults = filteredResults.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  renderResultsTable(filteredResults);
}

// Calculate and render course performance statistics
function renderCoursePerformanceStats(semester) {
  const performanceTableBody = document.querySelector('#coursePerformanceTable tbody');
  performanceTableBody.innerHTML = '';
  
  let students = getAllStudentResults();
  
  // Filter by semester if specified
  if (semester && semester !== 'All') {
    students = students.filter(student => student.semester === semester);
  }
  
  if (students.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `<td colspan="4" style="text-align: center;">No data available</td>`;
    performanceTableBody.appendChild(emptyRow);
    return;
  }
  
  // Get all unique courses
  const courseNames = new Set();
  students.forEach(student => {
    student.results.forEach(result => {
      courseNames.add(result.course);
    });
  });
  
  // Calculate statistics for each course
  courseNames.forEach(courseName => {
    const courseResults = [];
    
    students.forEach(student => {
      const result = student.results.find(r => r.course === courseName);
      if (result) {
        courseResults.push(result.internal + result.external + result.practical);
      }
    });
    
    if (courseResults.length > 0) {
      const average = courseResults.reduce((sum, total) => sum + total, 0) / courseResults.length;
      const highest = Math.max(...courseResults);
      const passRate = (courseResults.filter(total => total >= 50).length / courseResults.length) * 100;
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${courseName}</td>
        <td>${average.toFixed(1)}%</td>
        <td>${highest}%</td>
        <td>${passRate.toFixed(1)}%</td>
      `;
      
      performanceTableBody.appendChild(row);
    }
  });
}

// Calculate and render grade distribution
function renderGradeDistribution(semester) {
  const distributionTableBody = document.querySelector('#gradeDistributionTable tbody');
  distributionTableBody.innerHTML = '';
  
  let students = getAllStudentResults();
  
  // Filter by semester if specified
  if (semester && semester !== 'All') {
    students = students.filter(student => student.semester === semester);
  }
  
  if (students.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `<td colspan="3" style="text-align: center;">No data available</td>`;
    distributionTableBody.appendChild(emptyRow);
    return;
  }
  
  // Count occurrences of each grade
  const gradeCounts = {
    'A': 0, 'A-': 0, 'B+': 0, 'B': 0, 'B-': 0, 
    'C+': 0, 'C': 0, 'D': 0, 'F': 0
  };
  
  let totalGrades = 0;
  
  students.forEach(student => {
    student.results.forEach(result => {
      const total = result.internal + result.external + result.practical;
      const grade = calculateGrade(total, result.course);
      
      // Group similar grades for simplicity in the report
      if (grade === 'A' || grade === 'A-') {
        gradeCounts['A']++;
      } else if (grade === 'B+' || grade === 'B' || grade === 'B-') {
        gradeCounts['B']++;
      } else if (grade === 'C+' || grade === 'C') {
        gradeCounts['C']++;
      } else if (grade === 'D') {
        gradeCounts['D']++;
      } else {
        gradeCounts['F']++;
      }
      
      totalGrades++;
    });
  });
  
  // Render grade distribution
  for (const [grade, count] of Object.entries(gradeCounts)) {
    if (count > 0) {
      const percentage = (count / totalGrades) * 100;
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${grade}</td>
        <td>${count}</td>
        <td>${percentage.toFixed(1)}%</td>
      `;
      
      distributionTableBody.appendChild(row);
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Initialize localStorage data
  initResultsData();
  
  // Update the tab functionality in the results page
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Hide all tab contents
      document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
      });
      
      // Remove active class from all tabs
      document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
      });
      
      // Show selected tab content and mark tab as active
      document.getElementById(tabId).style.display = 'block';
      this.classList.add('active');
      
      // Initialize tab-specific content if needed
      if (tabId === 'gradeEntry') {
        // Initialize Grade Entry tab
        const semester = document.getElementById('gradeEntrySemester').value;
        renderGradeEntryTable(semester);
      } else if (tabId === 'analysis') {
        // Initialize Analysis tab
        const semester = document.getElementById('analysisSemester').value;
        renderCoursePerformanceStats(semester);
        renderGradeDistribution(semester);
      } else if (tabId === 'viewResults') {
        // Initialize View Results tab
        refreshResultsView();
      }
    });
  });
  
  // Load results button functionality
  const loadResultsBtn = document.getElementById('loadResultsBtn');
  if (loadResultsBtn) {
    loadResultsBtn.addEventListener('click', function() {
      const semester = document.getElementById('semesterSelect').value;
      const course = document.getElementById('courseSelect').value;
      const examType = document.getElementById('examTypeSelect').value;
      
      if (!semester || !course || !examType) {
        alert('Please select semester, course and exam type to load results.');
        return;
      }
      
      // Switch to Grade Entry tab and filter by selected semester
      const gradeEntryTab = document.querySelector('[data-tab="gradeEntry"]');
      if (gradeEntryTab) {
        gradeEntryTab.click();
        // Convert semester value to match our data format (e.g., "1" to "Sem 1")
        const semFormatted = `Sem ${semester}`;
        const semesterSelect = document.getElementById('gradeEntrySemester');
        if (semesterSelect) {
          semesterSelect.value = semFormatted;
          // Trigger change event to update the table
          const event = new Event('change');
          semesterSelect.dispatchEvent(event);
        }
        
        alert(`Loaded results for ${course} (${examType}) in Semester ${semester}`);
      }
    });
  }
  
  // Create semester filter in View Results tab
  const viewResultsDiv = document.getElementById('viewResults');
  if (viewResultsDiv) {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    filterContainer.style.display = 'flex';
    filterContainer.style.gap = '15px';
    filterContainer.style.marginBottom = '20px';
    
    // Add semester filter
    const semesterFilter = document.createElement('div');
    semesterFilter.innerHTML = `
      <label for="semesterFilter">Filter by Semester</label>
      <select id="semesterFilter" class="form-control">
        <option value="All">All Semesters</option>
        <option value="Sem 1">Semester 1</option>
        <option value="Sem 2">Semester 2</option>
        <option value="Sem 3">Semester 3</option>
        <option value="Sem 4">Semester 4</option>
      </select>
    `;
    
    filterContainer.appendChild(semesterFilter);
    
    // Insert filter container before search box
    const searchBox = viewResultsDiv.querySelector('#resultSearch');
    const searchContainer = searchBox.parentElement;
    viewResultsDiv.insertBefore(filterContainer, searchContainer);
    
    // Add event listener to semester filter
    document.getElementById('semesterFilter').addEventListener('change', refreshResultsView);
  }
  
  // Add event listener to grade entry semester selector
  const gradeEntrySemester = document.getElementById('gradeEntrySemester');
  if (gradeEntrySemester) {
    gradeEntrySemester.addEventListener('change', function() {
      renderGradeEntryTable(this.value);
    });
  }
  
  // Add event listener to analysis semester selector
  const analysisSemester = document.getElementById('analysisSemester');
  if (analysisSemester) {
    analysisSemester.addEventListener('change', function() {
      renderCoursePerformanceStats(this.value);
      renderGradeDistribution(this.value);
    });
  }
  
  // Add event listener to generate report button
  const generateReportBtn = document.getElementById('generateReportBtn');
  if (generateReportBtn) {
    generateReportBtn.addEventListener('click', function() {
      alert('Generating comprehensive report. This may take a few moments...');
      setTimeout(() => {
        alert('Report generated successfully!');
      }, 1000);
    });
  }
  
  // Create publish results section
  const publishTab = document.getElementById('publish');
  if (publishTab) {
    publishTab.innerHTML = `
      <h2>Publish Results</h2>
      <div class="card-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 20px;">
        <div class="card">
          <h3 class="card-title">Semester 1 Results</h3>
          <p>Publish end semester results for all students in Semester 1</p>
          <button class="btn btn-primary publish-btn" data-semester="Sem 1">
            <i class="fas fa-paper-plane"></i> Publish Results
          </button>
        </div>
        <div class="card">
          <h3 class="card-title">Semester 2 Results</h3>
          <p>Publish end semester results for all students in Semester 2</p>
          <button class="btn btn-primary publish-btn" data-semester="Sem 2">
            <i class="fas fa-paper-plane"></i> Publish Results
          </button>
        </div>
        <div class="card">
          <h3 class="card-title">Semester 3 Results</h3>
          <p>Publish end semester results for all students in Semester 3</p>
          <button class="btn btn-primary publish-btn" data-semester="Sem 3">
            <i class="fas fa-paper-plane"></i> Publish Results
          </button>
        </div>
        <div class="card">
          <h3 class="card-title">Semester 4 Results</h3>
          <p>Publish end semester results for all students in Semester 4</p>
          <button class="btn btn-primary publish-btn" data-semester="Sem 4">
            <i class="fas fa-paper-plane"></i> Publish Results
          </button>
        </div>
      </div>
    `;
    
    // Add event listeners to publish buttons
    document.querySelectorAll('.publish-btn').forEach(button => {
      button.addEventListener('click', function() {
        const semester = this.getAttribute('data-semester');
        const message = publishResults(semester);
        alert(message);
      });
    });
  }
  
  // Update existing result search functionality
  const resultSearch = document.getElementById('resultSearch');
  if (resultSearch) {
    resultSearch.addEventListener('keyup', refreshResultsView);
  }
  
  // Initial rendering of results table
  // Show the first tab by default
  const firstTab = document.querySelector('.tab');
  if (firstTab) {
    firstTab.click();
  } else {
    refreshResultsView();
  }
});

// Render grade entry table for a specific semester
function renderGradeEntryTable(semester) {
  const gradeEntryDiv = document.getElementById('gradeEntry');
  
  // Clear previous content
  while (gradeEntryDiv.children.length > 1) {
    gradeEntryDiv.removeChild(gradeEntryDiv.lastChild);
  }
  
  // Create course selection dropdown
  const courseSelectionDiv = document.createElement('div');
  courseSelectionDiv.className = 'form-group';
  courseSelectionDiv.style.marginBottom = '20px';
  courseSelectionDiv.innerHTML = `
    <label for="courseSelection">Select Course:</label>
    <select id="courseSelection" class="form-control" style="width: 200px; display: inline-block; margin-left: 10px;">
      <option value="">Select Course</option>
      <option value="Data Structures">Data Structures</option>
      <option value="DBMS">Database Management Systems</option>
      <option value="Machine Learning">Machine Learning</option>
      <option value="Design Thinking">Design Thinking</option>
      <option value="COA">Computer Organization & Architecture</option>
    </select>
  `;
  gradeEntryDiv.appendChild(courseSelectionDiv);
  
  // Add event listener to course selection
  document.getElementById('courseSelection').addEventListener('change', function() {
    // In a real implementation, this would load course-specific grade ranges
    // For now, we'll just show a notification
    const selectedCourse = this.value;
    if (selectedCourse) {
      // Check if we have saved grade ranges for this course
      const savedCourseRanges = JSON.parse(localStorage.getItem(`gradeRanges_${selectedCourse}`));
      
      if (savedCourseRanges) {
        // Clear existing ranges
        const gradeRangesContainer = document.getElementById('gradeRangesContainer');
        gradeRangesContainer.innerHTML = '';
        
        // Add saved ranges
        savedCourseRanges.forEach(grade => {
          addGradeRangeRow(grade.label, grade.min, grade.max);
        });
      }
      
      // Update the save button to include course name
      document.getElementById('saveGradeRangesBtn').innerHTML = `
        <i class="fas fa-save"></i> Save Grade Ranges
      `;
    }
  });
  
  // Create grade range assignment section
  const gradeRangeSection = document.createElement('div');
  gradeRangeSection.className = 'content-panel';
  gradeRangeSection.style.marginBottom = '20px';
  gradeRangeSection.innerHTML = `
    <h3>Grade Range Assignment</h3>
    <p>Define grade ranges for automatic grade assignment</p>
    <div id="gradeRangesContainer">
      <!-- Grade ranges will be added here -->
    </div>
    <button id="addGradeRangeBtn" class="btn btn-secondary" style="margin-top: 15px;">
      <i class="fas fa-plus"></i> Add Grade Range
    </button>
  `;
  gradeEntryDiv.appendChild(gradeRangeSection);
  
  // Add initial grade ranges
  const initialGrades = [
    { label: 'A+', min: 90, max: 100 },
    { label: 'A', min: 85, max: 89 },
    { label: 'B+', min: 80, max: 84 },
    { label: 'B', min: 75, max: 79 },
    { label: 'C', min: 70, max: 74 },
    { label: 'F', min: 0, max: 69 }
  ];
  
  const gradeRangesContainer = document.getElementById('gradeRangesContainer');
  
  initialGrades.forEach(grade => {
    addGradeRangeRow(grade.label, grade.min, grade.max);
  });
  
  // Add event listener to add new grade range
  document.getElementById('addGradeRangeBtn').addEventListener('click', function() {
    addGradeRangeRow('', '', '');
  });
  
  // Add save button for grade ranges
  const saveButtonDiv = document.createElement('div');
  saveButtonDiv.style.marginTop = '20px';
  saveButtonDiv.innerHTML = `
    <button id="saveGradeRangesBtn" class="btn btn-primary">
      <i class="fas fa-save"></i> Save Grade Ranges
    </button>
  `;
  gradeEntryDiv.appendChild(saveButtonDiv);
  
  // Add event listener to save button
  document.getElementById('saveGradeRangesBtn').addEventListener('click', saveGradeRanges);
}

// Add a new grade range row
function addGradeRangeRow(label, min, max) {
  const gradeRangesContainer = document.getElementById('gradeRangesContainer');
  
  const rangeRow = document.createElement('div');
  rangeRow.className = 'grade-range-row';
  rangeRow.style.display = 'flex';
  rangeRow.style.alignItems = 'center';
  rangeRow.style.marginBottom = '10px';
  rangeRow.style.gap = '10px';
  
  rangeRow.innerHTML = `
    <div style="flex: 1;">
      <label>Grade:</label>
      <input type="text" class="form-control grade-label" value="${label}" placeholder="e.g., A+, B, C" required>
    </div>
    <div style="flex: 1;">
      <label>Min Marks:</label>
      <input type="number" class="form-control grade-min" value="${min}" min="0" max="100" required>
    </div>
    <div style="flex: 1;">
      <label>Max Marks:</label>
      <input type="number" class="form-control grade-max" value="${max}" min="0" max="100" required>
    </div>
    <div style="align-self: flex-end; margin-bottom: 5px;">
      <button class="btn btn-danger remove-grade-range">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
  
  gradeRangesContainer.appendChild(rangeRow);
  
  // Add event listener to remove button
  rangeRow.querySelector('.remove-grade-range').addEventListener('click', function() {
    if (document.querySelectorAll('.grade-range-row').length > 1) {
      this.closest('.grade-range-row').remove();
    } else {
      alert('At least one grade range is required.');
    }
  });
  
  // Add validation for min/max
  const minInput = rangeRow.querySelector('.grade-min');
  const maxInput = rangeRow.querySelector('.grade-max');
  
  // Validate min < max
  [minInput, maxInput].forEach(input => {
    input.addEventListener('change', function() {
      const min = parseInt(minInput.value);
      const max = parseInt(maxInput.value);
      
      if (min >= max) {
        alert('Minimum marks must be less than maximum marks.');
        this.value = '';
        this.focus();
      }
    });
  });
}

// Save grade ranges
function saveGradeRanges() {
  const gradeRanges = [];
  const rangeRows = document.querySelectorAll('.grade-range-row');
  
  // Get selected course
  const courseSelection = document.getElementById('courseSelection');
  const selectedCourse = courseSelection ? courseSelection.value : '';
  
  // Validate all inputs are filled
  let allValid = true;
  rangeRows.forEach(row => {
    const label = row.querySelector('.grade-label').value.trim();
    const min = parseInt(row.querySelector('.grade-min').value);
    const max = parseInt(row.querySelector('.grade-max').value);
    
    if (!label || isNaN(min) || isNaN(max)) {
      allValid = false;
    }
  });
  
  if (!allValid) {
    alert('Please fill in all grade range fields.');
    return;
  }
  
  // Check for overlapping ranges
  const allRanges = [];
  rangeRows.forEach(row => {
    const label = row.querySelector('.grade-label').value.trim();
    const min = parseInt(row.querySelector('.grade-min').value);
    const max = parseInt(row.querySelector('.grade-max').value);
    
    allRanges.push({ label, min, max });
  });
  
  // Sort by min value
  allRanges.sort((a, b) => a.min - b.min);
  
  // Check for overlaps
  for (let i = 0; i < allRanges.length - 1; i++) {
    if (allRanges[i].max >= allRanges[i+1].min) {
      alert(`Overlapping range detected between ${allRanges[i].label} and ${allRanges[i+1].label}`);
    return;
    }
  }
  
  // Save to localStorage - both general and course-specific if a course is selected
  localStorage.setItem('gradeRanges', JSON.stringify(allRanges));
  
  if (selectedCourse) {
    // Also save course-specific grade ranges
    localStorage.setItem(`gradeRanges_${selectedCourse}`, JSON.stringify(allRanges));
    alert(`Grade ranges saved successfully`);
  }
  
  // Add a success message that will automatically fade out
  const successMsg = document.createElement('div');
  successMsg.className = 'success-message';
  successMsg.style.position = 'fixed';
  successMsg.style.top = '20px';
  successMsg.style.right = '20px';
  successMsg.style.backgroundColor = '#4CAF50';
  successMsg.style.color = 'white';
  successMsg.style.padding = '15px';
  successMsg.style.borderRadius = '5px';
  successMsg.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
  successMsg.style.zIndex = '1000';
  successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Grade ranges saved successfully!';
  
  document.body.appendChild(successMsg);
  
  // Fade out and remove after 3 seconds
  setTimeout(() => {
    successMsg.style.opacity = '0';
    successMsg.style.transition = 'opacity 0.5s';
    setTimeout(() => {
      document.body.removeChild(successMsg);
    }, 500);
  }, 3000);
}

// Update a specific course result for a student
function updateStudentCourseResult(studentId, courseName, internal, external, practical) {
  const allResults = getAllStudentResults();
  const studentIndex = allResults.findIndex(student => student.studentId === studentId);
  
  if (studentIndex !== -1) {
    const courseIndex = allResults[studentIndex].results.findIndex(result => result.course === courseName);
    
    if (courseIndex !== -1) {
      allResults[studentIndex].results[courseIndex] = {
        course: courseName,
        internal: internal,
        external: external,
        practical: practical
      };
      
      localStorage.setItem('studentResults', JSON.stringify(allResults));
    }
  }
} 