const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Путь к папке 'uploads'
const uploadsDir = path.join(__dirname, 'uploads')

// Проверяем, существует ли директория
if (!fs.existsSync(uploadsDir)) {
	// Если директории не существует, создаем ее
	fs.mkdirSync(uploadsDir, { recursive: true })
}

// Настройка хранения для Multer
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/') // Указываем папку для сохранения изображений
	},
	filename: function (req, file, cb) {
		// Очищаем имя файла от нежелательных символов
		const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]+/g, '-')
		// Генерируем уникальное имя файла
		cb(null, Date.now() + '-' + cleanName)
	},
})

const upload = multer({ storage: storage })

// Маршрут для загрузки изображения товара
const uploadRoute = (req, res) => {
	res.json({ photoUrl: `/uploads/${req.file.filename}` })
}

module.exports = {
	upload,
	uploadRoute,
}
