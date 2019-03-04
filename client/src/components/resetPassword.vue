<template lang="pug">
.modal-backdrop
  .modal
    header.modal-header
      slot(name='header')
        | Forgot password
        button.btn-close(type='button', @click='close')
         | x
    section.modal-body
      slot(name='body')
          el-col(:span='24')
            el-form.demo-ruleForm(@submit.native.prevent="sendClose('ruleForm2')", :model='ruleForm2', status-icon='', :rules='rules2', ref='ruleForm2')
              el-form-item(label='Email :', prop='email')
                el-input(type='email', v-model='ruleForm2.email', autocomplete='off')
    footer.modal-footer
      slot(name='footer')
        .footer
          button.btn-green(type='button', @click='sendClose("ruleForm2")')
            | Send
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
    z-index: inherit;
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
.demo-ruleForm {
  margin-top: 0px;
}

</style>

<script>

import Helpers  from '../helpers/helpers.js';
import store from '@/store.js';
import { mapGetters } from 'vuex';
import { SendResetPassword } from '@/constants/query.gql';

  export default {
    store,
    name: 'modal',
    data() {
      const checkEmail = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('Please input the email'));
        }
        else if (!Helpers.validateEmail(value)){
          return callback(new Error('Invalid email'));
        }
        else {
          callback();
        }
      };
      return {
        ruleForm2: {
          email: '',
        },
        rules2: {
          email: [
            { validator: checkEmail, trigger : 'blur' }
          ]
        }
      }
    },
    apollo: {
    },
    methods: {
      async close() {
        this.$emit('close');
      },
      async sendClose(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$apollo.query({
              query: SendResetPassword,
              variables: {
                email: this.ruleForm2.email,
              }
            }).then(({data}) => {
              console.log('data', data);
              this.submitted = true;
              this.error = false;
              store.commit('FILL_SUCCESS', data.sendResetPassword);
              this.close();
            }).catch((error) => {
              this.$message({
                type: 'error',
                message: error.graphQLErrors[0].message,
              })
            })
          }
        });
      },
    },
  };
  
</script>