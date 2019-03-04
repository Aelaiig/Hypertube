<template lang="pug">
.modal-backdrop
  .modal
    header.modal-header
      slot(name='header')
        | Choose you avatar
        button.btn-close(type='button', @click='chooseClose')
         | x
    section.modal-body
      slot(name='body')
        el-row.avatars
          el-col.colAvatar(:xs="{span: 5}" :sm="{span: 5}" :md="{span: 4}", v-for="item in getAvatars",)
            img.avatar(v-bind:src="item", @click='selectAvatar(item)')
    footer.modal-footer
      slot(name='footer')
        .footer
          img.avatarChosen(v-bind:src='selectedAvatar')
          button.btn-green(type='button', @click='chooseClose')
            | Choose
</template>

<style scoped>

.colAvatar {
  padding: 1px;
}

.avatars {
  width: 100%;
}

.avatar, .avatarChosen {
  display: block;
  width: 40px;
  height: 40px;
  margin: 1px;
}

.footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: inherit;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  }

  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-header {
    border-bottom: 1px solid #eeeeee;
    color: #4AAE9B;
    justify-content: space-between;
  }

  .modal-footer {
    border-top: 1px solid #eeeeee;
    justify-content: flex-end;
  }

  .modal-body {
    position: relative;
    padding: 20px 10px;
    display: flex;
    justify-content: space-between;
  }

  .btn-close {
    border: none;
    font-size: 20px;
    padding: 0px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
  }

  .btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
  }

</style>

<script>
import store from '@/store.js';
import { GetAvatars , SelectedAvatar } from '../constants/query.gql';

  export default {
    store,
    name: 'modal',
    data() {
      return {
        getAvatars: [],
        selectedAvatar: '',
      }
    },
    apollo: {
      getAvatars: {
        query: GetAvatars,
        update: result => result.getAvatars
      },
      selectedAvatar: {
        query: SelectedAvatar,
        update: result => result.selectedAvatar
      }
    },
    methods: {
      selectAvatar(avatar) {
        this.selectedAvatar = avatar;
      },
      chooseClose() {
        store.commit('FILL_SELECTEDAVATAR', this.selectedAvatar);
        this.$emit('close');
      }
    },
  };
  
</script>

