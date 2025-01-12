import markdownit from 'markdown-it'
import mila from 'markdown-it-link-attributes'
import Shiki from '@shikijs/markdown-it'
import { destr } from 'destr'

const md = markdownit()

md.use(mila, {
  matcher: (link: string) => /^https?:\/\//.test(link),
  attrs: {
    target: '_blank',
    rel: 'noopener',
  },
})

Shiki({
  themes: {
    light: 'vitesse-light',
    dark: 'vitesse-dark',
  },
}).then((shiki) => {
  md.use(shiki)
})

function Index() {
  const [model, setModel] = useState(localStorage.getItem('model') || 'qwen2.5')
  const [url, setUrl] = useState(
    localStorage.getItem('url') || 'http://localhost:11434/api/generate',
  )
  const [disabled, setDisabled] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')

  async function handleSend(event: React.FormEvent) {
    event.preventDefault()

    if (!prompt || disabled) {
      return
    }

    setDisabled(true)
    setPrompt('')

    try {
      const res = await fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt,
        }),
      })

      const reader = res.body!.getReader()
      const textDecoder = new TextDecoder()

      let result = ''
      let done = false

      while (!done) {
        const { done: readDone, value } = await reader.read()

        done = readDone

        if (value) {
          result +=
            destr<{ response: string }>(textDecoder.decode(value)).response ||
            ''

          const rendered = md.render(result)

          setResponse(rendered)

          window.scrollTo(0, document.body.scrollHeight)
        }
      }
    } catch (error) {
      console.error(error)
      alert('发送失败')
    } finally {
      setDisabled(false)
    }
  }

  return (
    <section className="h-full text-gray-700 dark:text-gray-200">
      <header className="fixed left-0 top-0 z-[999] w-full bg-white px-[20px] shadow dark:bg-black">
        <div className="safe-area-top"></div>

        <div className="flex h-[60px] items-center gap-4">
          <div className="flex flex-1 gap-2">
            <input
              className="inp w-1/3"
              value={model}
              onChange={(event) => {
                setModel(event.target.value)
                localStorage.setItem('model', event.target.value)
              }}
            />

            <input
              className="inp w-2/3"
              value={url}
              onChange={(event) => {
                setUrl(event.target.value)
                localStorage.setItem('url', event.target.value)
              }}
            />
          </div>

          <NavBar />
        </div>
      </header>

      <main className="py-[60px]">
        <div className="safe-area-top"></div>

        <div
          className="prose max-w-none p-[20px] dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: response }}
        />

        <div className="safe-area-bottom"></div>
      </main>

      <footer className="fixed bottom-0 left-0 z-[999] w-full bg-white px-[20px] shadow dark:bg-black">
        <div className="flex h-[60px] items-center">
          <form className="flex w-full gap-2" onSubmit={handleSend}>
            <textarea
              className="inp flex-1 resize-none text-left"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              autoFocus
              rows={1}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  handleSend(event)
                }
              }}
            />

            <button className="btn" disabled={disabled}>
              发送
            </button>
          </form>
        </div>

        <div className="safe-area-bottom"></div>
      </footer>
    </section>
  )
}

export default Index
