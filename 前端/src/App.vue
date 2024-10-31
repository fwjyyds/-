<script lang="ts">
import axios from 'axios';
import { nextTick } from 'vue';


// if(localStorage.getItem('ws_token')){
//     axios.defaults.headers.common['token'] = JSON.parse(localStorage.getItem('ws_token'))
// }
import { useUserStore } from './stores/blogtext';
import io from 'socket.io-client';
// const userstore=useUserStore()
export var socket=io('http://localhost:3010')

export default{
    name:'App',
    components:'App'
}

</script>

<template>
<router-view></router-view>

</template>

<style lang="scss">
@import './assets/normal.scss'
</style>
