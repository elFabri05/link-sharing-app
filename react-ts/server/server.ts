import express from 'express'
const app = express()
const port = 3300

// app.use(express.static('dist'))

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

app.get('/api/some-route', (req, res) => {
  // Handle the request
});