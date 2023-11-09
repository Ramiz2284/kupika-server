const bcrypt = require('bcryptjs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

exports.registerNewUser = async (req, res) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 8)

		// Создание нового пользователя
		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		})

		// Сохранение пользователя в базе данных
		const savedUser = await newUser.save()

		// Возвращаем данные пользователя, исключая пароль
		const userToReturn = {
			_id: savedUser._id,
			username: savedUser.username,
			email: savedUser.email,
			// можно добавить другие поля, которые безопасно возвращать
		}

		res.status(201).json({
			message: 'User created',
			user: userToReturn,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Error registering new user' })
	}
}

exports.loginUser = async (req, res) => {
	try {
		// Найти пользователя по email
		const user = await User.findOne({ email: req.body.email })
		if (!user) {
			return res.status(401).json({ message: 'Auth failed' })
		}

		// Сравнить предоставленные пароли
		const match = await bcrypt.compare(req.body.password, user.password)
		if (!match) {
			return res.status(401).json({ message: 'Auth failed' })
		}

		// Генерировать JWT токен
		const token = jwt.sign(
			{ userId: user._id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		)

		// Вернуть токен и данные пользователя
		res.status(200).json({
			message: 'Auth successful',
			token: token,
			user: {
				_id: user._id,
				username: user.username,
				email: user.email,
			},
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Server error' })
	}
}
