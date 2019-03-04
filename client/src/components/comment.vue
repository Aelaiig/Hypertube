<template lang="pug">
    div.comment
        img.pic(@click='profile_redirect', :src='picture')
        .textComment
            p.commentLogin(@click='profile_redirect') {{ login }}
            p.comentario {{ comment }}
</template>

<style lang="scss" scoped>
.pic {
    &:hover {
        cursor: pointer;
    }
    width: 50px;
    margin: 5px;
    float: left;
    border-radius: 50%;
}

.textComment {
    display: flex;
}

.commentLogin {
    &:hover {
        cursor: pointer;
    }
    font-weight: bold;
    margin: 0;
    position: absolute;
}

.comment {
    padding: 5px;
    margin-bottom: 10px;
}

.comment:hover {
    box-shadow: 0 .5rem 1rem rgba(0,0,0,.15);
    transition: all .3s;
}

.comentario {
    margin-top: 25px;
    text-align: left;
}
</style>


<script>
export default {
    props: ['picture', 'login', 'comment', 'userId'],
    methods: {
        profile_redirect() {
            if (this.login === 'Deleted account')
                return null;
            this.$router.push(`/user/${this.userId}`);
        }
    }
}
</script>
