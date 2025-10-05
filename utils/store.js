
const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, 'users.json');
const IDOJARAS_FILE = path.join(__dirname, 'idojaras.json');


let users = [];
let idojaras = [];

// Users functions
function loadUsers() {
    try {
        if (fs.existsSync(USERS_FILE)) {
            const raw = fs.readFileSync(USERS_FILE, 'utf-8');

            users = raw && raw.trim() !== '' ? JSON.parse(raw) : [];

        } else {
          users = [];
            saveUsers();
        }
    } catch (err) {
       users = [];
    }
}

function saveUsers() {
    try {
        if (!Array.isArray(users)) {
            users = [];
        }
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (err) {
  }
}

function IsEmailExists(email) {
    return users.some(user => user.email === email);
}

function loadIdojaras() {
    try {
        if (fs.existsSync(IDOJARAS_FILE)) {
            const raw = fs.readFileSync(IDOJARAS_FILE, 'utf-8');
            idojaras = raw && raw.trim() !== '' ? JSON.parse(raw) : [];
      } else {
        idojaras = [];
            saveIdojaras();
        }
    } catch (err) {
      idojaras = [];
    }
}

function saveIdojaras() {
    try {
        if (!Array.isArray(idojaras)) {
            idojaras = [];
        }
        fs.writeFileSync(IDOJARAS_FILE, JSON.stringify(idojaras, null, 2));
    } catch (err) {
   }
}

function getNextID(table) {
    if (!Array.isArray(table) || table.length === 0) {
        return 1;
    }
    
    let maxId = 0;
    for (let i = 0; i < table.length; i++) {
        if (table[i].id > maxId) {
            maxId = table[i].id;
        }
    }
    return maxId + 1;
}


loadUsers();
loadIdojaras();

module.exports = {
    users,
    idojaras,
    saveUsers,
    saveIdojaras,
    getNextID,
    IsEmailExists
};