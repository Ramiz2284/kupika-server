const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const storage = multer.memoryStorage() // Измените хранение на memoryStorage

const upload = multer({ storage: storage })

const uploadRoute = async (req, res) => {
	try {
		// Доступ к файлу через req.file.buffer
		const buffer = await sharp(req.file.buffer)
			.toFormat('jpeg') // Конвертировать в jpeg
			.jpeg({ quality: 60 }) // Установите качество сжатого изображения
			.toBuffer()

		// Сохранение обработанного изображения на диск
		const cleanName = req.file.originalname.replace(/[^a-zA-Z0-9.]+/g, '-')
		const filename = Date.now() + '-' + cleanName
		const filepath = path.join('uploads/', filename)
		fs.writeFileSync(filepath, buffer)

		res.json({ photoUrl: `/uploads/${filename}` })
	} catch (error) {
		res.status(500).json({ message: 'Error processing image', error })
	}
}

module.exports = {
	upload,
	uploadRoute,
}
