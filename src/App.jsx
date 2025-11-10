import { useEffect } from 'react'
import { createChat } from '@n8n/chat'
import '@n8n/chat/style.css'
import './style.css'
import './App.css'

const withBase = (path) => {
  const base = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? ''
  const trimmedPath = path.replace(/^\//, '')
  return `${base}/${trimmedPath}`
}

const LOGO_SRC = withBase('/icons/qsai.jpg')
const WEBHOOK_URL =
  'https://jacobmccartney.app.n8n.cloud/webhook/4d3361b5-ff77-43f2-8337-b302988d2a7b/chat'
const TITLE_SRC = withBase('/icons/title.png')

function App() {
  useEffect(() => {
    const chatApp = createChat({
      webhookUrl: WEBHOOK_URL,
      target: '#n8n-chat',
      mode: 'fullscreen',
      loadPreviousSession: true,
      initialMessages: [
        "Hello, I'm QSAI, your Quran study companion. How can I help you today?"
      ],
      i18n: {
		en: {
			title: '',
			subtitle: "",
			footer: 'QuranScholarAI',
			getStarted: '',
			inputPlaceholder: 'Ask me anything about the Quran...',
		},
	},
    })

    return () => {
      chatApp?.unmount?.()
      document.querySelector('#n8n-chat')?.replaceChildren()
    }
  }, [])

  return (
    <>
      <img src={LOGO_SRC} alt="QS-AI emblem" className="brand-mark" />
      <main className="layout">
        <header className="masthead">
          <img src={TITLE_SRC} alt="QS-AI wordmark" className="masthead__title" />
        </header>
        <section className="chat-card" aria-label="QS-AI chat window">
          <div id="n8n-chat" className="chat-container" />
        </section>
      </main>
    </>
  )
}

export default App
