import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

createChat({
	webhookUrl: 'https://jacobmccartney.app.n8n.cloud/webhook/4091fa09-fb9a-4039-9411-7104d213f601/chat',
	webhookConfig: {
		method: 'POST',
		headers: {}
	},
	target: '#n8n-chat',
	mode: 'fullscreen',
	chatInputKey: 'chatInput',
	chatSessionKey: 'sessionId',
	loadPreviousSession: true,
	metadata: {},
	showWelcomeScreen: false,
	defaultLanguage: 'en',
	initialMessages: [
		'Hello, I\'m QSAI, your Quran study assistant. How can I help you today?'
	],
	i18n: {
		en: {
			title: 'QS-AI',
			subtitle: "Your Quran Study Assistant",
			footer: '',
			getStarted: 'New Conversation',
			inputPlaceholder: 'Type your question..',
		},
	},
	enableStreaming: true,
});