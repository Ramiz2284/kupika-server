const Item = require('../models/item')
const path = require('path')
const fs = require('fs')

const itemController = {
	// Добавление нового товара
	createItem: async (req, res) => {
		try {
			// Создаем новый экземпляр товара
			const newItem = new Item({
				name: req.body.name,
				quantity: req.body.quantity,
				price: req.body.price,
				photo: req.body.photo,
				userEmail: req.body.userEmail,
			})

			// Сохраняем товар в базу данных
			const savedItem = await newItem.save()

			// Отправляем ответ с созданным товаром
			res.status(201).json(savedItem)
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	},

	// Получение списка всех товаров
	getAllItems: async (req, res) => {
		try {
			const items = await Item.find({})
			res.status(200).json(items)
		} catch (error) {
			res.status(500).json({ message: error.message })
		}
	},

	// Получение одного товара по id
	getItemsByIds: async (req, res) => {
		try {
			const itemIds = req.query.ids.split(',')
			const items = await Item.find({ _id: { $in: itemIds } })
			res.status(200).json(items)
		} catch (error) {
			res.status(500).json({ message: error.message })
		}
	},

	// Обновление товара по id
	updateItem: async (req, res) => {
		try {
			const itemId = req.params.id
			const item = await Item.findById(itemId)
			if (!item) return res.status(404).json({ message: 'Item not found' })

			// Путь к файлу изображения
			const imagePath = path.join(__dirname, '..', item.photo)
			console.log(imagePath)

			// Удаляем файл изображения, если он существует
			if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath)
			}

			const updateData = req.body

			// Обновление элемента в базе данных
			const updatedItem = await Item.findByIdAndUpdate(itemId, updateData, {
				new: true,
			})

			if (!updatedItem) {
				return res.status(404).send({ message: 'Item not found' })
			}

			res.send(updatedItem)
		} catch (error) {
			res.status(500).send({ message: 'Error updating item' })
		}
	},

	// Удаление товара по id
	deleteItem: async (req, res) => {
		try {
			const item = await Item.findById(req.params.id)

			if (!item) return res.status(404).json({ message: 'Item not found' })

			// Путь к файлу изображения
			const imagePath = path.join(__dirname, '..', item.photo)

			// Удаляем файл изображения, если он существует
			if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath)
			}

			// Теперь удаляем сам товар из базы данных
			await Item.findByIdAndDelete(req.params.id)

			res.status(200).json({ message: 'Item deleted successfully' })
		} catch (error) {
			console.error('Error in deleteItem:', error)
			res.status(500).json({ message: error.message })
		}
	},
}

module.exports = itemController
