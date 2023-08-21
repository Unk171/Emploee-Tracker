const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

const quest1 = [{
  type: 'list',
  name: 'startQuestion',
  message: 'What would you like to do?',
  choices: ['Viev All Employees', 'View All Roles', 'View All Departments', 'Add Employee', 'Add Role', 'Add Department', 'Update Employee Role']
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


async function main() {
  try {
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'rootr00t!',
      database: 'emploees_db'
    });

    console.log('Connected to the employees_db');

    const [sqlAll] = await db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary 
    FROM department JOIN role ON department.id = role.department_id 
    JOIN employee ON role.id = employee.role_id
    ORDER BY employee.id`);
    // console.table(sqlAll);

    const [sqlDep] = await db.query(`SELECT * FROM department ORDER BY id`);
    // console.table(sqlDep);

    const [sqlRole] = await db.query(`SELECT * FROM role ORDER BY id`);
    // console.table(sqlRole);

    const [sqlEmpl] = await db.query(`SELECT * FROM employee ORDER BY id`);
    // console.table(sqlEmpl);

    x(sqlAll, sqlDep, sqlRole, sqlEmpl);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

function x(sqlAll, sqlDep, sqlRole, sqlEmpl) {


  inquirer
    .prompt(quest1)
    .then((answers) => {

      if (answers.startQuestion === 'Viev All Employees') {
        console.table(sqlAll)
      } else if (answers.startQuestion === 'View All Roles') {
        console.table(sqlRole)
      } else if (answers.startQuestion === 'View All Departments') {
        console.table(sqlDep)
      } else if (answers.startQuestion === 'Add Employee') {
        console.log(sqlRole)



        inquirer
          .prompt([{
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
          ])
          .then((answers) => {

            console.log("answers:", answers)
            const params =
              db.query(`INSERT INTO emloyee (id, first_name, last_name, role_id, manager_id) VALUES (?)`,)

          }

          )


      };
    })
}

main();

console.log('!!!');


