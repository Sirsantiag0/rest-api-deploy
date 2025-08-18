import { MovieModel } from '../models/movie.js'
import { validateMovie, validarPartialMovie } from '../schemas/movies.js'

export class MovieController {
    // aqui recupera la request y la response 
    static async getAll (req, res){ // endpoint 
        const {genre} = req.query
        const movies = await MovieModel.getAll({ genre })

        // decide lo que renderiza  // tambien puede ser html + css y queda brutal 
        res.json(movies)
    }
    static async getById (req, res){ // endpoint 
        const {id} = req.params
        const movie = await MovieModel.getById({id})

        if(movie) return res.json(movie)
        res.status(404).json({message: 'Movie not found'})
    }
    static async create (req,res){
        const result = validateMovie(req.body)
        if(result.error) {
            return res.status(400).json(JSON.parse(result.error))
        }

        const newMovie = await MovieModel.create({input: result.data})
        res.status(201).json(newMovie) 
    }
    static async delete (req, res) {
      const { id } = req.params;
      const result = await MovieModel.delete({id}) 
    
      if(result === false) {
        return res.status(404).json({message: 'movie Not Found'})
      }
      return res.json({ message: 'Movie deleted' });
    }
    static async update(req, res){ 
        const result = validarPartialMovie(req.body)
        if(!result.success){
            return res.status(400).json({error: JSON.parse(result.error.message)})
        }

        const { id } = req.params
        const updatedMovie = await MovieModel.update({id, input: result.data})

        return res.status(200).json(updatedMovie) 
    }
}
