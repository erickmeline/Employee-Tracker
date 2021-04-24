const mysql = require('mysql');
const inquirer = require('inquirer');
const badge = require('badge.js');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'orgDB'
});

connection.connect((err) => {
    console.log('connected');
    // do something
    // connection.end();
});

const mainMenu = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: '==-- Main Menu --==',
            name: 'option',
            choices: [
                'View/Modify Departments',
                'View/Modify Roles',
                'View/Modify Employees'
            ]
        }
    ])
}

const departmentMenu = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: '==-- Departments Menu --==',
            name: 'option',
            choices: [
                'View All Departments',
                'Add New Department',
                'Modify Department',
                'Delete Department'
            ]
        }
    ])
}

const roleMenu = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: '==-- Roles Menu --==',
            name: 'option',
            choices: [
                'View All Roles',
                'Add New Role',
                'Modify Role',
                'Delete Role'
            ]
        }
    ])
}

const employeeMenu = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: '==-- Employee Menu --==',
            name: 'option',
            choices: [
                'View All Employees',
                'Add New Employee',
                'Modify Employee',
                'Delete Employee'
            ]
        }
    ])
}
