import express from 'express'
import routes from './routes'

const app = express()
const port = 3000

app.use('/', routes)

// Starting the express server
app.listen(port, () => {
  console.log(`Server has started on port ${port}`)
})

export default app
