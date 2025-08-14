const express = require('express') // → requires commonJS
const crypto = require('node:crypto')
const cors = require('cors')
    
const movies = require('./movies.json')
const { validateMovie, validarPartialMovie } = require ('./schemas/movies')

const app = express()
app.disable('x-powered-by') // desabilita la publicidad de express
app.use(cors({
    origin:(origin, callback)=> {
    const ACCEPTED_ORIGINS = [  
        'http://localhost:1234',
        'http://localhost:8080',
        'https://movies.com',
        'https://midu.dev'
        ]
        if(ACCEPTED_ORIGINS.includes(origin)){
            return callback(null, true)
        }
        if(!origin){
            return callback(null, true)
        }
        return callback(new Error(`Not Allowed by CORS`))
    }
    })
) 

// resuelve todos los cors y le dice si a todo app.use(cors())  se puede dejar asi para
// proyectos personales

app.use(express.json()) // middelware

// metodos normales: GET/HEAD/POST
// metodos complejos: PUT/PATCH/DELETE

// CORS PRE-flight OPTIONS → sale para mayor seguridad
app.get('/movies', (req, res)=>{ // endpoint 
    const {genre} = req.query
    if(genre){
        const movieFilter = movies.filter(
            movie=>movie.genre.some(a=>a.toLowerCase()===genre.toLowerCase())
        )
        return res.json(movieFilter)   
    }
    res.json(movies)
})

app.get('/movies/:id', (req, res)=>{ // endpoint 
    const {id} = req.params
    const movie = movies.find(movie => movie.id === id)
    if(movie) return res.json(movie)

    res.status(404).json({message: 'Movie not found'})

})
app.post('/movies', (req,res)=>{
    const result = validateMovie(req.body)

    if(result.error) {
        // 422 Unprocessable Entity
        return res.status(400).json(JSON.
            parse(result.error))
    }
    const newMovie = {
        id: crypto.randomUUID(), // id random generado con crypto de nodejs
        ...result.data
    }
    movies.push(newMovie)
    res.status(201).json(newMovie) // actualizar el cache del cliente 
})

app.patch('/movies/:id', (req, res)=>{
        const result = validarPartialMovie(req.body)
        if(!result.success){
            return res.status(400).json({error: JSON.parse(result.error.message)})
        }

        const { id } = req.params
        const movieIndex = movies.findIndex(movie=>movie.id === id)
        // devuelve la posicion(index) si no devuelve -1

        if(movieIndex === -1) {
            return res.status(404).json({message: 'Movie not found'})
        }
        const updatedMovie = {
            ...movies[movieIndex],
            ...result.data
        }
        movies[movieIndex] = updatedMovie   
        
        return res.status(200).json(updatedMovie)
        
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex(movie => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'movie not found' });
  }

  movies.splice(movieIndex, 1); // (indiceInicio, numElementos, nuevo elemento(s))// delete

  return res.json({ message: 'Movie deleted' });
});

const PORT = process.env.PORT ?? 1234

app.listen(PORT, ()=>{
    console.log(`app on port: http://localhost:${PORT}`)
})


// const ACCEPTED_ORIGINS = [
//     'http://localhost:1234',
//     'http://localhost:8080',
//     'https://movies.com',
//     'https://midu.dev'
// ]

// app.get('/movies', (req, res)=>{ // endpoint 
//     const origin = req.header('origin')
//     if(ACCEPTED_ORIGINS.includes(origin) || !origin) { // si es el mismo o no hay origen
//     res.header('Access-Control-Allow-Origin', origin)
//     }
//     const {genre} = req.query
//     if(genre){
//         const movieFilter = movies.filter(
//             movie=>movie.genre.some(a=>a.toLowerCase()===genre.toLowerCase())
//         )
//         return res.json(movieFilter)   
//     }
//     res.json(movies)
// })

// app.get('/movies/:id', (req, res)=>{ // endpoint 
//     const {id} = req.params
//     const movie = movies.find(movie => movie.id === id)
//     if(movie) return res.json(movie)

//     res.status(404).json({message: 'Movie not found'})

// })
// app.post('/movies', (req,res)=>{
//     const result = validateMovie(req.body)

//     if(result.error) {
//         // 422 Unprocessable Entity
//         return res.status(400).json(JSON.
//             parse(result.error))
//     }
//     const newMovie = {
//         id: crypto.randomUUID(), // id random generado con crypto de nodejs
//         ...result.data
//     }
//     movies.push(newMovie)
//     res.status(201).json(newMovie) // actualizar el cache del cliente 
// })

// app.patch('/movies/:id', (req, res)=>{
//         const result = validarPartialMovie(req.body)
//         if(!result.success){
//             return res.status(400).json({error: JSON.parse(result.error.message)})
//         }

//         const { id } = req.params
//         const movieIndex = movies.findIndex(movie=>movie.id === id)
//         // devuelve la posicion(index) si no devuelve -1

//         if(movieIndex === -1) {
//             return res.status(404).json({message: 'Movie not found'})
//         }
//         const updatedMovie = {
//             ...movies[movieIndex],
//             ...result.data
//         }
//         movies[movieIndex] = updatedMovie   
        
//         return res.status(200).json(updatedMovie)
        
// })

// app.delete('/movies/:id', (req, res) => {
//   const origin = req.header('origin');
//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }

//   const { id } = req.params;
//   const movieIndex = movies.findIndex(movie => movie.id === id);

//   if (movieIndex === -1) {
//     return res.status(404).json({ message: 'movie not found' });
//   }

//   movies.splice(movieIndex, 1); // (indiceInicio, numElementos, nuevo elemento(s))// delete

//   return res.json({ message: 'Movie deleted' });
// });

// app.options('/movies/:id', (req, res)=>{
//     const origin = req.header('origin')

//     if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin);
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
//   }
//   res.send(200)
// })

// const PORT = process.env.PORT ?? 1234

// app.listen(PORT, ()=>{
//     console.log(`app on port: http://localhost:${PORT}`)
// })
