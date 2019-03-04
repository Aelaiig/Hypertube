<template lang="pug">
    div
</template>

<script>
import { ConfirmNewEmail } from '@/constants/query.gql';

export default {
    beforeCreate() {
        const { newEmailToken } = this.$route.params;
        this.$apollo.query({
            query: ConfirmNewEmail,
            variables: {
                newEmailToken,
            }
        }).then((res) => {
            this.$router.push('/');
            this.$message({
                message: res.data.confirmNewEmail,
                type: 'success',
            })
        }).catch((err) => {
            this.$router.push('/settings');
            this.$message({
                message: err.graphQLErrors['0'].message,
                type: 'error',
            })
        });
    }
}
</script>
