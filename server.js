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
                'View/Add Departments',
                'View/Add Roles',
                'View/Add Employees',
                'Exit',
            ],
            default: ['Exit']
        }
    ]).then((response) => {
        switch (response.option) {
            case 'View/Add Departments':
                departmentMenu();
            break;
            case 'View/Add Roles':
                roleMenu();
            break
            case 'View/Add Employees':
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
        connection.query(`SELECT * FROM role`, (err, roles) => {
            if (err) throw err;

                const roleChoices = roles.map((role) => role.title);
                roleChoices.push('Create new');console.log('roleChoices',roleChoices);
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
                    }
                ]).then((response) => {
                    if (response.role === 'Create new') {
                        addNew('role');
                    }
                    let roleId;
                    roles.forEach(role => {
                        if (role.title === response.role) {
                            roleId = role.id;
                        }
                    });console.log('-------',identifier,roleId);
                    connection.query(`INSERT INTO ${identifier} SET ?`,
                    {
                        first_name: response.first_name,
                        last_name: response.last_name,
                        role_id: roleId,
                    },
                    (err) => {
                        if (err) throw err;
                        console.log(`\nSucessfully added ${identifier} ${response.first_name} ${response.last_name}\n`);
                        viewAll(identifier);
                    });
                });

        });
    }
}

const exit = () => {
    console.log('Good bye');
    connection.end();
}
