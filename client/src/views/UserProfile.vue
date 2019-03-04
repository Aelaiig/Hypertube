<template lang="pug">
    div
        .userCard(v-if='userInfo')
            el-row
                el-col(:xs='24', :sm='24', :md='{ span: 10, offset: 7 }')
                    el-container
                        el-header
                            img.avatar(:src='userInfo.picture')
                        el-main
                            p.bold {{ userInfo.login }}
                            p {{ userInfo.firstname }}  {{ userInfo.lastname }}
        p(v-else) User not found
</template>

<style lang="scss" scoped>
  .el-header, .el-footer {
    background-color: rgb(36, 45, 56);
    color: #333;
    text-align: center;
    line-height: 60px;
    padding: 5px;
  }

  .el-main {
    background-color: rgb(247, 247, 247);
  }

  .avatar {
      height: 100%;
      width: auto;
      margin: auto;
  }

  .bold {
      font-weight: bold;
  }
</style>

<script>
import { GetUserInfo } from '@/constants/query.gql';

export default {
    data () {
        return {
            userInfo: '',
        }
    },
    apollo: {
        userInfo: {
            query: GetUserInfo,
            update: result => result.getUserInfo,
            variables() {
                return {
                    id: this.$route.params.id,
                }
            },
            error(err) {
                this.ErrorHandler(err);
            }
        }
    },
}
</script>
