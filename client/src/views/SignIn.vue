<template lang="pug">
el-row
    backgrounds
    el-row.topBackground
      resetPassword(v-show='isModalVisible', @close='closeModal')
      el-row
        el-col(:xs="{span: 22, offset: 1}" :sm="{span: 11, offset: 6}" :md="{span: 11, offset: 6}" :lg="{span: 11, offset: 6}" :xl="{span: 11, offset: 6}")
          el-form.demo-ruleForm(:model='ruleForm2', status-icon='', :rules='rules2', ref='ruleForm2', label-width='30%')
            el-row.signup1
              h1 Sign In
              el-col(:span='24')
                el-form-item(label='Login', prop='login')
                  el-input(type='text', v-model='ruleForm2.login', autocomplete='off')
                el-form-item(label='Password', prop='password')
                  el-input(type='password', v-model='ruleForm2.password', autocomplete='off')
            el-row.signupButtons.linksAuth
              a(href="http://localhost:5500/auth/connect") 
                img(src='github.png')
              a(href="http://localhost:5500/auth42/connect") 
                img(src='fortyTwo.png').logo
              a(href="http://localhost:5500/authGoogle/connect") 
                img(src='google.png').logo
            el-row.signupButtons.links
              a(@click='showModal') Forgot password ?
              a(href='/signup') Create account
              div(v-konami:opts.custom="easterEgg")
            el-row.signupButtons
              el-button(type='primary', @click="submitForm('ruleForm2')") Submit
              el-button(@click="resetForm('ruleForm2')") Reset              
            .el-alert(v-if="error" type="error" title="error alert" class="error") {{ error }}
</template>

<style scoped>

h1 {
  color: white;
}

.links {
  display: flex;
  flex-direction: column;
}

.linksAuth {
  display: flex;
  justify-content: space-around;
}
.logo {
  width: 80px;
}

.signupButtons a {
  display: block;
  margin-bottom: 2%;
  color: #2c3e50;
  text-decoration: none;
}
.signupButtons a:hover {
  text-decoration: underline;
}

</style>

<script>

import backgrounds from '@/components/backgrounds.vue';
import resetPassword from '@/components/resetPassword.vue';
import { GetBackgrounds, SignIn } from '@/constants/query.gql';
import store from '@/store.js';
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  name: 'Konami',
  store,
  components: {
    resetPassword,
    backgrounds,
  },
  computed: {
    ...mapGetters([
        'messageError',
        'messageSuccess',
      ])
  },
  data() {
    let checkLogin = (rule, value, callback) => {
      if (!value) {
          return callback(new Error('Please fill the login input.'));
        }
        else {
          callback();
        }
    };
    let checkPassword = (rule, value, callback) => {
      if (!value) {
          return callback(new Error('Please fill the password input.'));
        }
        else {
          callback();
        }
    };
    return {
      isModalVisible: false,
      error: false,
      ruleForm2: {
        login: '',
        password: '',
      },
      rules2: {
        login: [
          { validator: checkLogin, trigger: 'blur' }
        ],
        password: [
          { validator: checkPassword, trigger: 'blur' }
        ]
      },
      opts: {
        timeout: 3000,
        chain: '38-38-40-40-37-39-37-39-66-65'
      },
    }
    
  },
  mounted() {
    if (this.messageError !== '') {
      this.displayMessageError();
      store.commit('FILL_ERROR', '');
    }
    if (this.messageSuccess !== '') {
      this.displayMessageSuccess();
      store.commit('FILL_SUCCESS', '');
    }
    if (this.$route.query.error)
      this.error = this.$route.query.error;
    else
      this.error = '';
  },
  methods: {
    easterEgg () {
        alert('OUTSTANDING');
    },
    displayMessageError() {
      this.$message({
        showClose: true,
        message: this.messageError,
        type: 'error'
      });
    },
    displayMessageSuccess() {
      this.$message({
        showClose: true,
        message: this.messageSuccess,
        type: 'success'
      });
    },
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      if (this.messageError !== '') {
        this.displayMessageError();
        store.commit('FILL_ERROR', '');
      }
      if (this.messageSuccess !== '') {
        this.displayMessageSuccess();
        store.commit('FILL_SUCCESS', '');
      }
      this.isModalVisible = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$apollo.query({
            query: SignIn,
            variables: {
              login: this.ruleForm2.login,
              password: this.ruleForm2.password,
            }
          }).then(async ({data}) => {
            await this.saveToken(data.signIn);
            this.$router.push('/');
            this.submitted = true;
            this.error = false;
            this.$store.dispatch('new_token_created', true);
          }).catch((error) => {
            this.ErrorHandler(error);
          })
        } else {
          return false;
        }
      });
    },
    saveToken(token) {
      localStorage.setItem('user-token', token);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
    
  }
}
	
</script>
