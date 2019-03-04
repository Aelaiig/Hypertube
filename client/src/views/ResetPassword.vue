<template lang="pug">
el-row
  el-row.background
    img(v-bind:src="getBackgrounds")
  el-row.topBackground
    el-row
      el-col(:xs="{span: 22, offset: 1}" :sm="{span: 11, offset: 6}" :md="{span: 11, offset: 6}" :lg="{span: 11, offset: 6}" :xl="{span: 11, offset: 6}")
        el-form.demo-ruleForm(@submit.native.prevent="submitForm('ruleForm3')", :model='ruleForm3', status-icon='', :rules='rules3', ref='ruleForm3', label-width='30%')
          el-row.signup1
              el-form-item(label='Password', prop='password')
                el-input(type='password', v-model='ruleForm3.password', autocomplete='off')
              el-form-item(label='Confirm password', prop='confirmPassword')
                el-input(type='password', v-model='ruleForm3.confirmPassword', autocomplete='off')
          el-row.signupButtons
            el-input(type='submit') Submit
            el-button(@click="resetForm('ruleForm3')") Reset
      .el-alert(v-if="error" type="error" title="error alert" class="error") {{ error }}
</template>

<style scoped>

.signup1 {
  padding-left: 2%;
  padding-right: 2%;
}

</style>


<script>
 // this.$routes.params.authKey
import Helpers  from '../helpers/helpers.js';
import { ResetPassword, GetBackgrounds } from '../constants/query.gql';
import store from '@/store.js';
import { mapGetters } from 'vuex';
import Validator from 'validator';

  export default {
    store,
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the password'));
        } else if (!Helpers.validatePassword(value)) {
          return callback(new Error('Password must contain more than 8 characters, lowercase, uppercase, numbers, and special characters. All without space'));
        } else {
          if (this.ruleForm3.confirmPassword !== '') {
            this.$refs.ruleForm3.validateField('confirmPassword');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the password again'));
        } else if (value !== this.ruleForm3.password) {
          callback(new Error('Two inputs don\'t match!'));
        } else {
          callback();
        }
      };
      return {
        error: false,
        ruleForm3: {
          password: '',
          confirmPassword: '',
        },
        rules3: {
            password: [
              { validator: validatePass, trigger: 'blur' }
            ],
            confirmPassword: [
              { validator: validatePass2, trigger: 'blur' }
          ],
        },
        getBackgrounds: '',
        isModalVisible: false,
        backgroundAvatar: '',
      };
    },
    apollo: {
      getBackgrounds: {
        query: GetBackgrounds,
        update: result => result.getBackgrounds
      }
    },
    methods: {
      submitForm(formName) {
        console.log('submitting form');
        this.$refs[formName].validate((valid) => {
          if (!valid) return null;
          this.$apollo.mutate({
            mutation: ResetPassword,
            variables: {
              password: this.ruleForm3.password,
              authKey: this.$route.params.authKey,
            }
          }).then(({data}) => {
            console.log('data', data.resetPassword);
            if (data.resetPassword === 'true') {
              store.commit('FILL_SUCCESS', 'Password modified successfully');
              this.$router.push('/signin');
            }
            this.submitted = true;
            this.error = false;
          }).catch((error) => {
            this.ErrorHandler(error);
          })
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
