require('dotenv').config()
const { OpenAI } = require('openai')

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

const assistantId = process.env.YOUR_ASSISTANT_ID // ID ассистента

exports.question = async (req, res) => {
	try {
		const question = req.body.message // Убедитесь, что вопрос передается в теле запроса

		// Создание потока (thread)
		const thread = await openai.beta.threads.create()

		// Добавление сообщения в поток
		await openai.beta.threads.messages.create(thread.id, {
			role: 'user',
			content: question,
		})

		// Запуск ассистента
		const run = await openai.beta.threads.runs.create(thread.id, {
			assistant_id: assistantId, // Использование существующего ID ассистента
		})

		// Ожидание завершения выполнения ассистента
		let runStatus
		do {
			const runStatusResponse = await openai.beta.threads.runs.retrieve(
				thread.id,
				run.id
			)
			runStatus = runStatusResponse.status
			await new Promise(resolve => setTimeout(resolve, 1000)) // Пауза в 1 секунду
		} while (runStatus === 'in_progress')

		// Получение ответов ассистента
		const messages = await openai.beta.threads.messages.list(thread.id)

		// Формирование массива ответов ассистента
		const assistantReplies = messages.data
			.filter(msg => msg.role === 'assistant')
			.map(msg => msg.content.map(c => (c.text ? c.text.value : '')).join(''))
		// Отправка ответов пользователю
		res.json({ replies: assistantReplies })
	} catch (error) {
		console.error('Error:', error)
		res.status(500).send('Internal Server Error')
	}
}
