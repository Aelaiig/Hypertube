<template lang="pug">
  div
    div(
      v-loading="loading",
      element-loading-text="Waiting for metadata...",
      element-loading-spinner="el-icon-loading",
      element-loading-background="rgba(0, 0, 0, 0.8)")
      div#video(
        v-loading="preloading",
        element-loading-text="Loading movie, please wait...",
        element-loading-spinner="el-icon-loading",
        element-loading-background="rgba(0, 0, 0, 0.8)")
        VideoJS(:selectedSource="getSelectedSourceInfo()", :duration='duration', :subtitles='subtitles')
        el-select(v-if="sources", v-model="selectedSource")
          el-option(v-for="item in sources", :label="item.label", :value="item.label")
      br
      el-button(v-on:click="show = !show") Debug
      el-button(v-if="preloading" v-on:click="preloading = false") Start anyway
      el-collapse-transition
        div#debuginfo(v-show="show")
          debugPlayer(:activate="show", :metasrc="urlMetadata")
</template>

<style lang="scss">
</style>

<script>
import VideoJS from '../components/player.vue';
import debugPlayer from '../components/debugPlayer.vue';

const OS = require('opensubtitles-api');

const OpenSubtitles = new OS({
  useragent: 'Popcorn Time NodeJS',
  username: '',
  password: '',
  ssl: true,
});

export default {
  components: {
    VideoJS,
    debugPlayer,
  },
  data() {
    return {
      loading: true,
      preloading: false,
      urlMetadata: '',
      selectedSource: null,
      sources: null,
      duration: null,
      show: false,
      imdbid: '',
      subtitles: {},
    };
  },
  mounted() {
    this.urlMetadata = `${process.env.VUE_APP_SERVER_PLAYER}/video/${this.$route.params.hash}/meta.json`;
    this.retryUntilReady();
  },
  methods: {
    errorId() {
      this.$message({
        showClose: true,
        message: 'It seems there is a problem connecting to the player backend, please contact the admins',
        type: 'error',
      });
    },
    errorFetching() {
      this.$message({
        showClose: true,
        message: 'It seems there is a problem with the video ID, please go back to the home screen and click play again',
        type: 'error',
      });
    },
    errorMetadata() {
      this.$message({
        message: 'Problem with ffprobe, maybe the file is corrupted. Please go back and try another source.',
        type: 'error',
      });
    },
    getSelectedSourceInfo() {
      if (!this.sources)
        return;
      return (this.sources[this.sources.findIndex(x => x.label === this.selectedSource)]);
    },
    async fetchJSON() {
      try {
        const json = (await fetch(this.urlMetadata)).json();
        return json;
      } catch (err) {
        this.errorId();
        throw err;
      }
    },
    async retry(fn, retriesLeft = -1, interval = 3000, exponential = false) {
      try {
        if (this.$route.name !== 'player') return null;
        if (!retriesLeft) throw new Error('No retry left');
        const val = await fn();
        if (val.err === 'ID invalid or too old')
        {
          this.errorFetching();
          throw 'ID invalid or too old, please go back to home menu and try playing your video again';
        }
        if (val.err === 'Problem with ffprobe, maybe the file is corrupted. Please try another source.') {
          this.errorMetadata();
          throw 'Problem with ffprobe, maybe the file is corrupted. Please try another source.';
        }
        if (!val.video)
          throw 'Waiting for metadata';
        return val;
      } catch (error) {
        // if (this.$route.name !== 'player') console.log(error);
        if (retriesLeft) {
          // console.log(`Retries left: ${retriesLeft}`);
          await new Promise(r => setTimeout(r, interval));
          return this.retry(fn, retriesLeft - 1, exponential ? interval * 2 : interval, exponential);
        } else throw new Error('No more retry left, please retry later.');
      }
    },
    async retryUntilReady() {
      try {
        const json = await this.retry(this.fetchJSON);
        this.duration = json.video.duration;
        this.sources = json.video.sources;
        this.imdbid = json.imdbid;
        this.subtitles = await OpenSubtitles.search({
          imdbid: this.imdbid,
        });
        this.selectedSource = json.video.sources[2].label;
        this.loading = false;
        this.preloading = true;
        await this.retry2(this.preloadingFunc, -1);
        this.preloading = false;
      } catch (err) {
        if (this.$route.name !== 'player') return null;
        this.$message({
          type: 'error',
          message: err.message,
        })
        this.$router.push('/');
      }
    },
    async retry2(fn, retriesLeft = 5, interval = 1000, exponential = false) {
      try {
        const val = await fn();
        // console.log(val);
        return val;
      } catch (error) {
        if (retriesLeft && this.preloading) {
          await new Promise(r => setTimeout(r, interval));
          return this.retry2(fn, retriesLeft - 1, exponential ? interval * 2 : interval, exponential);
        }
      }
    },
    async preloadingFunc(promise) {
      // console.log('Waiting for 5%');
      const json = await this.fetchJSON();
      if (json.state === 'downloading') {
        if (json.progressBar) {
          const limit = json.progressBar.fileLength / 5;
          if (json.progressBar.progress[0] > limit) return true;
        }
      } else return true;
      throw 'Still no info or not 5%';
    },
  },
};
</script>
