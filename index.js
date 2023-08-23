const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
// global variables 
let employees = [];
let roles = [];
let departments = [];
let empId;
let roleId;
let depId;
// main question 
const quest1 = [{
  type: 'list',
  name: 'startQuestion',
  message: 'What would you like to do?',
  choices: ['Viev All Employees', 'View All Roles', 'View All Departments', 'Add Employee', 'Add Role', 'Add Department', 'Update Employee Role', 'Delete emloyee', 'Delete role', 'Delete department']
}];
// function with all programm 
async function main() {
  try {
    // connect to db 
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'rootr00t!',
      database: 'emploees_db'
    });
    console.log('Connected to the employees_db');
    // query for view employees 
    const [sqlAll] = await db.query(`SELECT
    e.id AS employee_id,
    e.first_name,
    e.last_name,
    IFNULL(r.title, 'No Role') AS role_title,
    IFNULL(d.name, 'No Department') AS department_name,
    IFNULL(r.salary, 0.00) AS salary,
    CONCAT(IFNULL(m.first_name, 'No'), ' ', IFNULL(m.last_name, 'Manager')) AS manager_name
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id
    ORDER BY e.id;`);
    const [sqlDep] = await db.query(`SELECT * FROM department ORDER BY id`);
    const [sqlRole] = await db.query(`SELECT id, title, salary,
    IFNULL(department_id, 'No Department') AS department_id
    FROM role
    ORDER BY id;`);
    const [sqlEmpl] = await db.query(`SELECT * FROM employee ORDER BY id`);

    inquirer
      .prompt(quest1)
      .then((answers) => {
// view employees 
        if (answers.startQuestion === 'Viev All Employees') {
          console.log('Employees:');
          const customColumnNames = sqlAll.map(row => ({
            'Employee ID': row.employee_id,
            'First Name': row.first_name,
            'Last Name': row.last_name,
            'Role': row.role_title,
            'Department': row.department_name,
            'Salary': row.salary,
            'Manager': row.manager_name
          }));
          console.table(customColumnNames);
          restart();
// view roles 
        } else if (answers.startQuestion === 'View All Roles') {
          console.log('Roles:');
          const roleTable = sqlRole.map(row => ({
            'id': row.id,
            'Role Name': row.title,
            'Salary': row.salary,
            'Department': row.department_id
          }));
          console.table(roleTable);
          restart();
// view departments 
        } else if (answers.startQuestion === 'View All Departments') {
          console.log('Departments:');
          const departmentTable = sqlDep.map(row => ({
            'id': row.id,
            'Department Name': row.name
          }));
          console.table(departmentTable);
          restart();
// add employee 
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
// add role 
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
// add department 
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
// update employee role 
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
// delete employee 
        } else if (answers.startQuestion === 'Delete emloyee') {
          employees = [];
          empId = '';
          for (let i = 0; i < sqlEmpl.length; i++) {
            employees.push(sqlEmpl[i].first_name + ' ' + sqlEmpl[i].last_name)
          };
          inquirer
            .prompt([{
              type: 'list',
              name: 'deleteEmployee',
              message: "Which employee do you want delete?",
              choices: employees
            }])
            .then((answers) => {
              for (let i = 0; i < sqlEmpl.length; i++) {
                if (answers.deleteEmployee === sqlEmpl[i].first_name + ' ' + sqlEmpl[i].last_name) {
                  empId = sqlEmpl[i].id;
                }
              };
              db.query(`DELETE FROM employee WHERE id = ?`, [empId]);
              console.log("Employee deleted");
              restart();
            })
// delete role 
        } else if (answers.startQuestion === 'Delete role') {
          roles = [];
          roleId = '';
          for (let i = 0; i < sqlRole.length; i++) {
            roles.push(sqlRole[i].title)
          };
          inquirer
            .prompt([{
              type: 'list',
              name: 'deleteRole',
              message: "Which role do you want delete?",
              choices: roles
            }])
            .then((answers) => {
              for (let i = 0; i < sqlRole.length; i++) {
                if (answers.deleteRole === sqlRole[i].title) {
                  roleId = sqlRole[i].id;
                }
              };
              db.query(`DELETE FROM role WHERE id = ?`, [roleId]);
              console.log("Role deleted");
              restart();
            })
// delete department
        } else if (answers.startQuestion === 'Delete department') {
          departments = [];
          depId = '';
          for (let i = 0; i < sqlDep.length; i++) {
            departments.push(sqlDep[i].name)
          };
          inquirer
            .prompt([{
              type: 'list',
              name: 'deleteDep',
              message: "Which department do you want delete?",
              choices: departments
            }])
            .then((answers) => {
              for (let i = 0; i < sqlDep.length; i++) {
                if (answers.deleteDep === sqlDep[i].name) {
                  depId = sqlDep[i].id;
                }
              };
              db.query(`DELETE FROM department WHERE id = ?`, [depId]);
              console.log("Department deleted");
              restart();
            })
        }
      })
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
// restart function 
function restart() {
  main();
};

main();

