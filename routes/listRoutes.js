const express = require('express')
const router = express.Router()
const listController = require('../controllers/listController')
const itemController = require('../controllers/itemController')

// Регистрация нового пользователя
router.post('/listsave', listController.listSave)

// Получение товаров по массиву ID
router.get('/items', itemController.getItemsByIds)

// Получение списков по email
router.get('/:email', listController.getListsByEmail)
// Получение списков по id
router.get('/id/:id', listController.getListById)

// Удаление списка по ID
router.delete('/:id', listController.deleteListById)

router.put('/update/:id', listController.updateList)

module.exports = router
