const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = '';
const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${API_KEY}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

/* GET home page. */
router.get('/', async (req, res, next) => {
  const response = await axios.get(nowPlayingUrl);
  console.log(response.data);
  res.json(response.data);
});

module.exports = router;
