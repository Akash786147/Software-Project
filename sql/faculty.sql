CREATE TABLE faculty (
    faculty_id VARCHAR(10) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15),
    department VARCHAR(50) NOT NULL,
    designation VARCHAR(50) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    joining_date DATE NOT NULL,
    status ENUM('active', 'inactive', 'on_leave') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index for faster searches
CREATE INDEX idx_faculty_department ON faculty(department);
CREATE INDEX idx_faculty_status ON faculty(status);

-- Add some sample data
INSERT INTO faculty (faculty_id, first_name, last_name, email, phone_number, department, designation, qualification, joining_date) VALUES
('FAC001', 'John', 'Smith', 'john.smith@bmu.edu', '+91-9876543210', 'Computer Science', 'Professor', 'Ph.D. in Computer Science', '2020-01-15'),
('FAC002', 'Sarah', 'Johnson', 'sarah.johnson@bmu.edu', '+91-9876543211', 'Computer Science', 'Associate Professor', 'Ph.D. in Software Engineering', '2021-03-01'),
('FAC003', 'Michael', 'Brown', 'michael.brown@bmu.edu', '+91-9876543212', 'Computer Science', 'Assistant Professor', 'M.Tech in Computer Science', '2022-06-15'); 