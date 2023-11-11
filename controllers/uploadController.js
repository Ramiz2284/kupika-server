const multer = require('multer')
const { S3Client } = require('@aws-sdk/client-s3')
const multerS3 = require('multer-s3')
require('dotenv').config()

// Конфигурация AWS SDK с вашими учетными данными
const s3Client = new S3Client({
	region: process.env.REGION,
	credentials: {
		accessKeyId: process.env.YOUR_ACCESS_KEY_ID,
		secretAccessKey: process.env.YOUR_SECRET_ACCESS_KEY,
	},
})

// Настройка хранения multer для использования S3
const storage = multerS3({
	s3: s3Client,
	bucket: process.env.NAME_OF_YOUR_BUCKET,
	metadata: function (req, file, cb) {
		cb(null, { fieldName: file.fieldname })
	},
	key: function (req, file, cb) {
		const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]+/g, '-')
		cb(null, Date.now() + '-' + cleanName)
	},
})

const upload = multer({ storage: storage })

// Маршрут для загрузки изображения товара
// Обновите это, чтобы возвращать URL фотографии из S3
const uploadRoute = (req, res) => {
	// Этот URL должен быть публичной ссылкой на объект в вашем S3 bucket
	res.json({
		photoUrl: `https://${process.env.NAME_OF_YOUR_BUCKET}.s3.amazonaws.com/${req.file.key}`,
	})
}

module.exports = {
	upload,
	uploadRoute,
}
