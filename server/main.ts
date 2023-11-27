import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import clipboardy from 'clipboardy';
import * as CDN from './cdn'
import { hash } from './utils'
import { PORT } from './env'

const app = express()

app.use(cors())
app.use(morgan('short'))

app.get('/:digest', async (req, res) => {
  try {
    const digest = req.params.digest
    await Promise.all([
      CDN.isFileExisted(digest + '.svg'),
      // CDN.isFileExisted(digest + '.svg.encoded'),
    ])
    res.end()
  } catch (err) {
    res.status(404).end()
  }
})

app.post(
  '/upload',
  bodyParser.text(),
  async (req, res) => {
    try {
      const svg = req.body + ''
      const digest = hash(svg)
      const buffer = Buffer.from(svg)
      const encoded = Buffer.from('data:image/svg+xml;base64,' + buffer.toString('base64'))
      await Promise.all([
        CDN.uploadFile(digest + '.svg', buffer),
        // CDN.uploadFile(digest + '.svg.encoded', encoded),
      ])
      res.end()
    } catch (err) {
      res.status(500).json({ err: err + '' }).end()
    }
  }
)

app.post('/copy', bodyParser.text(), (req, res) => {
  clipboardy
    .write(req.body)
    .then(() => res.end())
    .catch(err => {
      console.error(err)
      res.status(500).end()
    })
})

app.listen(
  PORT,
  () => {
    console.log(`Figma Developer Helper Server is running on PORT ${PORT}`)
  }
)