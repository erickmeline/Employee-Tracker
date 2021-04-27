const mysql = require('mysql');
const inquirer = require('inquirer');
const badge = require('./badge.js');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'orgDB'
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`Welcome! You're connected as id ${connection.threadId}`);
    console.log(badge());
    mainMenu();
});

const mainMenu = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: '\n===========[ Main Menu ]==========\n',
            name: 'option',
            choices: [
                'View/Modify Departments',
                'View/Modify Roles',
                'View/Modify Employees',
                'Exit',
            ],
            default: ['Exit']
        }
    ]).then((response) => {
        switch (response.option) {
            case 'View/Modify Departments':
                departmentMenu();
            break;
            case 'View/Modify Roles':
                roleMenu();
            break
            case 'View/Modify Employees':
                employeeMenu();
            break;
            default:
                exit();
        }
    })
}

const departmentMenu = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: '\n=======[ Departments Menu ]=======\n',
            name: 'option',
            choices: [
                'View All Departments',
                'Add New Department',
                'Modify/Delete Department',
                'Main Menu'
            ]
        }
    ]).then((response) => {
        switch (response.option) {
            case 'View All Departments':
                viewAll('department');
            break;
            case 'Add New Department':
                addNew('department');
            break
            case 'Modify/Delete Department':
                modDel('department');
            break;
            default:
                mainMenu();
        }
    })
}

const roleMenu = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: '\n==========[ Roles Menu ]==========\n',
            name: 'option',
            choices: [
                'View All Roles',
                'Add New Role',
                'Modify/Delete Role',
                'Direct Reports',
                'Main Menu'
            ]
        }
    ]).then((response) => {
        switch (response.option) {
            case 'View All Roles':
                viewAll('role');
            break;
            case 'Add New Role':
                addNew('role');
            break
            case 'Modify/Delete Role':
                modDel('role');
            break;
            case 'Direct Reports':
                directReports();
            break;
            default:
                mainMenu();
        }
    })
}

const employeeMenu = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: '\n=========[ Employee Menu ]========\n',
            name: 'option',
            choices: [
                'View All Employees',
                'Add New Employee',
                'Modify/Delete Employee',
                'Reporting To',
                'Main Menu'
            ]
        }
    ]).then((response) => {
        switch (response.option) {
            case 'View All Employees':
                viewAll('employee');
            break;
            case 'Add New Employee':
                addNew('employee');
            break
            case 'Modify/Delete Employee':
                modDel('employee');
            break;
            case 'Reporting To':
                reportsTo();
            break;
            default:
                mainMenu();
        }
    })
}

const viewAll = (identifier) => {
    const query = `SELECT * FROM ${identifier}`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        if (res.length) {
            console.log(`All ${identifier}s:`);
            console.table(res);
        }
        else {
            console.log(`\nThere are no ${identifier}s to display.\n`);
        }
        mainMenu();
    });
}

const addNew = (identifier) => {
    if (identifier === 'department') {
        inquirer.prompt([
            {
                message: `Name of ${identifier} to add:`,
                name: 'name'
            }
        ]).then((response) => {
            connection.query(`INSERT INTO ${identifier} SET ?`,
            {
                name: response.name
            },
            (err) => {
                if (err) throw err;
                console.log(`\nSucessfully added ${response.name} ${identifier}\n`);
                viewAll(identifier);
            });
        });
    }
    else if (identifier === 'role') {
        connection.query(`SELECT * FROM department`, (err, res) => {
            if (err) throw err;
            inquirer.prompt([
                {
                    message: `Name of ${identifier} to add:`,
                    name: 'title'
                },
                {
                    message: `Salary of this role:`,
                    name: 'salary'
                },
                {
                    type: 'list',
                    message: `Department this role belongs too:`,
                    name: 'department',
                    choices: res.map((department) => department.name)
                }

            ]).then((response) => {
                let departmentId;
                res.forEach(department => {
                    if (department.name === response.department) {
                        departmentId = department.id;
                    }
                });
                connection.query(`INSERT INTO ${identifier} SET ?`,
                {
                    title: response.title,
                    salary: response.salary,
                    department_id: departmentId
                },
                (err) => {
                    if (err) throw err;
                    console.log(`\nSucessfully added ${response.title} ${identifier}\n`);
                    viewAll(identifier);
                });
            });
        })
    }
    else {
        connection.query(`SELECT * FROM role WHERE title = 'manager'`, (err, managers) => {
            if (err) throw err;
            connection.query(`SELECT * FROM role`, (err, roles) => {
                if (err) throw err;
                const roleChoices = roles.map((role) => role.title);
                roleChoices.push('Create new');
                const managerChoices = managers.map((manager) => manager.name);
                managerChoices.push('Create new');
                inquirer.prompt([
                    {
                        message: 'First name of employee to add:',
                        name: 'first_name'
                    },
                    {
                        message: 'Last name of employee to add:',
                        name: 'last_name'
                    },
                    {
                        type: 'list',
                        message: 'Select a role',
                        name: 'role',
                        choices: roleChoices
                    },
                    {
                        type: 'list',
                        message: 'Select a manager:',
                        name: 'manager',
                        choices: managerChoices
                    }
                ]).then((response) => {
                    let managerId, roleId;
                    // roles.forEach(role => {
                    //     if (role.title === role.manager) {
                    //         roleId = role.id;
                    //     }
                    // });
                    // managers.forEach(manager => {
                    //     if (manager.name === response.manager) {
                    //         managerId = manager.id;
                    //     }
                    // });
                    if (response.role === 'Create new' || response.manager === 'Create new') {
                        addNew('role');
                    }
                    connection.query(`INSERT INTO ${identifier} SET ?`,
                    {
                        first_name: response.first_name,
                        last_name: response.last_name,
                        // role: roleId,
                        // manager: managerId
                    },
                    (err) => {
                        if (err) throw err;
                        console.log(`\nSucessfully added ${identifier} ${response.first_name} ${response.last_name}\n`);
                        viewAll(identifier);
                    });
                });
            });
        });
    }
}

const modDel = (identifier) => {
    console.log('called modDel with',identifier);
    mainMenu();
}

const directReports = () => {
    console.log('called directReports');
    mainMenu();
}

const reportsTo = () => {
    console.log('called reportsTo');
    mainMenu();
}

const exit = () => {
    console.log('Good bye');
    connection.end();
}
