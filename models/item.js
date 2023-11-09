const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
	name: String,
	quantity: Number,
	price: Number,
	photo: String,
	userEmail: String,
	// ... другие поля, если необходимо
})

const Item = mongoose.model('Item', itemSchema)

module.exports = Item
