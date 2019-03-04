<template lang='pug'>
  #app
    .navbar
      .topnav#principal
        router-link.nav-link(to="/") Home
        router-link.nav-link(v-if="newTokenCreated || token", to="/settings") Settings
        a.danger(v-if="newTokenCreated || token", @click="logout") Logout
        .identity(v-if="token")
          img.avatar(:src="userImg")
          h3.login {{ userLogin }}
        a.icon
          #btn(@click="toggle")
            -for (var x=0; x<3; x++)
              span
    router-view(@identity="changeIdentidad")
</template>

<style lang="scss">
.router-link-exact-active {
  background-color: #4AAE9B;
}

.topnav {
  overflow: hidden;
  background-color: #333;
}

.topnav .nav-link {
  float: left;
  display: block;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
}

.topnav .nav-link:hover {
  background-color: #ddd;
  color: black;
  transition: all .3s;
}

.topnav .icon {
  display: none;
}

.danger {
  background-color: #f56c6c;
  float: right;
  display: block;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
  cursor: pointer;
}

.danger:hover {
  background-color: #ff9f9f;
  color: #d2d2d2;
}

.identity {
  float: right;
  display: flex;
  align-items: center;
}

.avatar {
  height: 45px;
  border-radius: 50%;
  margin-top: 3px;
}

.login {
    color: #f2f2f2;
    font-size: 17px;
    margin: 0 15px 0 10px;
}

@media screen and (max-width: 775px) {
  .identity {
    display: none;
  }
}

@media screen and (max-width: 700px) {
  .topnav a:not(:first-child) {display: none;}
  .topnav a.icon {
    float: right;
    display: block;
  }
  .topnav.responsive {position: relative;}
  .topnav.responsive .icon {
    position: absolute;
    right: 0;
    top: 0;
  }
  .topnav.responsive a {
    float: none;
    display: block;
    text-align: left;
  }
  .el-icon-more {
    font-size: 30px;
    color: antiquewhite;
  }
}
body {
  width: 100%;
  height: 100%;
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  background-color: black;
}

.logout {
  float: left;
  margin: 10px !important;
  line-height: 0;
}

#btn {
  position: relative;
  width: 35px;
  height: 35px;
  top: 20px;
  right: 0;
  transform: translate(-50%, -50%);
  cursor: pointer;
  background: white;
  border-radius: 50%;
  border: none;
  outline: none;
}
#btn span {
  position: absolute;
  width: 20px;
  height: 4px;
  top: 50%;
  left: 50%;
  background: #262626;
  border-radius: 2px;
  overflow: hidden;
  transition: all 0.3s linear;
}
#btn span::before {
  content: "";
  position: absolute;
  width: 0;
  height: 100%;
  top: 0;
  right: 0;
  background: gray;
  transition: all 0.3s linear;
}
#btn span:nth-child(1) {
  animation: span-first-off 0.5s ease-in-out;
  animation-fill-mode: forwards;
}
#btn span:nth-child(2) {
  animation: span-second-off 0.5s ease-in-out;
  animation-fill-mode: forwards;
}
#btn span:nth-child(3) {
  animation: span-third-off 0.5s ease-in-out;
  animation-fill-mode: forwards;
}

#btn.on:hover span::before {
  width: 100%;
  transition: all 0.3s linear;
}
#btn.on span:nth-child(1) {
  animation: span-first-on 0.5s ease-in-out;
  animation-fill-mode: forwards;
}
#btn.on span:nth-child(2) {
  animation: span-second-on 0.5s ease-in-out;
  animation-fill-mode: forwards;
}
#btn.on span:nth-child(3) {
  animation: span-third-on 0.5s ease-in-out;
  animation-fill-mode: forwards;
}

@keyframes span-first-on {
  0% {
    transform: translate(-50%, -300%);
  }
  30% {
    transform: translate(-50%, -50%);
  }
  100% {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
}
@keyframes span-first-off {
  0% {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
  30% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -300%);
  }
}
@keyframes span-second-on {
  0% {
    transform: translate(-50%, -50%);
  }
  25% {
    background: gray;
  }
  50% {
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    transform: translate(-150%, -50%) scale(0);
  }
}
@keyframes span-second-off {
  0% {
    transform: translate(-150%, -50%) scale(0);
  }
  25% {
    background: gray;
  }
  50% {
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    transform: translate(-50%, -50%);
  }
}
@keyframes span-third-on {
  0% {
    transform: translate(-50%, 200%);
  }
  30% {
    transform: translate(-50%, -50%);
  }
  100% {
    transform: translate(-50%, -50%) rotate(45deg);
  }
}
@keyframes span-third-off {
  0% {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  30% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, 200%);
  }
}

</style>

<script>
import store from '@/store.js';
import { mapGetters } from 'vuex';

export default {
  store,
  data() {
    return {
      active: 'Home',
      userImg: '',
      userLogin: '',
      token: false,
    }
  },
  computed: {
      ...mapGetters([
          // 'authorizationRequire'
          'newTokenCreated'
        ])
  },
  methods: {
    logout() {
      localStorage.removeItem('user-token');
      this.$store.dispatch('new_token_created', false);
      this.token = false;
      this.$router.push('/signin');
    },
    toggle() {
      var e = document.getElementById('btn');
      var x = document.getElementById("principal");
      if (x.className === "topnav") {
        x.className += " responsive";
        e.classList.add('on');
      } else {
        x.className = "topnav";
        e.classList.remove('on');
      }
    },
    changeIdentidad(datos) {
      this.token = true;
      this.userImg = datos.userImg;
      this.userLogin = datos.userLogin;
    }
  }  
}

</script>
