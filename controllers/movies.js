const Movie = require('../models/movie');
const Performer = require('../models/performer');

function index(req, res) {
  Movie.find({}, (err, movies) => {
    res.render('movies/index', { title: 'All Movies', movies });
  });
}

function show(req, res) {
  Movie.findById(req.params.id)
    .populate('cast')
    .exec((err, movie) => {
      // Performer.find({}).where('_id').nin(movie.cast)
      Performer.find({ _id: { $nin: movie.cast } }).exec((err, performers) => {
        console.log(movie.reviews);
        res.render('movies/show', {
          title: 'Movie Detail',
          movie,
          performers,
        });
      });
    });
}

function newMovie(req, res) {
  res.render('movies/new', { title: 'Add Movie' });
}

function create(req, res) {
  // convert nowShowing's checkbox of nothing or "on" to boolean
  req.body.nowShowing = !!req.body.nowShowing;
  for (const key in req.body) {
    if (req.body[key] === '') delete req.body[key];
  }
  const movie = new Movie(req.body);
  movie.save((err) => {
    if (err) return res.redirect('/movies/new');
    // res.redirect('/movies');
    res.redirect(`/movies/${movie._id}`);
  });
}

module.exports = {
  index,
  show,
  new: newMovie,
  create,
};
