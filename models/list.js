const mongoose = require('mongoose')

const listSchema = new mongoose.Schema({
	userEmail: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	itemIds: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Item',
		},
	],
})

listSchema.statics.deleteById = async function (id) {
	try {
		const result = await this.findByIdAndDelete(id)
		if (!result) {
			throw new Error('Список не найден.')
		}
		return result
	} catch (error) {
		// Обработка ошибки, если что-то пойдет не так
		throw error
	}
}

const List = mongoose.model('List', listSchema)

module.exports = List
