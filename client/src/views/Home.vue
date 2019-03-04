<template lang='pug'>
  div
    .input-label
      el-input(v-model="input1", placeholder="Title movie", prefix-icon="el-icon-search" @keyup.enter.native="searchMovie")
        el-button(@click='searchMovie', slot="append") Search
        el-button.reset(@click='resetSearch', slot="append") Reset
    .clear
    .filtro
      el-button(type="info" icon="el-icon-sort" circle @click="showFiltro = !showFiltro")
      el-collapse-transition
        .filter(v-show="showFiltro")
          .slider1
            .grupo
              .prepend Score min.
                el-rate(v-model="score1" :colors="['#99A9BF', '#F7BA2A', '#FF9900']")
          .slider1
            el-input(v-model="inputTitle", placeholder="Title movie")
              template(slot="prepend") Title
          .slider1
            .grupo
              .prepend Genre
              el-select.inner(v-model="inputGenre" placeholder='Select genrer')
                el-option(v-for="(genre, key) in genres" :label="genre.lagel" :value="genre.value")
          .slider1
            .grupo
              .prepend Year
              el-input-number(v-model="year1" :min="1900" :max="2020")
              el-input-number(v-model="year2" :min="1900" :max="2020")
          .slider1
            .grupo
              .prepend Sort by
              el-select.inner(v-model="inputSort" placeholder='Select')
                el-option(label="Title" value="Title")
                el-option(label="Genre" value="Genre")
                el-option(label="Year" value="Year")
                el-option(label="Score" value="Score")
          el-button(@click='filterMovies') Filter
          el-button(@click='resetMovies') Reset
    //- el-row(:gutter="10")
    cargando(v-if="loading2")
    div.container
      //- transition-group(name="fade")
      .contenue(v-for='m in movies', :key='m.id')
        movieCard(:movieId='m.id', :title='m.title', :img='m.hrefPoster',
        :annee='m.releaseDate', :rate='m.score', :see='m.see')
    div
      transition(name="fade")
        movieInfo(v-if="displayMovieInfo")
        
</template>
<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .7s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

body {
  background-color: black;
}
h1 {
  overflow: hidden;
}

.input-label {
  display: inline-block;
  min-width: 320px;
}

.slider1 {
  width: 80%;
  position: relative;
  left: 10%;
}

.el-slider__button-wrapper {
  z-index: 1 !important;
}

.filter {
  background-color: whitesmoke;
  max-width: 600px;
  min-width: 300px;
  padding: 15px;
}

.filtro {
  display: inline-block;
}

.clear {
  clear: both;
  margin: 20px;
}

.noMargin {
  margin: 0;
}

.left {
  float: left;
}

.grupo {
  line-height: normal;
  display: inline-table;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.prepend {
    background-color: #f5f7fa;
    color: #909399;
    vertical-align: middle;
    display: table-cell;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 0 20px;
    width: 1px;
    white-space: nowrap;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    height: 40px;
}

.inner {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  width: 100% !important;
}

.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.contenue {
  flex-grow: 1;
  flex-basis: 200px;
  max-width: 230px;
  max-height: 340px;
  margin: 10px;
}

.reset {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-left: 1px solid #dcdfe6 !important;
}

</style>

<script>
import { mapGetters } from 'vuex';
import movieCard from '../components/movieCard.vue';
import movieInfo from '../components/movieInfo.vue';
import { GetOneMovie } from '@/constants/query.gql';
import { GetMovies, AskToken, GetUserMovies } from '@/constants/query.gql';
import store from '@/store.js';
import { Loading } from 'element-ui';
import cargando from '../components/loading.vue';


export default {
  store,
  name: 'Home',
  components: {
    movieCard,
    movieInfo,
    cargando,
  },
  computed: {
    ...mapGetters([
      'displayMovieInfo',
      'movieInfo',
    ]),
  },
  data() {
    return {
      movies: [],
      moviesTmp: [],
      nbPage: 1,
      input1: '',
      year1: 1900,
      year2: 2020,
      score1: null,
      inputTitle: '',
      inputGenre: [],
      inputSort: '',
      genres: [{
        value: 'Action',
        label: 'Action'
      },{
        value: 'Adventure',
        label: 'Adventure'
      },{
        value: 'Animation',
        label: 'Animation'
      },{
        value: 'Comedy',
        label: 'Comedy'
      },{
        value: 'Crime',
        label: 'Crime'
      },{
        value: 'Documentary',
        label: 'Documentary'
      },{
        value: 'Drama',
        label: 'Drama'
      },{
        value: 'Family',
        label: 'Family'
      },{
        value: 'Fantasy',
        label: 'Fantasy'
      },{
        value: 'History',
        label: 'History'
      },{
        value: 'Horror',
        label: 'Horror'
      },{
        value: 'Music',
        label: 'Music'
      },{
        value: 'Mystery',
        label: 'Mystery'
      },{
        value: 'Romance',
        label: 'Romance'
      },{
        value: 'Science Fiction',
        label: 'Science Fiction'
      },{
        value: 'Thriller',
        label: 'Thriller'
      },{
        value: 'War',
        label: 'War'
      },{
        value: 'Western',
        label: 'Western'
      }],
        showFiltro: false,
        scrollOn: true,
        filtro: false,
        loading2: false,
        search: false,
    }
  },
  // apollo: {
  //   movies: {
  //     query: GetMovies,
  //     update: result => result.miniMovies
  //   }
  // },
  async mounted () {
    if (this.$route.query.authKey) {
      const token = await this.askToken(this.$route.query.authKey);
    }
    if (localStorage.getItem('user-token')) {
      try {
        const userImg = JSON.parse(atob(localStorage.getItem('user-token').split('.')[1])).picture;
        const userLogin = JSON.parse(atob(localStorage.getItem('user-token').split('.')[1])).login;
        this.$emit('identity', { userImg, userLogin });
      } catch (error) {
        this.$message({
          type: 'error',
          message: 'Authentication error.',
        })
        localStorage.removeItem('user-token');
        this.$router.push('/signin');
      }
    }
    this.loading2 = true;
    this.$apollo.query({
      query: GetMovies,
      variables: {
        nbPage: this.nbPage,
      }
    }).then(result => { 
      this.movies = result.data.miniMovies;
      this.nbPage++;
      this.loading2 = false;
    }).catch((error) => {
      this.ErrorHandler(error);
    })
    window.onscroll = () => {
      const bottomOfWindow =
      window.scrollY + window.innerHeight >= document.documentElement.offsetHeight - 500;
      if (bottomOfWindow && this.scrollOn) {
        this.nbPage = this.nbPage + 1;
          this.$apollo.query({
            query: GetMovies,
            variables: {
              nbPage: this.nbPage,
            },
          }).then((result) => {
            if(result.data.miniMovies)
            {
              var unique = [];
              var pelis = result.data.miniMovies;
              if (pelis.length > 0) {
                pelis = this.movies.concat(pelis);
                pelis.forEach(elem1 => {
              // console.log(elem1.id);
                  var present = 0;
                  unique.forEach(elem2 => {
                    if (elem1.id === elem2.id) present = 1;
                  });
                  if (present == 0) unique.push(elem1);
                });
                this.movies = unique;
                // this.movies = this.movies.filter((v, i) => this.movies.indexOf(v) === i);
              }
            }
          }).catch((err) => {
            this.ErrorHandler(err);
          });
      }
    };
  },
  beforeDestroy() {
    window.onscroll = () => {
      return null;
    }
  },
  methods: {
    hideMovieInfo(event) {
      if (event.which === 27) {
        this.$store.dispatch('display_movie_info', false);
      }
    },
    filterMovies() {
      this.scrollOn = false;
      if (this.moviesTmp.length === 0)
        this.moviesTmp = this.movies;
      else
        this.movies = this.moviesTmp;
      if (this.inputTitle != '')
        this.movies = this.movies.filter(e => e.title.toUpperCase().indexOf(this.inputTitle.toUpperCase()) > -1)
      if (this.inputGenre != '')
        this.movies = this.movies.filter(e => e.genresReturn.indexOf(this.inputGenre) > -1)
      if (this.year1 && this.year2 && this.year1 <= this.year2)
        this.movies = this.movies.filter(e => e.releaseDate >= this.year1 && e.releaseDate <= this.year2);
      if (this.score1)
        this.movies = this.movies.filter(e => e.score >= this.score1 * 20 && e.score <= 5 * 20);
      if (this.inputSort != '') {
        if (this.inputSort === 'Title') {
          this.movies.sort((a, b) => {
            if (a.title > b.title)
              return 1;
            if (a.title < b.title)
              return -1;
            return 0;
          });
        }
        else if (this.inputSort === 'Genre') {
          this.movies.sort((a, b) => {
            if (a.genresReturn[0] > b.genresReturn[0])
              return 1;
            if (a.genresReturn[0] < b.genresReturn[0])
              return -1;
            return 0;
          });
        }
        else if (this.inputSort === 'Year') {
          this.movies.sort((a, b) => {
            if (a.releaseDate > b.releaseDate)
              return 1;
            if (a.releaseDate < b.releaseDate)
              return -1;
            return 0;
          });
        }
        else if (this.inputSort === 'Score') {
          this.movies.sort((a, b) => {
            if (a.score < b.score)
              return 1;
            if (a.score > b.score)
              return -1;
            return 0;
          });
        }
      }
    },
    resetMovies() {
      if (this.moviesTmp.length > 0) {
        this.movies = this.moviesTmp;
        this.moviesTmp = [];
      }
      if (!this.search)
        this.scrollOn = true;
      this.input1 = '';
      this.year1 = 1900;
      this.year2 = 2020;
      this.score1 = null;
      this.inputTitle = '';
      this.inputGenre = '';
      this.inputSort = '';
    },
    resetSearch() {
      if (this.moviesTmp.length > 0) {
        this.movies = this.moviesTmp;
        this.moviesTmp = [];
      }
      else
        location.reload();
      this.moviesTmp = [];
      this.input1 = '';
      this.scrollOn = true;
    },
    searchMovie() {
      if (this.input1 != '') {
        this.scrollOn = false;
        this.search = true;
        let cargando = Loading.service();
        // this.moviesTmp = this.movies;
        this.$apollo.query({
          query: GetOneMovie,
          variables: {
            movieTitle: this.input1,
          }
        }).then(result => {
          var pelis = result.data.oneMovie;
          var unique = [];
          if (pelis.length > 0) {
            // console.log(pelis);
            pelis.forEach(elem1 => {
              // console.log(elem1.id);
              var present = 0;
              unique.forEach(elem2 => {
                if (elem1.id === elem2.id) present = 1;
              });
              if (present == 0) unique.push(elem1);
            });
            // console.log(unique);
            // this.movies = pelis.filter((v, i) => pelis.indexOf(v) === i);
            this.movies = unique;
          }
          else {
            this.$message({
              showClose: true,
              message: 'Oups, can\t find any movie',
              type: 'error'
            });
            this.movies = this.moviesTmp;
            this.moviesTmp = [];
            this.scrollOn = true;
          }
          
          cargando.close();
          // this.movies = result.data.oneMovie;
          // console.log(this.movies);
        });
      }
      
    },
    formatTooltip(val) {
      return val / 20;
    },
    async askToken(authKey) {
      const token = await this.$apollo.query({
              query: AskToken,
              variables: {
                authKey: this.$route.query.authKey, 
              }
            }).then(async ({data}) => {
              if (data.askToken !== 'false') {
                const test3 = await this.saveToken(data.askToken);
                return test3;
              }
              this.error = false;
            }).catch((error) => {
              if (error.graphQLErrors) {
                if (error.graphQLErrors.length >= 1)
                  this.error = error.graphQLErrors[0].message
              }
              else {
                this.error = 'Something went wrong';
              }
              console.log('ERROR', error);
            })
      return token;
    },
    async saveToken(token) {
      localStorage.setItem('user-token', token);
      return 'token saved';
    },
  },
  created: function () {
    window.addEventListener('keyup', this.hideMovieInfo);
  },
}
</script>


