import markdownit from 'markdown-it'
import Shiki from '@shikijs/markdown-it'
import axios from 'axios'
import { destr } from 'destr'

const md = markdownit()

Shiki({
  themes: {
    light: 'vitesse-light',
    dark: 'vitesse-dark',
  },
}).then((shiki) => {
  md.use(shiki)
})

function Index() {
  const [model, setModel] = useState('qwen2')
  const [url, setUrl] = useState('http://localhost:11434/api/generate')
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
      const res = await axios.post(
        url,
        {
          model,
          prompt,
        },
        {
          adapter: 'fetch',
          responseType: 'stream',
        },
      )

      const reader = res.data.getReader()
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
      alert('暂不支持')
    } finally {
      setDisabled(false)
    }
  }

  return (
    <div className="p-[20px] py-[80px]">
      <div className="fixed left-0 top-0 z-[999] flex h-[60px] w-full items-center gap-4 bg-white px-[20px] shadow dark:bg-black">
        <div className="flex flex-1 gap-2">
          <input
            className="inp w-1/3"
            value={model}
            onChange={(event) => setModel(event.target.value)}
          />

          <input
            className="inp w-2/3"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </div>

        <NavBar />
      </div>

      <div
        className="whitespace-pre-wrap break-words"
        dangerouslySetInnerHTML={{ __html: response }}
      />

      <div className="fixed bottom-0 left-0 z-[999] flex h-[60px] w-full flex-col items-center justify-center bg-white px-[20px] shadow dark:bg-black">
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
    </div>
  )
}

export default Index
