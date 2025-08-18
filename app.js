import express, { json } from 'express' // → requires commonJS
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()
app.use(json()) //
app.use(corsMiddleware())
app.disable('x-powered-by') // desabilita la publicidad de express


// todos los recursos que sean Movies se identifican con /movies
app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 1234   

app.listen(PORT, ()=>{
    console.log(`app on port: http://localhost:${PORT}`)
})
