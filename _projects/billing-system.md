---
title: "University of Ilorin Billing System"
problem: "University billing systems often require manual processes for tracking student charges, payments, and account balances. Students and administrators need an efficient digital system to manage tuition fees, departmental charges, and payment records with real-time balance calculations."
tools:
  - HTML5
  - CSS3
  - Vanilla JS
role: "Full-stack developer. Designed the billing logic, implemented student registration with faculty/department hierarchy, developed payment tracking system, and created an intuitive user interface for managing student accounts."
outcome: "Built a functional billing system prototype that manages student information across 5 faculties and 15 departments, tracks multiple charges and payments per student, calculates real-time account balances, and generates comprehensive billing statements. The system demonstrates practical application of client-side state management and form validation."
---

## Overview

The University of Ilorin Billing System is a web-based application designed to streamline the management of student billing information. It provides an efficient way to track student accounts, manage charges, record payments, and generate billing statements.

## Key Features

### Student Management
- **Student Registration**: Add students with unique IDs and personal information
- **Faculty Organization**: Support for 5 major faculties (Agriculture, Arts, Engineering, Science, Social Sciences)
- **Department Tracking**: 15 departments organized by faculty with dynamic selection
- **Profile Management**: Complete student information linked to billing records

### Billing Operations
- **Charge Management**: Add multiple charges with descriptions and amounts
- **Payment Recording**: Track payments with method and date information
- **Balance Calculation**: Real-time calculation of current account balance
- **Statement Generation**: Comprehensive billing statements showing all transactions

### User Interface
- **Organized Sections**: Clear separation of student, charge, and payment forms
- **Dynamic Forms**: Department selector updates based on faculty choice
- **Instant Feedback**: Real-time validation and billing statement updates
- **Clean Design**: Professional styling for administrative use

## Interactive Demo

<div class="billing-system-container">
  <style>
    .billing-system-container {
      font-family: var(--font-sans);
      margin: 2rem 0;
      padding: 2rem;
      background: var(--color-background);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
    }
    .billing-system-container h2 {
      color: var(--color-text);
      font-size: 1.5rem;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
    }
    .billing-section {
      border: 1px solid var(--color-border);
      padding: 1.5rem;
      border-radius: var(--radius-md);
      margin-bottom: 1.5rem;
      background: var(--color-background-subtle);
    }
    .billing-section h2 {
      margin-top: 0;
      font-size: 1.25rem;
      color: var(--color-accent);
    }
    .billing-section label {
      display: block;
      margin-top: 1rem;
      font-weight: 500;
      color: var(--color-text);
    }
    .billing-section input,
    .billing-section select {
      margin-top: 0.5rem;
      width: 100%;
      padding: 0.625rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      font-family: var(--font-sans);
      font-size: 1rem;
      background: var(--color-background);
    }
    .billing-section input:focus,
    .billing-section select:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px var(--color-accent-light);
    }
    .billing-section button {
      margin-top: 1rem;
      padding: 0.75rem 1.5rem;
      background: var(--color-accent);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      font-family: var(--font-sans);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .billing-section button:hover {
      background: var(--color-accent-hover);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
    .billing-statement {
      display: none;
      background: var(--color-background);
    }
    .billing-statement.active {
      display: block;
    }
    #statementContent {
      line-height: 1.75;
      color: var(--color-text);
    }
    #statementContent b {
      color: var(--color-text);
      font-weight: 600;
    }
    #statementContent ul {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
    }
    #statementContent li {
      margin: 0.25rem 0;
    }
  </style>

  <div class="billing-section">
    <h2>Add Student</h2>
    <form id="studentForm">
      <label>Student ID: <input type="text" id="studentId" required></label>
      <label>Name: <input type="text" id="studentName" required></label>
      <label>Faculty:
        <select id="faculty" required>
          <option value="">Select Faculty</option>
          <option value="Agriculture">Agriculture</option>
          <option value="Arts">Arts</option>
          <option value="Engineering">Engineering</option>
          <option value="Science">Science</option>
          <option value="Social Sciences">Social Sciences</option>
        </select>
      </label>
      <label>Department:
        <select id="department" required>
          <option value="">Select Department</option>
        </select>
      </label>
      <button type="submit">Add Student</button>
    </form>
  </div>

  <div class="billing-section">
    <h2>Add Charge</h2>
    <form id="chargeForm">
      <label>Description: <input type="text" id="chargeDesc" required></label>
      <label>Amount: <input type="number" id="chargeAmount" required></label>
      <button type="submit">Add Charge</button>
    </form>
  </div>

  <div class="billing-section">
    <h2>Record Payment</h2>
    <form id="paymentForm">
      <label>Amount: <input type="number" id="paymentAmount" required></label>
      <label>Method: <input type="text" id="paymentMethod" required></label>
      <button type="submit">Record Payment</button>
    </form>
  </div>

  <div class="billing-section billing-statement" id="statementSection">
    <h2>Billing Statement</h2>
    <div id="statementContent"></div>
  </div>

  <script>
    // Faculties and departments
    const FACULTIES = {
      "Agriculture": ["Agricultural Economics", "Animal Science", "Crop Protection"],
      "Arts": ["English", "History", "Linguistics"],
      "Engineering": ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering"],
      "Science": ["Biochemistry", "Chemistry", "Physics"],
      "Social Sciences": ["Economics", "Political Science", "Psychology"]
    };

    // Student data
    let student = null;
    let charges = [];
    let payments = [];

    // Populate departments based on faculty
    document.getElementById('faculty').addEventListener('change', function() {
      const faculty = this.value;
      const deptSelect = document.getElementById('department');
      deptSelect.innerHTML = '<option value="">Select Department</option>';
      if (FACULTIES[faculty]) {
        FACULTIES[faculty].forEach(dept => {
          const opt = document.createElement('option');
          opt.value = dept;
          opt.textContent = dept;
          deptSelect.appendChild(opt);
        });
      }
    });

    // Add student
    document.getElementById('studentForm').addEventListener('submit', function(e) {
      e.preventDefault();
      student = {
        id: document.getElementById('studentId').value,
        name: document.getElementById('studentName').value,
        faculty: document.getElementById('faculty').value,
        department: document.getElementById('department').value
      };
      charges = [];
      payments = [];
      showStatement();
    });

    // Add charge
    document.getElementById('chargeForm').addEventListener('submit', function(e) {
      e.preventDefault();
      if (!student) return alert('Add student first!');
      charges.push({
        description: document.getElementById('chargeDesc').value,
        amount: parseFloat(document.getElementById('chargeAmount').value)
      });
      document.getElementById('chargeDesc').value = '';
      document.getElementById('chargeAmount').value = '';
      showStatement();
    });

    // Record payment
    document.getElementById('paymentForm').addEventListener('submit', function(e) {
      e.preventDefault();
      if (!student) return alert('Add student first!');
      payments.push({
        amount: parseFloat(document.getElementById('paymentAmount').value),
        method: document.getElementById('paymentMethod').value,
        date: new Date().toISOString().split('T')[0]
      });
      document.getElementById('paymentAmount').value = '';
      document.getElementById('paymentMethod').value = '';
      showStatement();
    });

    // Show statement
    function showStatement() {
      if (!student) return;
      const section = document.getElementById('statementSection');
      section.classList.add('active');
      let html = `<b>Name:</b> ${student.name}<br>
                  <b>ID:</b> ${student.id}<br>
                  <b>Faculty:</b> ${student.faculty}<br>
                  <b>Department:</b> ${student.department}<br>
                  <b>Charges:</b><ul>`;
      let totalCharges = 0;
      charges.forEach(c => {
        html += `<li>${c.description}: ₦${c.amount.toFixed(2)}</li>`;
        totalCharges += c.amount;
      });
      html += `</ul><b>Payments:</b><ul>`;
      let totalPayments = 0;
      payments.forEach(p => {
        html += `<li>${p.date} [${p.method}]: ₦${p.amount.toFixed(2)}</li>`;
        totalPayments += p.amount;
      });
      html += `</ul><b>Current Balance:</b> ₦${(totalCharges - totalPayments).toFixed(2)}`;
      document.getElementById('statementContent').innerHTML = html;
    }
  </script>
</div>

## Technical Implementation

### Faculty and Department Hierarchy

The system organizes students into a hierarchical structure:
- 5 faculties covering major academic divisions
- 15 departments distributed across faculties
- Dynamic department selection based on faculty choice
- Data validation ensuring complete student profiles

### Billing Logic

The core billing algorithm:
1. Track all charges added to a student account
2. Record all payments with dates and methods
3. Calculate balance as: Total Charges - Total Payments
4. Display itemized statement with full transaction history

### Client-side State Management

Uses vanilla JavaScript to maintain application state:
- Student object storing profile information
- Arrays for charges and payments
- Event-driven updates to billing statement
- Form validation before data submission

## Use Cases

### For Students
- View comprehensive billing statements
- Track all charges and payments
- Monitor account balance in real-time

### For Administrators
- Register students efficiently
- Add charges for tuition, fees, and services
- Record payments from various methods
- Generate statements for reconciliation

## Technical Learnings

This project demonstrates:
1. **Form Management**: Dynamic form handling with validation
2. **State Management**: Client-side data management without frameworks
3. **Data Relationships**: Organizing hierarchical data (faculties/departments)
4. **User Experience**: Clear feedback and organized workflows
5. **Financial Calculations**: Accurate currency handling and balance calculation

---

*This billing system prototype showcases practical application of fundamental web technologies to solve real-world administrative challenges in educational institutions.*
