const express = require('express')
const router = express.Router()

const { users, idojaras, getNextID, saveIdojaras } = require('../utils/store');

// GET Összes időjárás 
    router.get('/', (_req, res) => {
    res.send(idojaras);
});

// GET Összes időjárás id alapján
router.get('/users/:uid', (req, res)=> {
    let userId = req.params.uid;
    let idx = users.findIndex(user => user.id == userId);

    if (idx == -1){
        res.status(400).send({msg: 'Nincs ilyen felhasználó!'});
        return
    }

    res.send(idojaras.filter(idojaras => idojaras.userId == userId));
});

// GET egy adott időjárás id alapján
router.get('/:id', (req, res) => {
    let id = req.params.id;

    let idx = idojaras.findIndex(idojaras => idojaras.id == id);

    if (idx == -1){
        res.status(400).send({msg: 'Nincs ilyen időjárás adat!'});
        return
    }

    res.send(idojaras[idx]);
});

// POST új időjárás
router.post('/', (req, res) => {
    let data = req.body;
    data.id = getNextID(idojaras);
    idojaras.push(data);
    saveIdojaras(idojaras);
    res.status(200).send({msg: 'Az időjárás adat felvéve!'});
    
});

// PATCH időjárás id alapján
router.patch('/:id', (req, res)=>{
    let id = req.params.id;
    let data = req.body;

    let idx = idojaras.findIndex(idojaras => idojaras.id == id);

    if (idx > -1) {
        idojaras[idx] = data;
        idojaras[idx].id = Number(id);
        saveIdojaras(idojaras);
        return res.send({msg: 'Az időjárás adat sikeresen módosítva'});
    }
    return res.status(400).send({msg:'Nincs ilyen időjárás adat!'});
});

// DELETE időjárás id alapján
router.delete('/:id', (req, res)=>{
    let id = req.params.id;
    let idx = idojaras.findIndex(idojaras => idojaras.id == id);

    if (idx == -1){
        res.status(400).send({msg: 'Nincs ilyen időjárás adat!'});
        return
    }

    idojaras.splice(idx, 1);
    saveIdojaras(idojaras);
    res.send({msg: 'Időjárás adat sikeresen törölve!'});
 });

 // DELETE összes időjárás id alapján
router.delete('/users/:uid', (req, res)=>{
    let userId = req.params.uid;
    let idx = users.findIndex(user => user.id == userId);

    if (idx == -1){
        res.status(400).send({msg: 'Nincs ilyen felhasználó!'});
        return
    }
    
    idojaras = idojaras.filter( idojaras => idojaras.userId != userId);
    saveIdojaras(idojaras);
    res.send({msg: 'Időjárás adat sikeresen törölve!'});
 });

 // DELETE összes felhasználó időjárásának tőrlése
router.delete('/', (_req, res)=>{
    idojaras = [];
    saveIdojaras(idojaras);
    res.send({msg: 'Az összes időjárás adat sikeresen törölve!'});
}); 


module.exports = router;