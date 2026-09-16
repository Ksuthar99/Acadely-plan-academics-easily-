# Acadely – Academic Planning System

**Academic Planning made easier.**

## 📌 About the Project

**Acadely** is a Computer Science Department Academic Planning System designed to help the HOD, faculty, and students manage academic activities in one centralized system.

The system focuses on academic planning for **FY B.Sc. Computer Science, SY B.Sc. Computer Science, and TY B.Sc. Computer Science**, including courses, faculty, students, practical batches, timetable planning, attendance, marks, and other academic activities.

The main purpose of Acadely is to reduce manual work and make academic planning and management easier for the department.

---

## 🎯 Objectives

* Centralize academic information of the Computer Science department.
* Simplify course and faculty management.
* Allow faculty to submit course preferences and availability.
* Help the HOD manage course allocation and workload.
* Plan theory and practical timetables.
* Detect timetable and resource conflicts.
* Manage attendance, assignments, study material, and marks.
* Provide students with easy access to their academic information.

---

## 👥 User Roles

### HOD / Admin

The HOD is the main administrator of the system.

* Manage academic years and semesters.
* Manage FY, SY, and TY B.Sc. Computer Science structure.
* Manage courses and curriculum.
* Manage faculty and students.
* Approve faculty registrations.
* Review faculty course preferences and availability.
* Allocate courses to faculty.
* Manage practical batches and laboratories.
* Generate and review timetables.
* Detect and resolve scheduling conflicts.
* Approve and publish the timetable.
* Monitor attendance and marks.
* Generate academic reports.

### Faculty

* Register and login.
* Manage profile.
* Submit preferred courses.
* Submit availability.
* View course allocation.
* View assigned class, division, and batch.
* View timetable.
* Mark student attendance.
* Upload study material.
* Manage assignments.
* Enter marks.
* View notices.

### Student

* Register and login.
* View academic details.
* View assigned courses and faculty.
* View class, division, and practical batch.
* View timetable.
* View attendance.
* Access study material and assignments.
* View marks and results.
* View notices.

---

## 🏫 Academic Structure

Acadely supports the department's academic structure for:

* FY B.Sc. Computer Science
* SY B.Sc. Computer Science
* TY B.Sc. Computer Science

The system can manage semester-wise courses, theory subjects, practical subjects, credits, required hours, faculty allocation, and practical batches.

---

## 🗓️ Timetable Planning

Timetable planning is one of the main functions of Acadely.

The system considers:

* Courses and required teaching hours.
* Theory and practical courses.
* Faculty allocation.
* Faculty availability.
* Classes and divisions.
* Practical batches.
* Classrooms and laboratories.
* Available time slots.
* Practical sessions requiring continuous periods.

The system checks for conflicts such as:

* Faculty assigned to two classes at the same time.
* A class having two courses at the same time.
* A laboratory or classroom being used by multiple classes.
* Faculty availability conflicts.
* Practical scheduling conflicts.

The generated timetable can then be reviewed and modified by the HOD before publishing.

---

## 🧪 Practical Planning

Acadely supports practical scheduling through practical batches and laboratories.

The system can manage:

* Practical batches.
* Laboratory allocation.
* Faculty allocation.
* Practical time slots.
* Lab availability.
* Batch-wise practical scheduling.
* Conflicts between batches, faculty, and laboratories.

---

## 🔑 Main Entities

The major entities planned for the system include:

* Academic Year
* Department
* Program
* Class
* Division
* Course
* Faculty
* Student
* Batch
* User
* Curriculum
* Faculty Availability
* Course Allocation
* Time Slot
* Classroom
* Laboratory
* Timetable
* Attendance
* Assignment
* Study Material
* Marks
* Notice

---

## 🛠️ Technology Stack

### Frontend

* React.js
* HTML
* CSS
* Tailwind CSS

### Backend

* Python
* Flask
* REST API
* SQLAlchemy

### Database

* PostgreSQL

### Development Tools

* Visual Studio Code
* Git
* GitHub
* Postman

---

## 🏗️ System Architecture

```text
                 ┌─────────────────────┐
                 │      Users          │
                 │ HOD / Faculty /     │
                 │      Student        │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   React Frontend    │
                 │  HTML/CSS/Tailwind  │
                 └──────────┬──────────┘
                            │
                         REST API
                            │
                            ▼
                 ┌─────────────────────┐
                 │    Flask Backend    │
                 │  Authentication &   │
                 │   Business Logic    │
                 └──────────┬──────────┘
                            │
                      SQLAlchemy
                            │
                            ▼
                 ┌─────────────────────┐
                 │ PostgreSQL Database │
                 └─────────────────────┘
```

---

## 🔐 Role-Based Access

Acadely uses role-based access to provide different functionalities to:

* HOD / Admin
* Faculty
* Student

Authentication and authorization are handled by the backend so users can access only the functions permitted for their role.

---

## 📚 Academic Context

The system is designed for academic planning within the **Computer Science Department** and considers the requirements of FY, SY, and TY B.Sc. Computer Science.

The system is intended to support the HOD in organizing academic activities rather than replacing the HOD's final decisions.

---

## 👤 End Users

1. HOD / Department Administrator
2. Faculty Members
3. Students

---

*Images =>*

<img width="1314" height="870" alt="acadelyP" src="https://github.com/user-attachments/assets/ca6edfa6-0392-480c-8dc2-1e5c0d5bc254" />



