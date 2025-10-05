const express = require('express');
const router = express.Router();
const store = require('../utils/store');

// GET all users
router.get('/', (req, res) => {
    try {
        res.json(store.users);
    } catch (error) {

        res.status(500).json({ msg: 'Szerver hiba' });
    }
});

// POST new user
router.post('/', (req, res) => {
    try {

        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {

            return res.status(400).json({ msg: 'Minden mező kitöltése kötelező!' });
        }
        
        if (store.IsEmailExists(email)) {
            return res.status(400).json({ msg: 'Ez az email cím már regisztálva!' });
        }
        
        // Új user létrehozása
        const newUser = {
            id: store.getNextID(store.users),
            name: name,
            email: email,
            password: password
        };
        
        store.users.push(newUser);
        store.saveUsers();
        
        res.status(200).json({ msg: 'Sikeres regisztráció!' });
        
    } catch (error) {
        res.status(500).json({ msg: 'Szerver hiba a regisztráció során' });
    }
});

// POST login
router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = store.users.find(u => u.email === email && u.password === password);
        
        if (user) {

            const { password, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);
        } else {
            res.status(401).json({ msg: 'Hibás email vagy jelszó' });
        }
    } catch (error) {

        res.status(500).json({ msg: 'Szerver hiba' });
    }
});
router.patch('/profile', (req, res) => {
    try {
        const { id, name, email } = req.body;
        console.log('PATCH /profile - body:', req.body);

        if (!id || !name || !email) {
            return res.status(400).json({ msg: 'Minden mező kitöltése kötelező!' });
        }

        const userIndex = store.users.findIndex(user => user.id == id);
        
        if (userIndex === -1) {
            return res.status(404).json({ msg: 'Felhasználó nem található!' });
        }


        if (email !== store.users[userIndex].email) {
            if (store.IsEmailExists(email)) {
                return res.status(400).json({ msg: 'Ez az email cím már foglalt!' });
            }
        }

        store.users[userIndex].name = name;
        store.users[userIndex].email = email;
        store.saveUsers();

        console.log('Profil frissítve:', store.users[userIndex]);
        res.status(200).json({ 
            msg: 'Profil sikeresen frissítve!',
            newName: name,
            newEmail: email
        });

    } catch (error) {
        console.error('PATCH /profile error:', error);
        res.status(500).json({ msg: 'Szerver hiba a profil frissítése során' });
    }
});
router.patch('/password', (req, res) => {
    try {
        const { id, currentPass, newPass } = req.body;
        console.log('PATCH /password - body:', { id, currentPass: '***', newPass: '***' });

        if (!id || !currentPass || !newPass) {
            return res.status(400).json({ msg: 'Minden mező kitöltése kötelező!' });
        }

        const userIndex = store.users.findIndex(user => user.id == id);
        
        if (userIndex === -1) {
            return res.status(404).json({ msg: 'Felhasználó nem található!' });
        }


        if (store.users[userIndex].password !== currentPass) {
            return res.status(400).json({ msg: 'Hibás jelenlegi jelszó!' });
        }


        if (currentPass === newPass) {
            return res.status(400).json({ msg: 'Az új jelszó nem egyezhet a régivel!' });
        }


        const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwdRegExp.test(newPass)) {
            return res.status(400).json({ 
                msg: 'Az új jelszó nem elég biztonságos! Minimum 8 karakter, kis- és nagybetű és szám kell.' 
            });
        }


        store.users[userIndex].password = newPass;
        store.saveUsers();

        console.log('Jelszó megváltoztatva user ID:', id);
        res.status(200).json({ msg: 'Jelszó sikeresen megváltoztatva!' });

    } catch (error) {
        console.error('PATCH /password error:', error);
        res.status(500).json({ msg: 'Szerver hiba a jelszó változtatása során' });
    }
});
// GET user by id
router.get('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = store.users.find(u => u.id === id);
        
        if (user) {
            const { password, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);
        } else {
            res.status(404).json({ msg: 'Felhasználó nem található' });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Szerver hiba' });
    }
});

module.exports = router;