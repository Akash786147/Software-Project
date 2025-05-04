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

// Add here if needed - other specific imports or module references 