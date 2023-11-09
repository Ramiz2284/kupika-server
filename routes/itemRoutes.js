// routes/itemRoutes.js
const express = require('express')
const router = express.Router()
const itemController = require('../controllers/itemController')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

router.post('/newitem', upload.single('photo'), itemController.createItem)

router.delete('/:id', itemController.deleteItem)
module.exports = router
