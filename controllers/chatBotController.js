require('dotenv').config()

const OpenAI = require('openai')

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

exports.question = async (req, res) => {
	try {
		const chatCompletion = await openai.chat.completions.create({
			messages: [{ role: 'user', content: req.body.message }],
			model: 'gpt-3.5-turbo', // Выберите нужную модель
		})

		// Отправьте ответ пользователю
		res.json({ reply: chatCompletion.choices[0].message.content.trim() })
	} catch (error) {
		console.error('Error:', error)
		res.status(500).send('Internal Server Error')
	}
}
