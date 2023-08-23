const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
let employees = [];
let roles = [];
let departments = [];
let empId;
let roleId;
let depId;

const quest1 = [{
  type: 'list',
  name: 'startQuestion',
  message: 'What would you like to do?',
  choices: ['Viev All Employees', 'View All Roles', 'View All Departments', 'Add Employee', 'Add Role', 'Add Department', 'Update Employee Role']
}];

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
    const [sqlDep] = await db.query(`SELECT * FROM department ORDER BY id`);
    const [sqlRole] = await db.query(`SELECT * FROM role ORDER BY id`);
    const [sqlEmpl] = await db.query(`SELECT * FROM employee ORDER BY id`);

    inquirer
      .prompt(quest1)
      .then((answers) => {
        if (answers.startQuestion === 'Viev All Employees') {
          console.log('Employees:');
          console.table(sqlAll);
          restart();
        } else if (answers.startQuestion === 'View All Roles') {
          console.log('Roles:');
          console.table(sqlRole);
          restart();
        } else if (answers.startQuestion === 'View All Departments') {
          console.log('Departments:');
          console.table(sqlDep);
          restart();
        } else if (answers.startQuestion === 'Add Employee') {
          roles = [];
          empId = '';
          roleId = '';

          for (let i = 0; i < sqlRole.length; i++) {
            roles.push(sqlRole[i].title)
          };
          inquirer
            .prompt([{
              type: 'input',
              name: 'addEmployeeFirst',
              message: "What is the employee's first name?"
            }, {
              type: 'input',
              name: 'addEmployeeLast',
              message: "What is the employee's last name?"
            }, {
              type: 'list',
              name: 'addEmployeeRole',
              message: "What is the employee's role?",
              choices: roles
            }, {
              type: 'list',
              name: 'addEmployeeManager',
              message: "Who is employee's manager?",
              choices: ['None', 'John Doe', 'Mike Chan', 'Ashley Rodriguez', 'Kevin Tupik', 'Kunak Singh', 'Malia Brown', 'Sarah Lourd', 'Tom Allen']
            }])
            .then((answers) => {
              for (let i = 0; i < sqlEmpl.length; i++) {
                if (answers.addEmployeeManager === sqlEmpl[i].first_name + ' ' + sqlEmpl[i].last_name) {
                  empId = sqlEmpl[i].id;
                };
                if (answers.addEmployeeManager === 'None') {
                  empId = null
                }
              };
              for (let i = 0; i < sqlRole.length; i++) {
                if (answers.addEmployeeRole === sqlRole[i].title) {
                  roleId = sqlRole[i].id;
                }
              };
              db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.addEmployeeFirst, answers.addEmployeeLast, roleId, empId]);
              console.log('Employee added');
              restart();
            })
        } else if (answers.startQuestion === 'Add Role') {
          departments = [];
          for (let i = 0; i < sqlDep.length; i++) {
            departments.push(sqlDep[i].name)
          };
          inquirer
            .prompt([{
              type: 'input',
              name: 'roleName',
              message: 'What is the name of the role?'
            }, {
              type: 'input',
              name: 'addSalary',
              message: 'What is the salary of the role?'
            }, {
              type: 'list',
              name: 'addRoleDepartment',
              message: 'Which department does the role belong to?',
              choices: departments
            }])
            .then((answers) => {
              for (let i = 0; i < sqlDep.length; i++) {
                if (answers.addRoleDepartment === sqlDep[i].name) {
                  depId = sqlDep[i].id;
                }
              };
              db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.roleName, answers.addSalary, depId]);
              console.log('Role added');
              restart();
            })
        } else if (answers.startQuestion === 'Add Department') {
          inquirer
            .prompt([{
              type: 'input',
              name: 'addDepName',
              message: 'What is the name of the department?'
            }])
            .then((answers) => {
              db.query(`INSERT INTO department (name) VALUES (?)`, [answers.addDepName]);
              console.log('Department added');
              restart();
            })
        } else if (answers.startQuestion === 'Update Employee Role') {
          roles = [];
          employees = [];
          empId = '';
          roleId = '';
          for (let i = 0; i < sqlEmpl.length; i++) {
            employees.push(sqlEmpl[i].first_name + ' ' + sqlEmpl[i].last_name)
          };
          for (let i = 0; i < sqlRole.length; i++) {
            roles.push(sqlRole[i].title)
          };
          inquirer
            .prompt([{
              type: 'list',
              name: 'employeeUpdate',
              message: "Which employee's role do you want update?",
              choices: employees
            },
            {
              type: 'list',
              name: 'employeeUpdateRole',
              message: "Which role do you want to assign the selected employee?",
              choices: roles
            }])
            .then((answers) => {
              for (let i = 0; i < sqlEmpl.length; i++) {
                if (answers.employeeUpdate === sqlEmpl[i].first_name + ' ' + sqlEmpl[i].last_name) {
                  empId = sqlEmpl[i].id;
                }
              };
              for (let i = 0; i < sqlRole.length; i++) {
                if (answers.employeeUpdateRole === sqlRole[i].title) {
                  roleId = sqlRole[i].id;
                }
              };
              db.query(`UPDATE employee SET role_id = '?' WHERE id = '?'`, [roleId, empId]);
              console.log("Employee's role updated");
              restart();
            })
        }
      })
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

function restart() {
  main();
}

main();

