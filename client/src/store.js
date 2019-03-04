import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selectedAvatar: '',
    displayMovieInfo: false,
    movieInfo: {
      id: '',
      title: '',
      releaseDate: null,
      duration: '',
      recap: '',
      score: null,
      hrefBackdrop: '',
      hrefPoster: '',
      casting: [],
      recommended: [],
      torrentsInfo: [],
      comments: [],
    },
    messageError: '',
    messageSuccess: '',
    newTokenCreated: false,
  },
  mutations: {
    FILL_ERROR(state, data) {
      console.log('data', data);
      state.messageError = data;
    },
    FILL_SUCCESS(state, data) {
      state.messageSuccess = data;
    },
    FILL_SELECTEDAVATAR(state, data) {
      state.selectedAvatar = data;
    },
    DISPLAY_MOVIE_INFO(state, toggle) {
      state.displayMovieInfo = toggle;
    },
    LOAD_MOVIE_INFO(state, movie) {
      state.movieInfo.id = movie.id;
      state.movieInfo.title = movie.title;
      state.movieInfo.releaseDate = movie.releaseDate;
      state.movieInfo.duration = movie.duration;
      state.movieInfo.recap = movie.recap;
      state.movieInfo.score = movie.score;
      state.movieInfo.hrefBackdrop = movie.hrefBackdrop;
      state.movieInfo.hrefPoster = movie.hrefPoster;
      state.movieInfo.casting = movie.casting;
      state.movieInfo.genres = movie.genres;
      state.movieInfo.recommended = movie.recommended;
      state.movieInfo.torrentsInfo = movie.torrentsInfo;
    },
    NEW_TOKEN_CREATED(state, isTokenCreated) { state.newTokenCreated = isTokenCreated; },
    LOAD_COMMENTS(state, comments) { state.movieInfo.comments = comments; },
    ADD_COMMENT(state, comment) { state.movieInfo.comments.push(comment); },
  },
  actions: {
    load_movie_info({ commit }, movie) { commit('LOAD_MOVIE_INFO', movie); },
    display_movie_info({ commit }, toggle) { commit('DISPLAY_MOVIE_INFO', toggle); },
    new_token_created({ commit }, isTokenCreated) { commit('NEW_TOKEN_CREATED', isTokenCreated); },
    load_comments({ commit }, comments) { commit('LOAD_COMMENTS', comments); },
    add_comment({ commit }, comment) { commit('ADD_COMMENT', comment); },
  },
  getters: {
    messageSuccess(state) { return state.messageSuccess; },
    messageError(state) { return state.messageError; },
    selectedAvatar(state) { return state.selectedAvatar; },
    displayMovieInfo(state) { return state.displayMovieInfo; },
    movieInfo(state) { return state.movieInfo; },
    newTokenCreated(state) { return state.newTokenCreated; },
  },
});
