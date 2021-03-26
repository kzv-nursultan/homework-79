const express = require('express');
const mysqlDb = require('../mysqlDb');

const router = express.Router();


router.get('/:id',async (req,res)=>{
    const [category] = await mysqlDb.getConnection()
    .query('SELECT * FROM categories WHERE id=?',[req.params.id]);
    res.send(category[0]);
});

router.get('/', async (req,res)=>{
    const [categories] = await mysqlDb.getConnection().query('SELECT * FROM categories');
    res.send(categories);
});

router.post('/',async (req,res)=>{
    const item = req.body;
    item.category = 'categories';
    if(!item.name){
        res.status(400).send('something went wrong! Check your keys!');
    } else {
        const [result] = await mysqlDb.getConnection().query(
            'INSERT INTO categories (name, description) VALUES (?,?)',
            [item.name, item.description]);
        res.send({...item, id:result.insertId});
    };
});

router.put('/:id',async (req,res)=>{
    const item = req.body;
    if(!item.name){
        res.status(400).send('something went wrong! Check your keys!');
    } else if (item.name && item.description) {
        const [newData] = await mysqlDb.getConnection().query(
            'UPDATE categories SET name = ?, description = ? WHERE id = ?',
            [item.name, item.description, req.params.id,]);
        res.send(newData.info);
    };
});

router.delete('/:id',async (req, res)=>{
    res.send('Deleting from this table was restricted.');
});

module.exports = router;