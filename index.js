const inquirer = require('inquirer');



const startQuestion = [{
  type: 'list',
  name: 'startQuestion',
  message: 'What would you like to do?',
  choices: ['Viev All Employees', 'View All Roles', 'View All Departments', 'Add Employee', 'Add Role', 'Add Department','Update Employee Role']
}];

const addDepartment = [{
  type: 'input',
  name: 'addDepartment',
  message: 'What is the name of the department?' 
}];

const addEmployee = [{
    type: 'input',
    name: 'addEmployeeFirst',
    message: "What is the employee's first name?" 
},
{
  type: 'input',
  name: 'addEmployeeLast',
  message: "What is the employee's last name?" 
},
{
  type: 'list',
  name: 'addEmployeeRole',
  message: "What is the employee's role?",
  choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer']
},
{
  type: 'list',
  name: 'addEmployeeManager',
  message: "Who is employee's manager?",
  choices: ['None', 'John Doe', 'Mike Chan', 'Ashley Rodriguez', 'Kevin Tupik', 'Kunak Singh', 'Malia Brown', 'Sarah Lourd', 'Tom Allen']
}
];

const addRole = [{
  type: 'input',
  name: 'addRole',
  message: 'What is the name of the role?' 
},
{
  type: 'input',
  name: 'addSalary',
  message: 'What is the salary of the role?' 
},
{
  type: 'list',
  name: 'addRoleDepartment',
  message: 'Which department does the role belong to?',
  choices: ['Sales', 'Legal', 'Finance', 'Engineering']
}
];

const employeeUpdata = [{
  type: 'list',
  name: 'employeeUpdate',
  message: "Which employee's role do you want update?",
  choices: ['John Doe', 'Mike Chan', 'Ashley Rodriguez', 'Kevin Tupik', 'Kunak Singh', 'Malia Brown', 'Sarah Lourd', 'Tom Allen']
},
{
  type: 'list',
  name: 'employeeUpdateRole',
  message: "Which role do you want to assign the selected employee?",
  choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer']
}
]