<template lang='pug'>
    div
        .movieCard(@click="getMovieInfo")
            i.el-icon-view(v-if="see")
            img.poster(:src="img || '/noImg.png'")
            //- v-if pour mettre ou pas l'oeil
            .info
                h1.title {{ title }}
                h1.annee {{ annee }}
                .rate
                    <el-rate v-model="value5" disabled show-score :colors="['#2c3e50', '#2c3e50', '#2c3e50']" text-color="#2c3e50" score-template="{value} points">
                    </el-rate>
</template>

<style lang="scss">
.movieCard {
    position: relative;
}

.poster {
    width: 100%;
}

.info {
    background-color: #ffffffbd;
    width: 100%;
    height: 98%;
    position: absolute;
    top: 0;
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s, opacity .3s;
}

.movieCard:hover .info {
    visibility: visible;
    opacity: 1;
}

.title {
    position: absolute;
    top: 15%;
    left: 0;
    right: 0;
    margin: auto;
    max-height: 183px;
}

.rate {
    position: absolute;
    bottom: 15px;
    left: 0;
    right: 0;
    margin: auto;
}

.annee {
    position: absolute;
    bottom: 35px;
    left: 0;
    right: 0;
    margin: auto;
}

.el-icon-view {
    font-size: 30px;
    color: #4AAE9B;
    border-radius: 50%;
    padding: 3px;
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 1;
}

</style>

<script>

import { GetMovieInfo } from '@/constants/query.gql';
import movieInfo from './movieInfo.vue';
import store from '@/store.js';
import { Loading } from 'element-ui';

export default {
    store,
    props: ['movieId', 'title', 'img', 'annee', 'rate', 'see'],
    data() {
        return {
            backgroundImg: `background-image: url(${this.img});`,
            color: "color: black;",
            value5: this.rate / 20,
            movieInfo: {},
            noImg: '',
        }
    },
    created() {
        
        // console.log(this.userMovies);
    },
    methods: {
        getMovieInfo(){
            // console.log(this.movieId);
            let cargando = Loading.service();
            this.$apollo.query({
                    query: GetMovieInfo,
                    variables: {
                        movieId: this.movieId,
                    },
            }).then(({ data }) => {
                cargando.close();
                if (data.movieInfo)
                {
                    this.$store.dispatch('load_movie_info', data.movieInfo);
                    this.$store.dispatch('display_movie_info', true);
                }
                else
                    this.error();
            }).catch((err) => {
                this.ErrorHandler(err);
            });
        },
        error() {
        const h = this.$createElement;

        this.$notify.error({
          title: 'Error',
          message: h('i', { style: 'color: teal' }, 'This movie is unavailable')
        });
      },
    },
    components: {
        movieInfo,
    },
}
</script>
