-- Active: 1741678142568@@127.0.0.1@5432@attendancemanagement
-- Table for storing employee details
-- Create the ENUM type for roles
CREATE TYPE RoleType AS ENUM ('HR', 'Employee');

-- Create the Employees table
CREATE TABLE Employees (
    EmployeeID SERIAL PRIMARY KEY, -- Auto-incrementing ID using SERIAL
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Role RoleType NOT NULL, -- Using the ENUM type for roles
    Department VARCHAR(50),
    Position VARCHAR(50),
    HireDate DATE NOT NULL,
    -- Index for Role column
    CONSTRAINT Role_Index UNIQUE (Role)
);
CREATE TYPE attendance_status AS ENUM ('Checked In', 'Checked Out', 'Absent'); -- Define ENUM type

CREATE TABLE attendanceLogs (
    logID SERIAL PRIMARY KEY, -- Sequential IDs for tracking
    employeeID INT NOT NULL, -- Reference to Employees table
    attendanceDate DATE NOT NULL,
    checkInTime TIME,
    checkOutTime TIME,
    Status attendance_status DEFAULT 'Checked In', -- Default to Checked In
    FOREIGN KEY (employeeID) REFERENCES Employees(EmployeeID) ON DELETE CASCADE -- Foreign key constraint
);

ALTER TABLE Employees DROP CONSTRAINT Role_Index;



INSERT INTO Employees (FullName, Email, Password, Role, Department, Position, HireDate)
VALUES 
('ali', 'ali.hr@pixelvide.com', 'ali123', 'HR', 'Human Resources', 'Manager', '2025-01-15'),
('muneeb', 'muneeb.ali@pixelvide.com', 'ali123', 'Employee', 'Engineering', 'Software Engineer', '2025-04-01');


