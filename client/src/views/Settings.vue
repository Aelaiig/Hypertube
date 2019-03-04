<template lang="pug">
    el-row
        el-col(:xs='24', :sm='24', :md='{ span: 12, offset: 6 }')
            el-container.settings
                el-aside.aside
                    el-menu(default-active='0', @select='handleMenuSelect')
                        el-menu-item(index='0')
                            i(class='el-icon-setting')
                            span.texto General
                        el-menu-item(v-if='strategy === "locale"', index='1')
                            i(class='el-icon-edit')
                            span.texto Change password
                        el-menu-item(index='2')
                            i(class='el-icon-edit-outline')
                            span.texto Change e-mail
                el-container
                    el-header
                        h1 {{ menus[selectedMenu] }}
                    el-main
                        div(v-if='selectedMenu === "0"')
                            avatar(v-show='isModalVisible', @close='closeModal')
                            button.avatarBtn.btn#avatar(type='button', @click='showModal', v-bind:style="backgroundAvatar")
                                p.el-icon-plus
                        el-form(v-model='formGeneral', v-if='selectedMenu === "0"', :inline='true')
                            el-form-item(label='Login')
                                el-input(v-model='formGeneral.login')
                                    el-button(type='primary' slot="append", @click='subGeneral("login")') EDIT
                        el-form(v-model='formGeneral', v-if='selectedMenu === "0"', :inline='true')
                            el-form-item(label='Firstname')
                                el-input(v-model='formGeneral.firstname')
                                    el-button(type='primary' slot="append", @click='subGeneral("firstname")') EDIT
                        el-form(v-model='formGeneral', v-if='selectedMenu === "0"', :inline='true')
                            el-form-item(label='Lastname')
                                el-input(v-model='formGeneral.lastname')
                                    el-button(type='primary' slot="append", @click='subGeneral("lastname")') EDIT
                        el-form(v-model='formGeneral', v-if='selectedMenu === "0"', :inline='true')
                            el-form-item(label='Language')
                                el-select(v-model='formGeneral.language', placeholder='Select your language')
                                    el-option(v-for='l in languages', :key="l.value" :label="l.label", :value="l.value")
                                el-button(type='info', @click='subGeneral("language")') EDIT
                        el-form(v-model='formChangePassword', v-else-if='selectedMenu === "1"')
                            el-form-item(label='New password', required)
                                el-input(v-model='formChangePassword.newPw', type='password', clearable)
                            el-form-item(label='Confirm new password', required)
                                el-input(v-model='formChangePassword.confirmNewPw', type='password', clearable)
                            el-form-item(label='Old password', required)
                                el-input(v-model='formChangePassword.oldPw', type='password', clearable)
                            el-form-item
                                el-button(type='primary', @click='subChangePw') Reset password
                        el-form(@submit.native.prevent='subChangeEmail()', v-model='formChangeEmail', v-else-if='selectedMenu === "2"')
                            el-form-item(label='New e-mail', required)
                                el-input(v-model='formChangeEmail.newEmail')
                            el-form-item(v-if='strategy === "locale"', label='Password', required)
                                el-input(v-model='formChangeEmail.password', type='password')
                            el-form-item
                                el-button(type='primary', @click='subChangeEmail') Reset e-mail

                        
</template>

<style lang="scss" scoped>

    .avatarBtn {
        margin-bottom: 15px;
    }

    .el-button--info {
        color: #909398;
        background-color: #f5f7fa;
        border-color: #dadfe6;
    }

    .el-button--info:hover {
        background: #f5f7fa;
        border-color: #dadfe6;
        color: #909398;
    }
    .settings {
        max-height: 500px;
        background-color: white;
    }

    .aside {
        width: 200px !important;
    }

    @media screen and (max-width: 700px){
        .aside {
            width: 50px !important;
        }
        .texto {
            display: none;
        }
    }
</style>

<script>
import { ChangePassword, ChangeEmail, ChangeGeneral } from '@/constants/query.gql';
import helpers from '@/helpers/helpers.js';
import avatar from '@/components/avatar.vue';
import { mapGetters } from 'vuex';
import store from '@/store.js';

export default {
    components: {
        avatar,
    },
    store,
    computed: {
        ...mapGetters([
            'selectedAvatar',
        ])
    },
    data() {
        return {
            isModalVisible: false,
            backgroundAvatar: '',
            selectedMenu: '0',
            menus: ['General', 'Change Password', 'Change e-mail'],
            languages: [
                { value: 'english', label: 'English' },
                { value: 'french', label: 'French' },
                { value: 'spanish', label: 'Spanish' },
            ],
            language: '',
            strategy: '',
            formGeneral: {
                login: '',
                firstname: '',
                lastname: '',
                language: '',
            },
            formChangePassword: {
                newPw: '',
                confirmNewPw: '',
                oldPw: '',
            },
            formChangeEmail: {
                newEmail: '',
                password: '',
            },
        };
    },
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
        const userInfo = helpers.parseToken();
        this.$store.commit('FILL_SELECTEDAVATAR', userInfo.picture);
        this.backgroundAvatar = `background-image: url('${this.selectedAvatar}')`;
        this.formGeneral.login = userInfo.login;
        this.formGeneral.firstname = userInfo.firstname;
        this.formGeneral.lastname = userInfo.lastname;
        this.formGeneral.language = userInfo.language;
        this.strategy = userInfo.strategy;
    },
    methods: {
        showModal() {
            this.isModalVisible = true;
        },
        closeModal() {
            this.backgroundAvatar = `background-image: url('${this.selectedAvatar}')`;
            this.isModalVisible = false;
            this.$apollo.mutate({
                mutation: ChangeGeneral,
                variables: {
                    id: helpers.parseToken(localStorage.getItem('user-token')).id,
                    key: 'picture',
                    value: this.selectedAvatar,
                },
            }).then((res) => {
                localStorage.setItem('user-token', res.data.changeGeneral.newToken);
                this.$message({
                    message: res.data.changeGeneral.message,
                    type: 'success',
                })
            }).catch((err) => {
                this.ErrorHandler(err);
            }) 
        },
        handleMenuSelect(i) {
            this.selectedMenu = i;
        },
        subGeneral(key) {
            this.$apollo.mutate({
                mutation: ChangeGeneral,
                variables: {
                    id: helpers.parseToken(localStorage.getItem('user-token')).id,
                    key,
                    value: this.formGeneral[key],
                },
            }).then((res) => {
                localStorage.setItem('user-token', res.data.changeGeneral.newToken);
                this.$message({
                    message: res.data.changeGeneral.message,
                    type: 'success',
                })
            }).catch((err) => {
                this.ErrorHandler(err);
            })
        },
        subChangePw() {
            if (this.formChangePassword.newPw !== this.formChangePassword.confirmNewPw) {
                return this.$message({
                    message: 'The two first fields must be identical',
                    type: 'error',
                })
            }
            this.$apollo.mutate({
                mutation: ChangePassword,
                variables: {
                    id: helpers.parseToken(localStorage.getItem('user-token')).id,
                    password: this.formChangePassword.oldPw,
                    newPassword: this.formChangePassword.newPw,
                }
            }).then((res) => {
                this.$message({
                    message: res.data.changePassword,
                    type: 'success',
                })
            }).catch((err) => {
                this.ErrorHandler(err);
            });
        },
        subChangeEmail() {
            this.$apollo.mutate({
                mutation: ChangeEmail,
                variables: {
                    id: helpers.parseToken(localStorage.getItem('user-token')).id,
                    password: this.formChangeEmail.password,
                    newEmail: this.formChangeEmail.newEmail,
                }
            }).then((res) => {
                this.$message({
                    message: res.data.changeEmail,
                    type: 'success',
                })
                this.formChangeEmail.newEmail = '';
                this.formChangeEmail.password = '';
            }).catch((err) => {
                this.formChangeEmail.newEmail = '';
                this.formChangeEmail.password = '';
                this.ErrorHandler(err);
            })
        },
    }
}
</script>
