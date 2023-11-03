const Genre = require('../models/genre')
const Book = require('../models/book')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')

// Display list of all Genre.
exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().sort({ name: 1 }).exec()

  res.render('genre_list', {
    title: 'Genre List',
    genres: allGenres,
  })
})

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, 'title summary').exec(),
  ])

  if (!genre) {
    const err = new Error('Genre not found')
    err.status(404)
    return next(err)
  }

  res.render('genre_detail', {
    title: 'Genre Detail',
    genre: genre,
    genre_books: booksInGenre,
  })
})

// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => {
  res.render('genre_form', { title: 'Create Genre' })
}

// Handle Genre create on POST.
// array de middlewares
exports.genre_create_post = [
  // valida y sanitiza el campo "name"
  body('name', 'Genre name must containt at least 3 charactesr')
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // procesa peticion despues de la validacion y sanitizacion
  asyncHandler(async (req, res, next) => {
    // extrae los errores de valicacion de la request
    const errors = validationResult(req)

    // crea un objeto genre con la data sanitizada
    const genre = new Genre({ name: req.body.name })

    if (!errors.isEmpty()) {
      // hay errores. Renderiza la forma con los valores sanitizados
      // y mensajes de error
      res.render('genre_form', {
        title: 'Create Genre',
        genre: genre,
        errors: errors.array(),
      })
      return
    } else {
      // Los datos del formulario son validos.
      // verifica si un Genre con el mismo nombre existe
      const genreExists = await Genre.findOne({ name: req.body.name })
        .collation({ locale: 'en', strength: 2 })
        .exec()

      if (genreExists) {
        // si el Genre existe, redirige a su pagina de detalles
        res.redirect(genreExists.url)
      } else {
        await genre.save()
        // nuevo genero grabado. Redirige a la pagina de detalles
        res.redirect(genre.url)
      }
    }
  }),
]

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre delete GET')
})

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre delete POST')
})

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre update GET')
})

// Handle Genre update on POST.
exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre update POST')
})
