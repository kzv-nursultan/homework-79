const express = require('express');
const multer = require('multer');
const path = require('path');
const config = require('../config');
const { nanoid } = require('nanoid');
const mysqlDb = require('../mysqlDb');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, config.uploadPath);
    },
    filename:(req,file,cb)=>{
        cb(null,nanoid()+path.extname(file.originalname));
    }
});


const upload = multer({storage});

const router = express.Router();

router.get('/', async (req,res)=>{
    const [items] = await mysqlDb.getConnection().query('SELECT * FROM items');
    res.send(items);
});

router.get('/:id',async (req,res)=>{
    const [data] = await mysqlDb.getConnection().query('SELECT * FROM items WHERE id=?', [req.params.id])
    res.send(data[0]);
});

router.post('/', upload.single('item_photo'), async (req,res)=>{
  const item = req.body;
  if(!item.item_name || !item.category_id || !item.places_id) {
      res.status(400).send('Check your inputs');
  } else if (item.item_name && item.category_id && item.places_id) {
      if(item.item_photo){
          item.item_photo = req.file.filename;
      };

      await mysqlDb.getConnection().query(
          'INSERT INTO items (category_id, places_id, item_name, item_description, item_photo) VALUES(?,?,?,?,?)',
          [item.category_id,item.places_id, item.item_name, item.item_description, item.item_photo]);
      res.send(item);
  }
});

router.put('/:id',async (req,res)=>{
    const item = req.body;
    if(!item.item_name || !item.category_id || !item.places_id) {
        res.status(400).send('Check your inputs');
    } else if (item.item_name && item.category_id && item.places_id) {
  
        if(item.item_photo){
            item.item_photo = req.file.filename;
        };
  
        await mysqlDb.getConnection().query(
            'UPDATE items SET category_id=?, places_id=?, item_name=?, item_description=?, item_photo=? WHERE id=?',
            [item.category_id, item.places_id, item.item_name, item.item_description, item.item_image, req.params.id]);
        res.send(item);
    }
});

router.delete('/:id',async (req, res)=>{
    await mysqlDb.getConnection().query(
        'DELETE FROM items WHERE id=?',[req.params.id]);
    res.send('deleted');
});

module.exports = router;