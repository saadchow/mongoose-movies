const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    // Add the 3 new properties below
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: String,
    userAvatar: String,
  },
  {
    timestamps: true,
  }
);

const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    releaseYear: {
      type: Number,
      default() {
        return new Date().getFullYear();
      },
    },
    mpaaRating: String,
    nowShowing: { type: Boolean, default: false },
    reviews: [reviewSchema],
    cast: [{ type: Schema.Types.ObjectId, ref: 'Performer' }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Movie', movieSchema);
