const Movie = require('../models/movie');

function create(req, res) {
  Movie.findById(req.params.id, (err, movie) => {
    const review = {
      ...req.body,
      user: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar,
    };
    // req.body.user = req.user._id;
    // req.body.userName = req.user.name;
    // req.body.userAvatar = req.user.avatar;

    movie.reviews.push(review);
    movie.save((err) => {
      console.log('error', err);
      res.redirect(`/movies/${movie._id}`);
    });
  });
}

function deleteReview(req, res, next) {
  // Find the movie with working with
  Movie.findOne({
    'reviews._id': req.params.id,
    'reviews.user': req.user._id,
  })
    .then((movie) => {
      // base case when no record found
      if (!movie) return res.redirect(`/movies/${movie._id}`);

      movie.reviews.remove(req.params.id);
      movie
        .save()
        .then(() => res.redirect(`/movies/${movie._id}`))
        .catch((err) => next(err));
    })
    .catch((err) => {
      // we basically tell express to keep going and let the error handler in server js display the error page
      next(err);

      // alternatively we could just send them back to the show page (effectively do nothing)
      // res.redirect(`/movies/${movie._id}`);
    });
}

module.exports = {
  create,
  delete: deleteReview,
};
