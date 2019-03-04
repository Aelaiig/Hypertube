<template lang='pug'>
    div.fondo
        img.backdrop(:src="movieInfo.hrefPoster")
        .cerrar(@click="closeInfo") Close
        .contentInfo
            h1.titleInfo {{ movieInfo.title }}
            .infoContent
                i.el-icon-date.icon
                h3.fizq_mar0 {{ movieInfo.releaseDate }} &nbsp;
                i.el-icon-time.icon
                h3.fizq_mar0 {{ movieInfo.duration }} &nbsp;
                <el-rate class="fizq_mar0" v-model="movieInfo.score / 20" disabled show-score text-color="#ff9900" score-template="{value} points"></el-rate>
            .genres
                h3.fizq_mar0(v-for="(genre, key) in movieInfo.genres") {{ genre }} &nbsp;
            .sinopsis
                h3 {{ movieInfo.recap }}
            el-tabs(type='border-card')
                el-tab-pane(label='Casting')
                    div.filaActores
                        div.actors(v-for="(actor, key) in movieInfo.casting.actors")
                            img.actorImg(:src="actor.hrefPhoto")
                            h4.actorTex {{ actor.actorName }}
                            h5.actorTex {{ actor.characterName }}
                el-tab-pane(label='Crew')
                    .filaActores
                        .actors(v-for="(crew, key) in movieInfo.casting.crew")
                            h4.actorTex {{ crew.crewRole }}
                            h5.actorTex {{ crew.crewName }}
                el-tab-pane(label='Recommended')
                    .filaActores
                        .films(v-for="(movie, key) in movieInfo.recommended")
                            img.filmImg(:src="movie.hrefPoster")
                            div
                                h4.actorTex {{ movie.title }}
                                h5.actorTex.el-icon-star-on.icon {{ movie.score }}/100
                el-tab-pane(label='Comments')
                    .comments_part
                        commentCard(v-for='c in movieInfo.comments', :login='c.login', :picture='c.picture', :comment='c.comment', :userId='c.id')
                    .commenting_part
                        img(:src='picture', class='user_avatar')
                        .input_part
                            el-input(type='textarea', :autosize='{ minRows: 2, maxRows: 4}', v-model='comment')
                            el-button.btnSuccess(@click='sub_comment' type="success" icon="el-icon-check" circle)
        .footer
            .play(@click='play')
                .el-icon-caret-right
            el-select.selector(v-model='value', :placeholder='placeHolder' value-key="value" :disabled="disabled == 1")
                el-option(v-for='(torrent, key) in movieInfo.torrentsInfo', :key='torrent.dlLink', :label='`${torrent.title} [${torrent.quality ? torrent.quality : "unknown quality" }] [${torrent.seeders}/${torrent.leechers}]`', :value='key', :class='torrent.ratio === 3 ? "verde" : torrent.ratio === 2 ? "naranja" : "rojo"')
                    sup.item(:class='torrent.ratio === 3 ? "puntoVerde" : torrent.ratio === 2 ? "puntoNaranja" : "puntoRojo"')
                    span {{ torrent.title }} [{{ torrent.quality ? torrent.quality : 'quality unknown' }}] [{{ torrent.seeders }}/{{ torrent.leechers }}]
</template>

<style lang="scss" scoped>

.selector {
    width: 300px;
    position: absolute !important;
    top: 70px;
}

.fondo {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    z-index: 2;
    background-color: #000000b3;
}
.backdrop {
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    -webkit-mask-image: -webkit-gradient(linear, right top, left top, color-stop(1,rgba(0,0,0,1)), color-stop(0.5,rgba(0,0,0,1)), color-stop(0,rgba(0,0,0,0)));
}

.titleInfo {
    text-shadow: 2px 5px 2px rgba(0, 0, 0, 1);
    font-size: 45px;
    color: #fff;
    text-transform: uppercase;
    margin: 0px;
}

.contentInfo {
    position: absolute;
    top: 15%;
    left: 0;
    right: 0;
    margin: auto;
    max-width: 65%;
    color: white;
    background-color: #00000070;
    padding: 20px;
    box-shadow: 0 0 50px 15px #0000008c;
    border-radius: 20px;
    max-height: 65%;
    overflow: auto;
}

.genres {
    clear: both;
}

.fizq_mar0 {
    float: left;
    margin: 0px;
    text-shadow: 2px 5px 2px rgba(0, 0, 0, 1);
}

.sinopsis {
    clear: both;
    text-align: justify;
    color: #fff;
}

.icon {
    float: left;
    margin: 5px 10px;
}

.footer {
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 70px;
    left: 0;
    right: 0;
    margin: auto;
    max-width: 65%;
}

.verde {
    color: #3c763d !important;
    background-color: #dff0d8;
    border-color: #d6e9c6;
}

.verde:hover {
    background-color: #9bd69c !important;
}

.naranja {
    color: #8a6d3b !important;
    background-color: #fcf8e3;
    border-color: #faebcc;
}

.naranja:hover {
    background-color: #ffc761 !important;
}

.rojo {
    color: #a94442 !important;
    background-color: #f2dede;
    border-color: #ebccd1;
}

.rojo:hover {
    background-color: #ff9c9c !important;
}

.puntoVerde {
    background-color: #21ba45;
}

.puntoNaranja {
    background-color: #f2711c;
}

.puntoRojo {
    background-color: #db2828;
}
.badge {
    position: relative;
    vertical-align: middle;
    display: inline-block;
}

.item {
    height: 8px;
    width: 8px;
    padding: 0;
    position: absolute;
    left: 5px;
    top: 10px;
    border-radius: 50%;
    border: 1px solid #fff;
}

.cerrar {
  background: none;
  border: 0;
  box-sizing: border-box;
  color: transparent;
  cursor: pointer;
  line-height: 40px;
  margin: 100px 90% 0;
  outline: none;
  overflow: hidden;
  padding: 0;
  position: relative;
  font-size: 15px;
  text-transform: uppercase;
  transition: all 0.2s ease-in;
  width: 50px;
  z-index: 1;
}

.cerrar::before,
.cerrar::after {
  background-color: white;
  content: '';
  display: block;
  height: 1px;
  left: 0;
  position: absolute;
  transform-origin: center left;
  transition: all 0.2s ease-in;
  width: 100px;
  z-index: -1;
}

.cerrar::before {
  top: 0;
  transform: rotate(45deg);
}

.cerrar::after {
  bottom: 0;
  transform: rotate(-45deg);
}

.cerrar:hover {
  color: black;
}

.cerrar:hover::before,
.cerrar:hover::after {
  height: 30px;
  transform: rotate(0deg);
}

.play {
    position: relative;
    bottom: 15px;
    width: 180px;
    height: 70px;
    border: 2px solid white;
    border-radius: 10px;
    cursor: pointer;
    background-color: rgba(245, 245, 245, 0.699);
}

.el-icon-caret-right {
    font-size: 60px;
}

.actorImg {
    width: 120px;
}

.actors {
    width: 120px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    margin: 5px;
}

.actorTex {
    margin: 0px;
}

.filaActores {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

.el-tabs {
    color: #2c3e50;
    margin: auto;
    max-width: 1000px;
}

.filmImg {
    width: 250px;
}

.films {
    width: 250px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    margin: 5px;
}

.audio {
    display: none;
}

.commenting_part {
    display: flex;
    padding: 10px;
    background-color: aliceblue;
}

.user_avatar {
    width: 100px;
    height: 100px;
    float: left;
    margin-right: 10px;
}

.input_part {
    width: 90%;
    display: flex;
    align-items: center;
}

.btnSuccess {
    width: 50px;
    height: 50px;
}

.el-textarea {
    margin-right: 5px;
}

@media screen and (max-width: 700px) {
    .contentInfo {
        max-width: 100%;
        max-height: 70%;
        top: 0;
    }

    .play {
        width: 130px;
        height: 50px;
        bottom: 0;
    }

    .cerrar {
        font-size: 8px;
        line-height: 30px;
        width: 30px;
    }

    .user_avatar {
        display: none;
    }

    .btnSuccess {
        width: 100% !important;
        margin-top: 5px !important;
        border-radius: 0 !important;
    }

    .input_part {
        width: 100%;
        display: block;
    }
}

</style>

<script>
import store from '@/store.js';
import { mapGetters } from 'vuex';
import { SubmitComment, GetComments, GetHash, movieSee } from '@/constants/query.gql';
import commentCard from '@/components/comment.vue';
import movieCardVue from './movieCard.vue';
import helpers from '@/helpers/helpers.js';
import axios from 'axios';

export default {
    props: ['infoMovie'],
    components: {
        commentCard,
    },
    computed: {
        ...mapGetters([
            'movieInfo',
            'displayMovieInfo',
        ])
    },
    data() {
        return {
            value: '',
            disabled: 0,
            placeHolder: 'Select',
            audio: '',
            picture: '',
            comment: '',
        }
    },
    methods: {
        closeInfo() {
            this.$store.dispatch('display_movie_info', false);
            if (this.audio !== '')
                this.audio.pause();
        },
        play() {
            if (this.value !== '')
            {
                var torrent = '';
                var tipo = '';
                const name = this.movieInfo.title;
                const year = this.movieInfo.releaseDate;
                const torrentSelected = this.movieInfo.torrentsInfo[this.value];
                if (torrentSelected.hash && !torrentSelected.dlLink) {
                    torrent = torrentSelected.hash;
                    tipo = 'hash';
                } else if (torrentSelected.dlLink && !torrentSelected.hash) {
                    torrent = torrentSelected.dlLink;
                    tipo = 'dlLink';
                }
                this.$apollo.query({
                    query: GetHash,
                    variables: {
                        torrent: torrent,
                        tipo: tipo,
                        movieId: this.movieInfo.id,
                        name: name,
                        year: year,
                    }
                }).then(resp => {
                    if (resp.data.hash) {
                        this.$router.push('/player/' + resp.data.hash);
                        this.$store.dispatch('display_movie_info', false);
                        this.$apollo.mutate({
                            mutation: movieSee,
                            variables: {
                                movieId: this.movieInfo.id,
                            }
                        });
                    }
                    else {
                        this.$message({
                            type: 'error',
                            message: 'Error occurred while identifting the movie. Please try refreshing the page.'
                        })
                    }
                });
            }
        },
        sub_comment() {
            this.$apollo.mutate({
                mutation: SubmitComment,
                variables: {
                    movieId: parseInt(this.movieInfo.id, 10),
                    comment: this.comment,
                }
            }).then(({ data }) => {
                const token = helpers.parseToken(localStorage.getItem('token'));
                const comment = {
                    comment: this.comment,
                    login: token.login,
                    picture: token.picture,
                    id: token.id,
                }
                this.$store.dispatch('add_comment', comment);
                this.comment = '';
            }).catch((err) => {
                this.$message({
                    type: 'error',
                    message: err.graphQLErrors['0'].message,
                })
            })
        },
    },
    mounted() {
        this.picture = helpers.parseToken(localStorage.getItem('token')).picture;
        this.$apollo.query({
            query: GetComments,
            variables: {
                movieId: parseInt(this.movieInfo.id, 10),
            }
        }).then(({ data }) => {
            this.$store.dispatch('load_comments', data.getComments.comments);
        }).catch((err) => {
            this.ErrorHandler(err);
        })
        if (this.movieInfo.title === 'Avengers: Infinity War') {
            this.audio = new Audio('/mp3/bringmethanos.mp3');
            this.audio.play();
        } else if (this.movieInfo.title.toUpperCase() === 'DRAGON BALL SUPER: BROLY') {
            this.audio = new Audio('/mp3/dbz.mp3');
            this.audio.play();
        } else if (this.movieInfo.title.toUpperCase() === 'BOHEMIAN RHAPSODY') {
            this.audio = new Audio('/mp3/queen.mp3');
            this.audio.play();
        } else if (this.movieInfo.title.toUpperCase() === 'ONCE UPON A DEADPOOL') {
            this.audio = new Audio('/mp3/deadpool.mp3');
            this.audio.play();
        } else if (this.movieInfo.title.toUpperCase() === 'CREED II') {
            this.audio = new Audio('/mp3/rocky.mp3');
            this.audio.play();
        }
        if (this.movieInfo.torrentsInfo && this.movieInfo.torrentsInfo.length === 0)
            {
                this.disabled = 1;
                this.placeHolder = 'No torrents available'
            }
        else if (this.movieInfo.torrentsInfo && this.movieInfo.torrentsInfo.length > 0)
        {
            this.movieInfo.torrentsInfo.forEach((element, index) => {
                if (element.ratio === 3 && this.value === '')
                    this.value = index;
            });
            this.movieInfo.torrentsInfo.forEach((element, index) => {
                if (element.ratio === 2 && this.value === '')
                    this.value = index;
            });
            this.movieInfo.torrentsInfo.forEach((element, index) => {
                if (element.ratio === 1 && this.value === '')
                    this.value = index;
            });
            // Caso en el que el ratio esté a 0
        }
    },
    beforeDestroy() {
        if (this.audio !== '')
            this.audio.pause();
    }
}
</script>