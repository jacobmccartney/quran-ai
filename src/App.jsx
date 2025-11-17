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

const SIDEBAR_OPEN_ICON = withBase('/icons/lightbulb.png')
const SIDEBAR_CLOSED_ICON = withBase('/icons/lightbulb.png')
const LOGO_ICON = withBase('/icons/logo.png')
const READ_ICON = withBase('/icons/read.png')
const LIGHTBULB_ICON = withBase('/icons/lightbulb.png')
const TAFSIR_ICON = withBase('/icons/tafsir.png')
const QUESTION_ICON = withBase('/icons/question.png')
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
  const [pendingPrompt, setPendingPrompt] = useState('')
  const chatAppRef = useRef(null)

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)
  const isChatPage = activePage === NAV_PAGES.chat
  const navItems = [
    { id: NAV_PAGES.welcome, label: 'Welcome', Icon: HomeIcon },
    { id: NAV_PAGES.chat, label: 'Chat', Icon: ChatIcon },
  ]
  const infoBlocks = [
    {
      heading: 'Classical Tafsir',
      description:
        'Utilize reputable interpretations for historical and cross-verse context:\n・al-Qurtubi\n・al-Tabari\n・Ibn Kathir\n・as-Sa\'di',
      tone: 'sunrise',
      icon: TAFSIR_ICON,
      iconAlt: 'Classical tafsir icon',
    },
    {
      heading: 'Prompt recommendations',
      description: 'Kickstart reflection with simple study suggestions.',
      tone: 'forest',
      icon: LIGHTBULB_ICON,
      iconAlt: 'Lightbulb prompt icon',
    },
    {
      heading: 'Practical guidance',
      description: 'Ask life questions and receive Quran-centric direction.',
      tone: 'charcoal',
      icon: QUESTION_ICON,
      iconAlt: 'Question mark icon',
    },
  ]
  const promptSections = [
    {
      title: 'Ask for verses:',
      prompts: ['Show me 11:2 in Arabic.', 'Show me 2:1-10 and summarize the key ideas.'],
    },
    {
      title: 'Ask for Tafsir:',
      prompts: [
        'Show me Ibn Kathir Tafsir for 2:16.',
        'Give me the key points of Tafsir al-Tabari of 3:12-15.',
        'Compare Tafsir Ibn Kathir and al-Qurtubi on 5:12.'
      ],
    },
    {
      title: 'Ask the Quran:',
      prompts: [
        'How do I become a Muslim?',
        'How do I pray?',
        'Who is the Prophet Muhammed?',
        'What can I eat and drink as a Muslim?'
      ],
    },
    {
      title: 'Study Questions:',
      prompts: [
        'What are some reflection questions for 24:35?',
        'Summarize 4:10-20 and give me the common themes.',
        'Explain the relevance of Tafsir Ibn Kathir on 3:81 in conjunction with 5:68 and 5:47.'
      ],
    },
  ]

  useEffect(() => {
    if (chatAppRef.current) {
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

    chatAppRef.current = chatApp

    return () => {
      chatApp?.unmount?.()
      chatAppRef.current = null
    }
  }, [])

  const handlePromptSelect = (promptText) => {
    if (!promptText) {
      return
    }
    if (activePage !== NAV_PAGES.chat) {
      setActivePage(NAV_PAGES.chat)
    }
    setPendingPrompt(promptText)
  }

  useEffect(() => {
    if (!pendingPrompt || !isChatPage) {
      return undefined
    }

    let attempts = 0
    const maxAttempts = 20
    let timeoutId

    const trySendPrompt = () => {
      const chatRoot = document.querySelector('#n8n-chat')
      const input =
        chatRoot?.querySelector('textarea, input[type="text"], [contenteditable="true"]')

      if (!chatRoot || !input) {
        if (attempts < maxAttempts) {
          attempts += 1
          timeoutId = window.setTimeout(trySendPrompt, 200)
          return
        }
        setPendingPrompt('')
        return
      }

      if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
        input.value = pendingPrompt
      } else {
        input.textContent = pendingPrompt
      }
      input.dispatchEvent(new Event('input', { bubbles: true }))

      const sendButton =
        chatRoot.querySelector('button[type="submit"], button[aria-label="Send"]') ??
        chatRoot.querySelector('button[data-test-id="send-button"]')

      if (sendButton) {
        sendButton.click()
        setPendingPrompt('')
        return
      }

      if (attempts < maxAttempts) {
        attempts += 1
        timeoutId = window.setTimeout(trySendPrompt, 200)
        return
      }
      setPendingPrompt('')
    }

    trySendPrompt()
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [pendingPrompt, isChatPage])

  const topPane = (
    <section className="top-pane">
      <div className="top-pane__header">
        <div className="top-pane__brand">
          <img src={LOGO_ICON} alt="" className="top-pane__logo" aria-hidden="true" />
          <div className="top-pane__copy">
            <h1 className="top-pane__title top-pane__title-highlight">QuranScholarAI</h1>
            <p className="top-pane__subtitle">Your Quran Study Companion</p>
          </div>
        </div>
        <nav className="top-pane__nav" aria-label="Navigate between welcome and chat">
          {navItems.map(({ id, label, Icon }) => {
            const isActive = activePage === id
            return (
              <button
                key={id}
                type="button"
                className={`top-pane__nav-btn${isActive ? ' top-pane__nav-btn--active' : ''}`}
                onClick={() => setActivePage(id)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={label}
                title={label}
              >
                <span className="top-pane__nav-icon" aria-hidden="true">
                  <Icon />
                </span>
                <span className="sr-only">{label}</span>
              </button>
            )
          })}
        </nav>
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

  const chatView = (
    <main
      className={`layout ${isSidebarOpen ? 'layout--sidebar-open' : ''} ${
        isChatPage ? '' : 'view-hidden'
      }`}
      aria-hidden={!isChatPage}
    >
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
  )

  const welcomeView = (
    <main className={`start-layout ${isChatPage ? 'view-hidden' : ''}`} aria-hidden={isChatPage}>
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
          <div className="start-screen__info">
            {infoBlocks.map(({ heading, description, tone, icon, iconAlt }) => (
              <article key={heading} className={`start-screen__info-card start-screen__info-card--${tone}`}>
                <div className="start-screen__info-card-content">
                  <div>
                    <h3>{heading}</h3>
                    <p>{description}</p>
                  </div>
                  <img src={icon} alt={iconAlt} className="start-screen__info-card-icon" />
                </div>
              </article>
            ))}
          </div>
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
      </div>
      {promptSections.map(({ title, prompts }) => (
        <section key={title} className="feature-pane__section">
          <p className="feature-pane__subheading">{title}</p>
          <ul className="feature-pane__list">
            {prompts.map((prompt, index) => (
              <li key={`${title}-${index}`}>
                <button
                  type="button"
                  className="feature-pane__prompt"
                  onClick={() => handlePromptSelect(prompt)}
                >
                  {prompt}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
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
        <div className="content-shell__main">
          {welcomeView}
          {chatView}
        </div>
        {adSection}
      </div>
      {featurePane}
    </>
  )
}

export default App
