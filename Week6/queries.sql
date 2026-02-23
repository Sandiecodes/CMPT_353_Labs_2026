CREATE DATABASE Grades;

 USE Grades;

--Create Table Students
CREATE TABLE Students (student_id INT PRIMARY KEY, name VARCHAR(50), major VARCHAR(50));

--Insert data into Students
INSERT INTO Students (student_id, name, major) VALUES
(101, 'Alice', 'CS'),
(102, 'Bob', 'CS'),
(103, 'Carol', 'Math'),
(104, 'Dave', 'CS'),
(105, 'Eve', 'Math'),
(106, 'Frank', 'CS');

--Create Table Enrollments
CREATE TABLE Enrollments (
    enroll_id INT PRIMARY KEY,
    student_id INT,
    course VARCHAR(20),
    grade INT
);
--Insert data into Enrollments
INSERT INTO Enrollments (enroll_id, student_id, course, grade) VALUES
(1, 101, 'CMPT353', 85),
(2, 101, 'CMPT370', 92),
(3, 102, 'CMPT353', 78),
(4, 103, 'CMPT353', 91),
(5, 104, 'CMPT370', 67),
(6, 105, 'MATH264', 88),
(7, 999, 'CMPT353', 55);

--Inner Join to get student names, courses, and grades
SELECT s.name, e.course, e.grade
FROM Students s
INNER JOIN Enrollments e ON s.student_id = e.student_id;

--Inner Join + WHERE clause to filter for CS majors
SELECT s.name, e.grade
FROM Students s
JOIN Enrollments e
ON s.student_id = e.student_id
WHERE s.major = 'CS'
AND e.course = 'CMPT353'
ORDER BY e.grade DESC;

--Left Join to get all students and their grades (if any)
SELECT s.name, e.course, e.grade
FROM Students s
LEFT JOIN Enrollments e ON s.student_id = e.student_id;

--Left Join + Is NULL
SELECT s.name
FROM Students s
LEFT JOIN Enrollments e
ON s.student_id = e.student_id
WHERE e.enroll_id IS NULL;

--Right Join
SELECT s.name, e.course, e.grade
FROM Students s
RIGHT JOIN Enrollments e ON s.student_id = e.student_id;

--Full Outer Join
SELECT s.name, s.student_id, e.course, e.grade
FROM Students s
FULL OUTER JOIN Enrollments e ON s.student_id = e.student_id;

-- FULL OUTER JOIN simulation in MySQL
SELECT s.name, s.student_id, e.course, e.grade
FROM Students s
LEFT JOIN Enrollments e
ON s.student_id = e.student_id

UNION

SELECT s.name, s.student_id, e.course, e.grade
FROM Students s
RIGHT JOIN Enrollments e
ON s.student_id = e.student_id;

--Cross Join
SELECT s.name, c.course
FROM Students s
CROSS JOIN
(SELECT DISTINCT course
FROM Enrollments) c;

--Natural Join
SELECT s.name, e.course, e.grade
FROM Students s
NATURAL JOIN Enrollments e;

--Self join
SELECT DISTINCT
s1.name AS student_1,
s2.name AS student_2, e1.course
FROM Enrollments e1
JOIN Enrollments e2
ON e1.course = e2.course
AND e1.student_id < e2.student_id
JOIN Students s1 ON e1.student_id = s1.student_id
JOIN Students s2 ON e2.student_id = s2.student_id;
