const mongoose = require('mongoose');

const { Schema } = mongoose;

function buildModel(name, schema) {
  return mongoose.model(name, new Schema(schema, { timestamps: true }));
}

module.exports.Movie = buildModel('Movie', {
  title: String,
  releaseDate: Number,
  hrefPoster: String,
  duration: String,
  recap: String,
  score: Number,
  hrefBackdrop: String,
  casting: {
    actors: [
      {
        actorName: String,
        characterName: String,
        hrefPhoto: String,
      },
    ],
    crew: [
      {
        crewName: String,
        crewRole: String,
      },
    ],
  },
  genres: Array,
  recommended: [
    {
      title: String,
      hrefPoster: String,
      score: Number,
    },
  ],
  id: String,
  torrentsInfo: [
    {
      title: String,
      link: String,
      seeders: Number,
      leechers: Number,
      size: String,
      quality: String,
      dlLink: String,
      ratio: Number,
      hash: String,
    },
  ],
  comments: [
    {
      id: String,
      comment: String,
    },
  ],
  lastScrappingUpdate: {
    type: Date,
    default: Date.now(),
  },
  createdAt: Date,
  updatedAt: Date,
  isAvailable: false,
});
