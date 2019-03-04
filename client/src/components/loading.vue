<template lang="pug">
    div
        .loading
            each val in ["H", "Y", "P", "E", "R", "T", "U", "B", "E"]
                span= val
</template>

<style lang="scss" scoped>
.loading{
  font:26px/1.5 Monospace;
  color:#FFE05D;
  perspective:100px;
  >span{
    animation:flip 2s infinite;
    display: inline-block;
    transform-origin:50% 50% -10px;
    transform-style: preserve-3d;
    @for $i from 1 to 10{
      &:nth-child(#{$i}){
        animation-delay:$i/10+s;
      }
    }
  }
}
@keyframes flip{
  to{
    transform: rotateX(1turn);
  }
}

body{
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: #000;
}
</style>

<script>
    export default {
        //
        data() {
            return {
                //
            }
        },
    }
</script>