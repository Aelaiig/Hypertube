<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>

export default {
  mounted() {
    if (localStorage.getItem('user-token')) {
      try {
        const userImg = JSON.parse(atob(localStorage.getItem('user-token').split('.')[1])).picture;
        const userLogin = JSON.parse(atob(localStorage.getItem('user-token').split('.')[1])).login;
        this.$emit('identity', { userImg, userLogin });
      } catch (error) {
        localStorage.removeItem('user-token');
        this.$router.push('/signin');
      }
    }
  }
}
</script>