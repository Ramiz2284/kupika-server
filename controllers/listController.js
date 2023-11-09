const List = require('../models/list')

exports.listSave = async (req, res) => {
	console.log(req.body.itemIds)
	console.log(req.body.name)
	console.log(req.body.userEmail)
	try {
		const list = new List({
			userEmail: req.body.userEmail,
			name: req.body.name,
			itemIds: req.body.itemIds,
		})

		await list.save()
		res.status(201).json(list)
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
}

exports.getListsByEmail = async (req, res) => {
	try {
		const lists = await List.find({ userEmail: req.params.email }) // Находим все списки, где userEmail совпадает с параметром
		if (lists.length === 0) {
			return res.status(404).json({ message: 'Списки не найдены' })
		}
		res.json(lists)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

exports.getListById = async (req, res) => {
	console.log(req.params.id)
	try {
		const list = await List.findById(req.params.id).populate('itemIds')
		if (!list) {
			return res.status(404).json({ message: 'Список не найден' })
		}
		res.json(list)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

exports.deleteListById = async (req, res) => {
	try {
		const listId = req.params.id

		await List.deleteById(listId)
		res.status(200).send({ message: 'Список успешно удален' })
	} catch (error) {
		res.status(500).send({ message: 'Ошибка при удалении списка' })
	}
}
