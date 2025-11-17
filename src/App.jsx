import { useEffect, useState } from 'react'
import { createChat } from '@n8n/chat'
import '@n8n/chat/style.css'
import './style.css'
import './App.css'

const withBase = (path) => {
  const base = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? ''
  const trimmedPath = path.replace(/^\//, '')
  return `${base}/${trimmedPath}`
}

const SIDEBAR_OPEN_ICON = withBase('/icons/open.png')
const SIDEBAR_CLOSED_ICON = withBase('/icons/close.png')
const LOGO_ICON = withBase('/dist/icons/logo.png')
const WEBHOOK_URL =
  'https://jacobmccartney.app.n8n.cloud/webhook/377c928a-7c9a-47bd-a6bf-f6a2e64afbd4/chat'
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)
  const handleStart = () => setHasStarted(true)

  useEffect(() => {
    if (!hasStarted) {
      return undefined
    }

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
          subtitle: '',
          footer: 'QuranScholarAI',
          getStarted: '',
          inputPlaceholder: 'Ask me anything...'
        }
      }
    })

    return () => {
      chatApp?.unmount?.()
      document.querySelector('#n8n-chat')?.replaceChildren()
    }
  }, [hasStarted])

  const topPane = (
    <section className="top-pane">
      <div className="top-pane__brand">
        <img src={LOGO_ICON} alt="" className="top-pane__logo" aria-hidden="true" />
        <div className="top-pane__copy">
          <h1 className="top-pane__title top-pane__title-highlight">QuranScholarAI</h1>
          <p className="top-pane__subtitle">Your Quran Study Companion</p>
        </div>
      </div>
    </section>
  )

  if (!hasStarted) {
    return (
      <>
        {topPane}
        <main className="start-layout">
          <section className="start-screen">
            <div className="start-screen__content">
              <p className="start-screen__eyebrow">What can I do?</p>
              <h2>Explore the Quran with guided insights.</h2>
              <p className="start-screen__lede">
                Get verse explanations, tafsir cross-references, and journaling prompts tailored to your goals.
              </p>
              <ul className="start-screen__features">
                <li>
                  <strong>Classical Tafsir:</strong> Al-Qurtubi, Al-Tabari, Ibn Kathir, and As-Sa'di
                </li>
                <li>
                  <strong>Prompt recommendations:</strong> Kickstart reflection with simple study suggestions.
                </li>
                <li>
                  <strong>Practical guidance:</strong> Ask life questions and receive Quran-centric direction.
                </li>
              </ul>
              <button type="button" className="start-screen__cta" onClick={handleStart}>
                Start Chatting
              </button>
            </div>
          </section>
        </main>
      </>
    )
  }

  return (
    <>
      {topPane}
      <button
        type="button"
        className={`brand-mark${isSidebarOpen ? ' brand-mark--open' : ''}`}
        onClick={toggleSidebar}
        aria-pressed={isSidebarOpen}
        aria-expanded={isSidebarOpen}
        aria-label="Toggle prompt recommendations panel"
      >
        <img
          src={isSidebarOpen ? SIDEBAR_CLOSED_ICON : SIDEBAR_OPEN_ICON}
          alt={isSidebarOpen ? 'Hide prompt recommendations' : 'Show prompt recommendations'}
        />
      </button>
      <main className={`layout ${isSidebarOpen ? 'layout--sidebar-open' : ''}`}>
        <aside
          className={`feature-pane ${isSidebarOpen ? 'feature-pane--open' : ''}`}
          aria-label="Prompt recommendations"
        >
          <div className="feature-pane__header">
            <p className="feature-pane__eyebrow">Prompt recommendations</p>
            <h2>Boost your study session</h2>
            <p className="feature-pane__subheading">Ask for verses:</p>
          </div>
          <ul className="feature-pane__list">
            <li>Show me 11:2 in Arabic.</li>
            <li>Show me 2:1-10 and summarize the key ideas.</li>
          </ul>
          <p className="feature-pane__subheading">Ask for Tafsir:</p>
          <ul className="feature-pane__list">
            <li>Show me Ibn Kathir Tafsir for 2:16.</li>
            <li>Give me the key points of Tafsir Al-Qurtubi of 3:12-15.</li>
          </ul>
          <p className="feature-pane__subheading">Ask the Quran:</p>
          <ul className="feature-pane__list">
            <li>How do I become a Muslim?</li>
            <li>How do I pray?</li>
            <li>Who is the Prophet Muhammed?</li>
            <li>What can I eat and drink as a Muslim?</li>
          </ul>
           <p className="feature-pane__subheading">Study Questions:</p>
           <ul className="feature-pane__list">
            <li>What are some reflection questions for 24:35?</li>
            <li>Summarize 4:10-20 and give me the common themes.</li>
            <li>Compare Tafsir Ibn Kathir and Al-Qurtubi on 5:12.</li>
          </ul>
            <p className = "feature-pane__subheading"><br/></p>
        </aside>

        <div className="primary-column">
          <section className="chat-card" aria-label="QS-AI chat window">
            <div id="n8n-chat" className="chat-container" />
          </section>
          <section className="bottom-pane" aria-label="Additional QS-AI tools">
            <div className="bottom-pane__content">
              <p>Future tools and insights will live here. Stay tuned for additional features.</p>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default App
