<template lang="pug">
  .videojs
    .video-inner-container
      video(
        id="myPlayer"
        controls
        preload="auto"
        width="640"
        height="264"
        class="video-js vjs-fluid vjs-default-skin vjs-big-play-centered"
        data-setup='{}'
      )
</template>

<script>
import 'video.js/dist/video-js.min.css';

const videojs = require('video.js/dist/video.js');

export default {
  name: 'VideoJS',
  data() {
    return {
      player: '',
      playerStarted: false,
      oldStart: 0,
    };
  },
  props: ['selectedSource', 'duration', 'subtitles'],
  watch: {
    selectedSource: function(info, oldVal) {
      if (!this.playerStarted) {
        this.playerStarted = true;
        this.playerStart();
        return;
      }
      const player = this.player;
      player.src(info);
      player.currentSrc = info;
      if ((info.src).includes('raw')) {
        const time = player.currentTime();
        for (let j = 0; j < this.player.textTracks().tracks_.length; j += 1) {
          if (this.player.textTracks()[j]) {
            for(let i = 0; i < this.player.textTracks()[j].cues.length; i += 1) {
              const el = this.player.textTracks()[j].cues.cues_[i];
              el.startTime = el.startTime + this.player.start;
              el.endTime = el.endTime + this.player.start;
            }
          }
        }
        player.currentTime = player.oldCurrentTime;
        setTimeout(() => {
          player.currentTime(time);
        }, 100);
      } else {
        this.player.start = 0;
        const time = player.currentTime();
        player.currentTime = player.newCurrentTime;
        player.currentTime(time);
      }
      setTimeout(() => {
        player.play();
      }, 500);
    },
  },
  mounted() {
    window.playerEvents = this;
    this.playerInitialize();
  },
  beforeDestroy() {
    this.player.dispose();
  },
  methods: {
    playerInitialize() {
      this.player = videojs('myPlayer', {
        html5: {
          nativeTextTracks: false,
        },
      });
      const truethis = this;
      const { player } = this;
      player.start = 0;
      player.isStarted = true;
      player.oldCurrentTime = player.currentTime;
      player.newCurrentTime = (time) => {
        if (time == undefined) {
          return player.oldCurrentTime() + player.start;
        }
        const timeOffset = time - player.start;
        for (let j = 0; j < truethis.player.textTracks().tracks_.length; j += 1) {
          if (truethis.player.textTracks()[j]) {
            for(let i = 0; i < truethis.player.textTracks()[j].cues.length; i += 1) {
              const el = truethis.player.textTracks()[j].cues.cues_[i];
              el.startTime = el.startTime - timeOffset;
              el.endTime = el.endTime - timeOffset;
            }
          }
        }
        truethis.oldStart = player.start;
        player.start = time;
        player.src(`${player.currentSrc.src}?seek=${time}`);
        player.oldCurrentTime(0);
        player.player_.scrubbing_ = false;
        // TODO: A remettre apres la correction :D
        // player.play();
        return this;
      };
    },
    playerStart() {
      const { player } = this;
      const { duration } = this;
      try {
        player.src(this.selectedSource);
        player.currentSrc = this.selectedSource;
        player.duration = () => {
          return duration;
        };
        if (this.subtitles) {
          Object.keys(this.subtitles).forEach((i) => {
            if (this.subtitles[i].langcode === 'es' || this.subtitles[i].langcode === 'fr' || this.subtitles[i].langcode === 'en') {
              // console.log(`Rajout du sous titre ${this.subtitles[i].lang}`);
              player.addRemoteTextTrack({
                kind: 'captions',
                label: this.subtitles[i].lang,
                language: this.subtitles[i].langcode,
                src: this.subtitles[i].vtt,
              }, true)
            }
          });
        }
        player.currentTime = player.newCurrentTime;
      } catch (err) {
        console.log(err);
      }
    },
  },
};

</script>
