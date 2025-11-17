import { useEffect, useRef, useState } from 'react'
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
const LOGO_ICON = withBase('/icons/logo.png')
const READ_ICON = withBase('/icons/read.png')
const WEBHOOK_URL =
  'https://jacobmccartney.app.n8n.cloud/webhook/5757617c-121a-441d-ac4f-496fc058e763/chat'
const NAV_PAGES = {
  welcome: 'welcome',
  chat: 'chat',
}
const ADSENSE_CLIENT = 'ca-pub-1032939231392861'
const ADSENSE_SLOT = '1032939231392861'

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
    <path
      d="M3.25 11.27 11.05 4a1.27 1.27 0 0 1 1.9 0l7.8 7.27"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.25 11.75v7.5a.75.75 0 0 1-.75.75h-3.5v-4.75H10v4.75H6.5a.75.75 0 0 1-.75-.75v-7.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
    <path
      d="M5 6.5h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4.5l-4.25 3.2a.5.5 0 0 1-.8-.4V16.5H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="11.5" r="0.9" fill="currentColor" />
    <circle cx="12.5" cy="11.5" r="0.9" fill="currentColor" />
    <circle cx="16" cy="11.5" r="0.9" fill="currentColor" />
  </svg>
)

const AdSenseSlot = () => {
  const adRef = useRef(null)

  useEffect(() => {
    if (!adRef.current) {
      return
    }

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (error) {
      // Gracefully ignore AdSense errors to avoid breaking the UI
      // eslint-disable-next-line no-console
      console.error('AdSense error', error)
    }
  }, [])

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: 'block', width: '100%', minHeight: '250px' }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={ADSENSE_SLOT}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activePage, setActivePage] = useState(NAV_PAGES.welcome)

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)
  const isChatPage = activePage === NAV_PAGES.chat
  const navItems = [
    { id: NAV_PAGES.welcome, label: 'Welcome', Icon: HomeIcon },
    { id: NAV_PAGES.chat, label: 'Chat', Icon: ChatIcon },
  ]

  useEffect(() => {
    if (!isChatPage) {
      return undefined
    }

    const chatApp = createChat({
      webhookUrl: WEBHOOK_URL,
      target: '#n8n-chat',
      mode: 'fullscreen',
      loadPreviousSession: true,
      showWelcomeScreen: false,
      initialMessages: [
        "Hello, I'm QSAI, your Quran study companion. How can I help you today?"
      ],
      i18n: {
        en: {
          title: '',
          subtitle: '',
          footer: 'Just a second...',
          getStarted: 'Start Chat',
          inputPlaceholder: 'Ask me anything...'
        }
      },
      enableStreaming: true,
    })

    return () => {
      chatApp?.unmount?.()
      document.querySelector('#n8n-chat')?.replaceChildren()
    }
  }, [isChatPage])

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
  const pageSwitcherPane = (
    <section className="page-switcher-pane" aria-label="Navigate between welcome and chat">
      <div className="page-switcher-pane__inner">
        {navItems.map(({ id, label, Icon }) => {
          const isActive = activePage === id
          return (
            <button
              key={id}
              type="button"
              className={`page-switcher-pane__btn${isActive ? ' page-switcher-pane__btn--active' : ''}`}
              onClick={() => setActivePage(id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={label}
              title={label}
            >
              <span className="page-switcher-pane__icon" aria-hidden="true">
                <Icon />
              </span>
              <span className="sr-only">{label}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
  const adSection = (
    <section className="adsense-panel" aria-label="Sponsored content">
      <div className="adsense-panel__frame">
        <AdSenseSlot />
      </div>
    </section>
  )

  const centerContent = isChatPage ? (
    <main className={`layout ${isSidebarOpen ? 'layout--sidebar-open' : ''}`}>
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
  ) : (
    <main className="start-layout">
      <section className="start-screen">
        <div className="start-screen__content">
          <div className="start-screen__layout">
            <div className="start-screen__copy">
              <p className="start-screen__eyebrow">What can I do?</p>
              <h2>Explore the Quran with guided insights.</h2>
              <p className="start-screen__lede">
                Get verse explanations, tafsir cross-references, and journaling prompts tailored to your goals.
              </p>
            </div>
            <div className="start-screen__illustration" aria-hidden="true">
              <img src={READ_ICON} alt="" />
            </div>
          </div>
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
        </div>
      </section>
    </main>
  )

  const featurePane = (
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
      <p className="feature-pane__subheading">
        <br />
      </p>
    </aside>
  )

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
      <div className="content-shell">
        {pageSwitcherPane}
        <div className="content-shell__main">{centerContent}</div>
        {adSection}
      </div>
      {featurePane}
    </>
  )
}

export default App
