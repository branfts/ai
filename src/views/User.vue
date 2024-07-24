<template>
    <QCMain :auth="auth" />
</template>
<script setup>
import QCMain from '../components/QCMain.vue'

const props = defineProps({
    auth: Object
})
</script>