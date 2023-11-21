const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs').promises // Используйте fs.promises для асинхронных операций

// Настройка хранилища на диске
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// Укажите путь к папке, где будут храниться загруженные файлы
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		// Создание уникального имени файла
		const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]+/g, '-')
		const filename = Date.now() + '-' + cleanName
		cb(null, filename)
	},
})

const upload = multer({ storage: storage })

const uploadRoute = async (req, res) => {
	try {
		// Загрузка и обработка файла
		const filepath = path.join('uploads/', req.file.filename) // Получаем путь к загруженному файлу

		// Преобразование изображения с помощью sharp и сохранение его на диск
		const buffer = await sharp(filepath)
			.toFormat('jpeg')
			.jpeg({ quality: 60 })
			.toBuffer()

		await fs.writeFile(filepath, buffer) // Асинхронное сохранение обработанного файла

		res.json({ photoUrl: `/uploads/${req.file.filename}` })
	} catch (error) {
		console.error('Error processing image', error)
		res.status(500).json({ message: 'Error processing image', error })
	}
}

module.exports = {
	upload,
	uploadRoute,
}
