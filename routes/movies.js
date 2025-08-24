import { Router } from 'express'

import { MovieController } from '../controllers/movies.js'

export const moviesRouter = Router()

moviesRouter.get('/', MovieController.getAll )// esto seria para manejar por un lado el error y por otro lado el resultado
moviesRouter.get('/text', MovieController.getText )
moviesRouter.get('/:id', MovieController.getById )
moviesRouter.post('/', MovieController.create )
moviesRouter.delete('/:id', MovieController.delete )
moviesRouter.patch('/:id', MovieController.update )




