<template lang="pug">
el-row
    el-row.background
      img(v-bind:src="getBackgrounds")
    el-row.topBackground
      avatar(v-show='isModalVisible', @close='closeModal')
      el-row
        h1 
        el-col(:xs="{span: 22, offset: 1}" :sm="{span: 11, offset: 6}" :md="{span: 11, offset: 6}" :lg="{span: 11, offset: 6}" :xl="{span: 11, offset: 6}")
          el-form.demo-ruleForm(@submit.native.prevent='submitForm("ruleForm2")' :model='ruleForm2', status-icon='', :rules='rules2', ref='ruleForm2', label-width='30%')
            el-row.signup1
              el-col(:span='14')
                el-form-item(label='Login', prop='login')
                  el-input(type='text', v-model='ruleForm2.login', autocomplete='off')
                el-form-item(label='Firstname', prop='firstname')
                  el-input(type='text', v-model='ruleForm2.firstname', autocomplete='off')
                el-form-item(label='Lastname', prop='lastname')
                  el-input(type='text', v-model='ruleForm2.lastname', autocomplete='off')
              el-col(:span='10')
                  button.btn#avatar(type='button', @click='showModal', v-bind:style="backgroundAvatar")
                   p.el-icon-plus            
            el-row.signup2
              el-col(:span='24')
                el-form-item(label='Email', prop='email')
                  el-input(type='email', v-model='ruleForm2.email', autocomplete='off')
            el-row.signupButtons
              el-input.submit(type='submit') Submit
              el-input(type='reset' on-click="resetForm('ruleForm2')")
        .el-alert(v-if="error" type="error" title="error alert" class="error") {{ error }}
</template>

<style lang='scss'>

  .signupButtons input {
    width: 50%;
  }

  .submit input {
    border-color: #409EFF;
    background-color:  #409EFF;
    color: white;
  }

  #avatar {
    min-width: 100px;
    min-height: 100px;
    max-width: 165px;
    max-height: 165px;
    width: 10vw;
    height: 10vw;
    background-size: contain;
    background-repeat: no-repeat;
    border: 1px solid #dcdfe6;
  }

  .background {
    padding: 0;
    margin: 0;
    position: absolute !important;
    z-index: 1;
    width: 100%;
    background-color: black;
  }

  .background img{
    width: 100%;
    opacity: 0.8;
    display: block;
    box-shadow: 0px -3px 5px black;
  }

  .topBackground {
    margin: auto;
    position: fixed;
    z-index: 2;
  }

  .ResetCssCol {
    padding: 0px !important;
    background-color: black;
    width: 100%;
  }

  .demo-ruleForm {
    margin-top: 35%;
  }

  @media screen and (max-width: 500px) {
    .demo-ruleForm {
      margin-top: 0%;
    }
  }
  
  .signup1 {
    padding-top: 5%;
    border-top: 1px solid black;
    border-left: 1px solid black; 
    border-right: 1px solid black;
    background-color: black;
    opacity: 0.85;
  }

  .signup2 {
    border-left: 1px solid black; 
    border-right: 1px solid black;
    background-color: black;
    opacity: 0.85; 
  }

  .signupButtons {
    border-left: 1px solid black; 
    border-right: 1px solid black; 
    border-bottom: 1px solid black;
    background-color: black;
    opacity: 0.85;
    padding-bottom: 5%;
    border-radius: 0px 0px 1px 1px;
    display: flex;
    justify-content: space-around;
  }
 
  .el-form-item__label {
    text-align: left !important;

  }
  .el-form-item__error {
    position: relative !important;
  }
  .el-col {
    padding: 1%;
    border-radius: 4px;
  }

  .grid-content {
    margin: auto;
  }

</style>

<script>

import avatar from '@/components/avatar.vue';
import Helpers  from '../helpers/helpers.js';
import { SignUpOmniauth, GetBackgrounds } from '../constants/query.gql';
import store from '@/store.js';
import { mapGetters } from 'vuex';
import Validator from 'validator';

  export default {
    store,
    components: {
      avatar,
    },
    computed: {
      ...mapGetters([
          'selectedAvatar'
        ])
    },
    data() {
      let checkLogin = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('Please input the login'));
        } if (value.match(/[\s\n\t]+/g)) {
          return callback(new Error('Whitespaces not allowed'));
        } else {
          callback();
        }
      };
      let checkFirstname = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('Please input the Firstname'));
        }
        if (!Validator.isAlpha(value) || value.match(/[\s\n\t]+/g)) {
          return callback(new Error('Only alpha characters'));
        }
        else {
          callback();
        }
      };
      let checkLastname = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('Please input the lastname'));
        }
        if (!Validator.isAlpha(value) || value.match(/[\s\n\t]+/g)) {
          return callback(new Error('Only alpha characters'));
        }
        else {
          callback();
        }
      };
      let checkEmail = (rule, value, callback) => {
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
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the password'));
        } else if (!Helpers.validatePassword(value)) {
          return callback(new Error('Password must contain more than 8 characters, lowercase, uppercase, numbers, and special characters. All without space'));
        } else {
          if (this.ruleForm2.confirmPassword !== '') {
            this.$refs.ruleForm2.validateField('confirmPassword');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the password again'));
        } else if (value !== this.ruleForm2.password) {
          callback(new Error('Two inputs don\'t match!'));
        } else {
          callback();
        }
      };
      return {
        error: false,
        ruleForm2: {
          login: this.$route.query.login,
          firstname: this.$route.query.firstname,
          lastname: this.$route.query.lastname,
          email: this.$route.query.email,
        },
        rules2: {
            login: [
              { validator: checkLogin, trigger: 'blur' }
            ],
            firstname: [
              { validator: checkFirstname, trigger: 'blur' }
            ],
            lastname: [
              { validator: checkLastname, trigger: 'blur' }
            ],
            email: [
              { validator: checkEmail, trigger: 'blur' }
            ],
        },
        getBackgrounds: '',
        isModalVisible: false,
        backgroundAvatar: '',
        authKey: this.$route.query.authKey,
      };
    },
    apollo: {
      getBackgrounds: {
        query: GetBackgrounds,
        update: result => result.getBackgrounds
      }
    },
    methods: {
      showModal() {
        this.isModalVisible = true;
      },
      closeModal() {
        this.backgroundAvatar = `background-image: url('${this.selectedAvatar}')`;
        this.isModalVisible = false;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$apollo.mutate({
              mutation: SignUpOmniauth,
              variables: {
                authKey: this.authKey, 
                login: this.ruleForm2.login,
                firstname: this.ruleForm2.firstname,
                lastname: this.ruleForm2.lastname,
                email: this.ruleForm2.email,
                picture: this.selectedAvatar
              }
            }).then(async ({data}) => {
              this.submitted = true;
              this.error = false;
              await this.saveToken(data.signUpOmniauth);
              this.$store.dispatch('new_token_created', true);
              this.$router.push('/');
            }).catch((error) => {
              this.ErrorHandler(error);
            })
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
