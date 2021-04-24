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
            message: '===========[ Main Menu ]==========',
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
            message: '=======[ Departments Menu ]=======',
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
            message: '==========[ Roles Menu ]==========',
            name: 'option',
            choices: [
                'View All Roles',
                'Add New Role',
                'Modify/Delete Role',
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
            default:
                mainMenu();
        }
    })
}

const employeeMenu = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: '=========[ Employee Menu ]========',
            name: 'option',
            choices: [
                'View All Employees',
                'Add New Employee',
                'Modify Employee',
                'Delete Employee',
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
            default:
                mainMenu();
        }
    })
}

const viewAll = (identifier) => {
    console.log('called viewAll with',identifier);
    mainMenu();
}

const addNew = (identifier) => {
    console.log('called addNew with',identifier);
    mainMenu();
}

const modDel = (identifier) => {
    console.log('called modDel with',identifier);
    mainMenu();
}

const exit = () => {
    console.log('Good bye');
    connection.end();
}
