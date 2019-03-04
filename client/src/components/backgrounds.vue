<template lang="pug">
el-row.background
  img(v-bind:src="getBackgrounds")
</template>

<script>
import { GetBackgrounds } from '../constants/query.gql';

export default {
  data() {
    return {
       getBackgrounds: '',
     }
  },
  apollo: {
      getBackgrounds: {
        query: GetBackgrounds,
        update: result => result.getBackgrounds
      }
    },
}
</script>