const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = '1fb720b97cc13e580c2c35e1138f90f8';
const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${API_KEY}`;
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

router.use((req, res, next) => {
  res.locals.imageBaseUrl = imageBaseUrl;
  next();
});

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const response = await axios.get(nowPlayingUrl);
    res.render('index', { results: response.data.results }); 
  } catch (error) {
    res.render('error', { message: 'Ocorreu um erro ao carregar a tela principal', error }); 
  }
});

router.get('/movie/:id', async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const response = await axios.get(`${apiBaseUrl}/movie/${movieId}?api_key=${API_KEY}`);
    res.render('single-movie', { movie: response.data }); 
  } catch (error) {
    res.render('error', { message: 'Ocorreu um erro ao carregar a tela de detalhes', error }); 
  }
});

router.post('/search', async (req, res, next) => {
  try {
    const { cat, movieSearch } = req.body;
    const response = await axios.get(`${apiBaseUrl}/search/${cat}?query=${encodeURI(movieSearch)}&api_key=${API_KEY}`);
    cat === 'movie' && res.render('index', { results: response.data.results }); 
    cat === 'person' && res.render('index', { results: response.data.results[0].known_for }); 
  } catch (error) {
    res.render('error', { message: 'Ocorreu um erro ao carregar a tela de detalhes', error }); 
  }
});

module.exports = router;
