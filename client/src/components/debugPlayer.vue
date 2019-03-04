<template lang="pug">
  div#debug
    p State: {{state}}
    p(v-if="downloading")
      | File size: {{fileSize}} - 
      a.el-icon-download
      | {{downloadSpeed}} 
      a.el-icon-upload2
      | {{uploadSpeed}} -
      | Peers: {{peers}}/{{totalPeers}} -
      
    div(class="progress",id="progressbar", v-if="downloading")
      div(v-for="(item, index) in progress",
      :class="{'progress-bar progress-bar-striped bg-success': !(index % 2), progress: index % 2}",
      role="progressbar",
      aria-valuemin="0",
      aria-valuemax="100",
      :style="{ 'width': item + '%' }",
      :aria-valuenow="item")
      //- div(class="progress-bar progress-bar-striped bg-success progress-bar-animated", role="progressbar", aria-valuemin="0", aria-valuemax="100", style="width: 100%", aria-valuenow="100")
</template>

<style>
@-webkit-keyframes progress-bar-stripes {
  from {
    background-position: 40px 0;
  }
  to {
    background-position: 0 0;
  }
}
@-o-keyframes progress-bar-stripes {
  from {
    background-position: 40px 0;
  }
  to {
    background-position: 0 0;
  }
}
@keyframes progress-bar-stripes {
  from {
    background-position: 40px 0;
  }
  to {
    background-position: 0 0;
  }
}
.progress {
  display: flex;
  height: 20px;
  margin-bottom: 20px;
  overflow: hidden;
  background-color: #f5f5f5;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}
.progress-bar {
  float: left;
  width: 0%;
  height: 100%;
  font-size: 12px;
  line-height: 20px;
  color: #ffffff;
  text-align: center;
  background-color: #337ab7;
  -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
  -webkit-transition: width 0.6s ease;
  -o-transition: width 0.6s ease;
  transition: width 0.6s ease;
}
.progress-striped .progress-bar,
.progress-bar-striped {
  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
  background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
  -webkit-background-size: 40px 40px;
  background-size: 40px 40px;
}
.progress.active .progress-bar,
.progress-bar.active {
  -webkit-animation: progress-bar-stripes 2s linear infinite;
  -o-animation: progress-bar-stripes 2s linear infinite;
  animation: progress-bar-stripes 2s linear infinite;
}
.progress-bar-success {
  background-color: #5cb85c;
}
.progress-striped .progress-bar-success {
  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
  background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
}
.progress-bar-info {
  background-color: #5bc0de;
}
.progress-striped .progress-bar-info {
  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
  background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
}
.progress-bar-warning {
  background-color: #f0ad4e;
}
.progress-striped .progress-bar-warning {
  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
  background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
}
.progress-bar-danger {
  background-color: #d9534f;
}
.progress-striped .progress-bar-danger {
  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
  background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
}
</style>


<script>
export default {
  name: 'debugPlayer',
  props: ['metasrc', 'activate'],
  data() {
    return {
      upspeed: null,
      intervalSpeed: 1000,
      intervalFunction: null,
      downloadSpeed: '',
      uploadSpeed: '',
      progressTotal: 0,
      progress: [],
      peers: 0,
      totalPeers: 0,
      fileSize: 0,
      state: '',
      downloading: false,
    }
  },
  methods: {
    updateTorrentInfo: function(json) {
      // Source: https://stackoverflow.com/a/18650828
      function formatBytes(bytes,decimals) {
        if(bytes == 0) return '0 B/s';
        var k = 1024,
            dm = decimals <= 0 ? 0 : decimals || 2,
            sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s', 'EB/s', 'ZB/s', 'YB/s'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      }
      if (this.downloading) {
        this.downloadSpeed = formatBytes(json.speed.download);
        this.uploadSpeed = formatBytes(json.speed.upload);
        this.peers = json.peers.unchocked;
        this.totalPeers = json.peers.total;
      }
    },
    fetchJSON: async function() {
      try {
        const json = (await fetch(this.metasrc)).json();
        return json;
      } catch (err) {
        this.state = "Error fetching data"
        throw err;
      }
    },
    startInterval: function() {
      function humanFileSize(bytes, si) { // https://stackoverflow.com/a/14919494
        let thresh = si ? 1000 : 1024;
        if (Math.abs(bytes) < thresh) return bytes + ' B';
        let units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
        let u = -1;
        do {
          bytes /= thresh;
          ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1)+' '+units[u];
      }
      const vue = this;
      this.intervalFunction = setInterval(async () => {
        try {
          const json = await vue.fetchJSON();
          this.state = json.state;
          this.downloading = json.state === 'downloading' ? true : false;
          if (this.downloading) {
            vue.fileSize = humanFileSize(json.fileLength, true);
            vue.updateTorrentInfo(json.torrentEngine);
            vue.progressTotal = json.progressBar.fileLength;
            let temp = [];
            for (let i = 0; i < (json.progressBar.progress).length; i+= 1) {
              const percent = json.progressBar.progress[i] * 100 / json.progressBar.fileLength;
              temp.push(percent);
            }
            vue.progress = temp;
          } else {
            this.stopInterval();
          }
        } catch (err) {
          console.log(err);
          console.log('Error fetching data');
        }
      }, this.intervalSpeed);
    },
    stopInterval: function() {
      clearInterval(this.intervalFunction);
    }
  },
  mounted() {
    if (this.activate)
      this.startInterval();
  },
  beforeDestroy() {
    this.stopInterval();
  },
  watch: {
    activate: function(value) {
      if (value) {
        this.startInterval();
      } else {
        this.stopInterval();
      }
    }
  },
}
</script>
