const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const userRoutes = require('./routes/userRoutes')
const itemRoutes = require('./routes/itemRoutes')
const listRoutes = require('./routes/listRoutes')
const { upload, uploadRoute } = require('./controllers/uploadController')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors())
app.use(helmet())
app.use(express.json()) // для парсинга JSON
app.use(morgan('dev'))

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
})

// apply to all requests
app.use(limiter)

// Подключаем маршруты
app.use('/api/users', userRoutes)
app.use('/api/item', itemRoutes)
app.use('/api/list', listRoutes)
// Маршрут для загрузки изображения товара, используя функцию из uploadController
app.post('/api/items/upload', upload.single('photo'), uploadRoute)

// Предоставление статического доступа к папке 'uploads'
app.use(
	'/uploads',
	express.static('uploads', {
		setHeaders: function (res, path, stat) {
			// Устанавливаем заголовки CORS
			res.set('Access-Control-Allow-Origin', '*')
			// Добавляем заголовки для разрешения кросс-доменных запросов
			res.set('Cross-Origin-Resource-Policy', 'cross-origin')
			res.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
		},
	})
)

// Обработка несуществующих маршрутов
app.use((req, res, next) => {
	res.status(404).send('We think you are lost!')
})

// Подключение к MongoDB
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('Successfully connected to MongoDB'))
	.catch(err => console.error('Connection error', err))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
