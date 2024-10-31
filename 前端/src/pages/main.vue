its
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import $ from 'jquery';
import io from 'socket.io-client';
import { socket } from '../App.vue'
import { useUserStore } from '../stores/blogtext';
import { useLtsStore } from '../stores/lts'
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
const router = useRouter()
var showimgdetail=ref(false)
function getCurrentTimeFormatted() {
    let date = new Date();

    // 获取年份（2位）
    let year = String(date.getFullYear());

    // 获取月份（补0）
    let month = String(date.getMonth() + 1).padStart(2, '0');

    // 获取日期（补0）
    let day = String(date.getDate()).padStart(2, '0');

    // 获取小时（24小时制，补0）
    let hours = String(date.getHours()).padStart(2, '0');

    // 获取分钟（补0）
    let minutes = String(date.getMinutes()).padStart(2, '0');

    // 获取秒（补0）
    let seconds = String(date.getSeconds()).padStart(2, '0');

    // 拼接字符串
    let formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedTime;
}
const sid=()=>{
    tip(1,'aaaaaaaaaaaaaaaaaaa')
}
function getCurrentTimeFormatted2() {
    let date = new Date();

    // 获取年份（2位）
    let year = String(date.getFullYear());

    // 获取月份（补0）
    let month = String(date.getMonth() + 1).padStart(2, '0');

    // 获取日期（补0）
    let day = String(date.getDate()).padStart(2, '0');

    // 获取小时（24小时制，补0）
    let hours = String(date.getHours()).padStart(2, '0');

    // 获取分钟（补0）
    let minutes = String(date.getMinutes()).padStart(2, '0');

    // 获取秒（补0）
    let seconds = String(date.getSeconds()).padStart(2, '0');

    // 拼接字符串
    let formattedTime = `${hours}:${minutes}`;

    return formattedTime;
}
const getltslist = async (id) => {
    await axios.post('http://localhost:3010/getnote', { userid: id, fun: 3 }).then((res) => {

        if (res.data.code === '1') {


            ltsstore.setltslist(res.data.res)

        }
        else {
            //失败
            tip(4, '群聊获取失败')
        }

    })
}

let msg1 = ref(''), userstore = useUserStore(), ltsstore = useLtsStore(), currentlts: any = ref('')
let showemoji = ref(false), showsetting = ref(false), onsearch = ref(false), searchk = ref('')
const offline = () => {

    showsetting.value = false

    socket.close();
    socket.connect()
    router.push('/')
}
const setcurrentlts = async (item, index) => {
    const rightk = document.querySelector('.rightk')
    rightk.style.width = '0px'
    ltsstore.noreadlist[item.id] = 0

    await getltslist(userstore.currentuser.username)
    currentlts.value = item

    let groupli = document.querySelectorAll('#groupli')

    for (let i = 0; i < groupli.length; i++) {
        groupli[i].classList.remove('grey3')
    }
    groupli[index].classList.add('grey3')
    let p1 = JSON.parse(currentlts.value.content)
    let tmp3 = ''
    document.getElementById('ltk').innerHTML = ''
    for (let i = 0; i < p1.length; i++) {
        if (p1[i].content === null) {
            p1[i].content = []
        }

        const tup = p1[i]
        if (tmp3 != p1[i].time.slice(10, 16)) {
            $('#ltk').append(`          <div style="display: flex;justify-content: center;margin:10px 0px">
    <div class="timek">${p1[i].time.slice(0, 16)}</div>
</div>   `)
        }
        tmp3 = p1[i].time.slice(10, 16)



        if (tup.content.startsWith('data:image')) {


            if (tup.name === userstore.currentuser.username
            ) {
                $('#ltk').append(`        
        <div class="row" style="padding:10px 10px;justify-content: flex-end;">

<div class="column" style="padding-right: 10px;">
    <div class="grey2" style="text-align: right;font-size: 0.8em;">
       ${tup.name}
    </div>
    <div class="row" style="text-align: left;font-size:0.9em">

    
        <img class="img5" @click="sid"    style="  background-color:#95ec69" src="${tup.content}"></img>
        <div class="triangleright"></div>
    </div>
</div>
<img src="src/assets/tx3.jpg" class="img4" alt="">
</div>`)
            }
            else {
                $('#ltk').append(`  <div class="row " style="padding:10px 10px;">
                    <img src="src/assets/tx4.jpg" class="img4" alt="">
                    <div class="column" style="padding-left: 10px;">
                        <div class="grey2" style="text-align: left;font-size: 0.8em;">
                             ${tup.name}
                        </div>
                        <div class="row" style="text-align: left;font-size:0.9em">
                            <div class="triangleleft"></div>
                                   <img class="img5"  @click="sid"   style="background-color: #FFFFFF" src="${tup.content}"></img>

                        </div>
                    </div>
                </div>  `)
            }
            $('.img5:last').off('load')
            $('.img5:last').on('load', () => {
                $('#ltk').children(':last').get(0).scrollIntoView(false)
            })
            $('.img5').off('click')
            $('.img5').on('click',(e)=>{
    
        document.querySelector('.img7').src=  e.target.src
        showimgdetail.value=true
    })
        }
        else {
            if (tup.name === userstore.currentuser.username
            ) {
                $('#ltk').append(`        
        <div class="row" style="padding:10px 10px;justify-content: flex-end;">

<div class="column" style="padding-right: 10px;">
    <div class="grey2" style="text-align: right;font-size: 0.8em;">
       ${tup.name}
    </div>
    <div class="row" style="text-align: left;font-size:0.9em">

        <span class="dialog2"> ${tup.content}</span>
        <div class="triangleright"></div>
    </div>
</div>
<img src="src/assets/tx3.jpg" class="img4" alt="">
</div>`)
            }
            else {
                $('#ltk').append(`  <div class="row " style="padding:10px 10px;">
                    <img src="src/assets/tx4.jpg" class="img4" alt="">
                    <div class="column" style="padding-left: 10px;">
                        <div class="grey2" style="text-align: left;font-size: 0.8em;">
                             ${tup.name}
                        </div>
                        <div class="row" style="text-align: left;font-size:0.9em">
                            <div class="triangleleft"></div>
                            <span class="dialog">${tup.content}</span>

                        </div>
                    </div>
                </div>  `)
            }
            $('#ltk').children(':last').get(0).scrollIntoView(false)


        }
    }
    // console.log('=======',JSON.stringify({
    //     name:1234,
    //     time:getCurrentTimeFormatted(),
    //     content:'askdflkop'
    // }))
}

const sendmsg = (msg) => {
    if (msg === '') {
        tip(3, '请输入文字')
        return
    }

    if (currentlts.value === undefined || currentlts.value === null || currentlts.value === '') {
        tip(3, '请选择聊天室')
        return
    }
    socket.emit('sendmsg', { user: userstore.currentuser, msg: msg, ltsid: currentlts.value.id })
    let content = currentlts.value

    if (content.content === undefined || content.content === null || content.content.length === 0) {
        content.content = []
    }
    else {
        content.content = JSON.parse(content.content)
    }
    content.content.push(
        {
            name: userstore.currentuser.username,
            time: getCurrentTimeFormatted(),
            content: msg1.value
        }


    )
    content.content = JSON.stringify(content.content)

    axios.post('http://localhost:3010/changenote', {
        fun: 1,
        name: currentlts.value.name, num: currentlts.value.num, face: currentlts.value.face, content: content, order: currentlts.value.order1, id: currentlts.value.id
    })
}
socket.emit('login', {
    user: userstore.currentuser
})
const sendimg = (e) => {


    $('#fileinput').click()

}

const tip = (mod, mess) => {
    let config = { plain: true, message: mess }
    if (mod === 1) {
        config['type'] = 'success'
    }
    else if (mod === 2) {
        config['type'] = 'info'
    }
    else if (mod === 3) {
        config['type'] = 'warning'
    }
    else if (mod === 4) {
        config['type'] = 'error'
    }
    ElMessage(config)
}

socket.off('receiveimg')
socket.on('receiveimg', data => {
    document.querySelectorAll('.ltsdes')[ltsstore.ltslist.findIndex(item => item.id === data.ltsid)].innerText = '[图片消息]'
    document.querySelectorAll('.ltstime')[ltsstore.ltslist.findIndex(item => item.id === data.ltsid)].innerText = getCurrentTimeFormatted2()
    if (currentlts.value.id != data.ltsid && data.user.username === userstore.currentuser.username) {
        if (ltsstore.ltslist.find(item => item.id === data.ltsid)) {

            if (ltsstore.noreadlist[ltsstore.ltslist.find(item => item.id === data.ltsid).id]) {
                ltsstore.noreadlist[ltsstore.ltslist.find(item => item.id === data.ltsid).id] = ltsstore.noreadlist[ltsstore.ltslist.find(item => item.id === data.ltsid).id] + 1
            }
            else {
                ltsstore.noreadlist[ltsstore.ltslist.find(item => item.id === data.ltsid).id] = 1


            }

        }

        return
    }
    if (ltsstore.ltslist.find(item => item.id === data.ltsid)) {
        ltsstore.noreadlist[ltsstore.ltslist.find(item => item.id === data.ltsid).id] = 0

    }
    $('#ltk').append(`          <div style="display: flex;justify-content: center;margin:10px 0px">
    <div class="timek">${getCurrentTimeFormatted2()}</div>
</div>   `)
    if (data.user.username === userstore.currentuser.username
    ) {
        $('#ltk').append(`        
        <div class="row" style="padding:10px 10px;justify-content: flex-end;">

<div class="column" style="padding-right: 10px;">
    <div class="grey2" style="text-align: right;font-size: 0.8em;">
       ${data.user.username}
    </div>
    <div class="row" style="text-align: left;font-size:0.9em">

    
        <img class="img5" src="${data.img}"  @click="sid"  style="    background-color: #95ec69;"></img>
        <div class="triangleright"></div>
    </div>
</div>
<img src="src/assets/tx3.jpg" class="img4" alt="">
</div>`)
    }
    else {
        $('#ltk').append(`  <div class="row " style="padding:10px 10px;">
                    <img src="src/assets/tx4.jpg" class="img4" alt="">
                    <div class="column" style="padding-left: 10px;">
                        <div class="grey2" style="text-align: left;font-size: 0.8em;">
                             ${data.user.username}
                        </div>
                        <div class="row" style="text-align: left;font-size:0.9em">
                            <div class="triangleleft"></div>
                                   <img class="img5"  @click="sid "  style=" background-color: #FFFFFF;" src="${data.img}"></img>

                        </div>
                    </div>
                </div>  `)
    }
    $('.img5:last').off('load')
    $('.img5:last').on('load', () => {
        $('#ltk').children(':last').get(0).scrollIntoView(false)
    })
      $('.img5').off('click')
    $('.img5').on('click',()=>{
        document.querySelector('.img7').src=  e.target.src
        showimgdetail.value=true
    })

})
socket.off('receivemsg')
socket.on('receivemsg', data => {
    msg1.value = ''
    document.querySelectorAll('.ltsdes')[ltsstore.ltslist.findIndex(item => item.id === data.ltsid)].innerText = data.msg
    document.querySelectorAll('.ltstime')[ltsstore.ltslist.findIndex(item => item.id === data.ltsid)].innerText = getCurrentTimeFormatted2()
    if (currentlts.value.id != data.ltsid && data.user.username === userstore.currentuser.username) {
        if (ltsstore.ltslist.find(item => item.id === data.ltsid)) {

            if (ltsstore.noreadlist[ltsstore.ltslist.find(item => item.id === data.ltsid).id]) {
                ltsstore.noreadlist[ltsstore.ltslist.find(item => item.id === data.ltsid).id] = ltsstore.noreadlist[ltsstore.ltslist.find(item => item.id === data.ltsid).id] + 1
            }
            else {
                ltsstore.noreadlist[ltsstore.ltslist.find(item => item.id === data.ltsid).id] = 1

                console.log('wu有属性')
            }

        }
        return
    }
    if (ltsstore.ltslist.find(item => item.id === data.ltsid)) {
        ltsstore.noreadlist[ltsstore.ltslist.find(item => item.id === data.ltsid).id] = 0
        //     console.log(';;;;;;', document.querySelectorAll('.ltsdes'),ltsstore.ltslist.findIndex(item=>item.id===data.ltsid))   


    }
    $('#ltk').append(`          <div style="display: flex;justify-content: center;margin:10px 0px">
    <div class="timek">${getCurrentTimeFormatted2()}</div>
</div>   `)

    if (data.user.username === userstore.currentuser.username
    ) {

        $('#ltk').append(`        
        <div class="row" style="padding:10px 10px;justify-content: flex-end;">

<div class="column" style="padding-right: 10px;">
    <div class="grey2" style="text-align: right;font-size: 0.8em;">
       ${data.user.username}
    </div>
    <div class="row" style="text-align: left;font-size:0.9em">

        <span class="dialog2"> ${data.msg}</span>
        <div class="triangleright"></div>
    </div>
</div>
<img src="src/assets/tx3.jpg" class="img4" alt="">
</div>`)
    }
    else {
        $('#ltk').append(`  <div class="row " style="padding:10px 10px;">
                    <img src="src/assets/tx4.jpg" class="img4" alt="">
                    <div class="column" style="padding-left: 10px;">
                        <div class="grey2" style="text-align: left;font-size: 0.8em;">
                             ${data.user.username}
                        </div>
                        <div class="row" style="text-align: left;font-size:0.9em">
                            <div class="triangleleft"></div>
                            <span class="dialog">${data.msg}</span>

                        </div>
                    </div>
                </div>  `)
    }
    $('#ltk').children(':last').get(0).scrollIntoView(false)
}


)

socket.on('deluser', data => {

    $('#ltk').append(`<div class="grey2" style="font-size:0.9em;">${data.user.username}已下线</div>`)

})

onMounted(() => {

    $('#fileinput').off('change')
    $('#fileinput').on('change', () => {
        var ifile: any = $('#fileinput')[0]
        var file = ifile.files[0]

        var fr = new FileReader()
        fr.readAsDataURL(file)
        fr.onload = () => {


            if (currentlts.value === undefined || currentlts.value === null || currentlts.value === '') {
                tip(3, '请选择聊天室')

                return

            }
            let content = currentlts.value
            console.log('content', content)
            if (content.content === undefined || content.content === null || content.content.length === 0) {
                content.content = []
            }
            else {
                content.content = JSON.parse(content.content)
            }
            content.content.push(
                {
                    name: userstore.currentuser.username,
                    time: getCurrentTimeFormatted(),
                    content: fr.result
                }


            )
            console.log('content2', content)
            content.content = JSON.stringify(content.content)

            axios.post('http://localhost:3010/changenote', {
                fun: 1,
                name: currentlts.value.name, num: currentlts.value.num, face: currentlts.value.face, content: content, order: currentlts.value.order1, id: currentlts.value.id
            })
            socket.emit('sendimg', {
                user: userstore.currentuser,
                img: fr.result,
                imgurl: URL.createObjectURL(file),
                ltsid: currentlts.value.id
            })
        }


    })



})
let searchltslist = ref([])
const getgroup = async () => {

    //发送接受axios
    await axios.post('http://localhost:3010/getnote', { keyword: searchk.value, fun: 2 }).then((res) => {

        if (res.data.code === '1') {


            searchltslist.value = res.data.res
            onsearch.value = true
        }
        else {
            //失败
            tip(4, '群聊获取失败')
        }

    })
}

import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";
import axios from 'axios';



const onVue3EmojiPicker = (emoji) => {
    msg1.value += emoji.i;
    /* 结果示例
    { 
        i: "ernes", // 表情图标
        n: ["kissing face"], 
        r: "1f61a", // 包含肤色
        t: "neutral", // 肤色
        u: "1f61a" // 不带肤色
    }
    */
};
const outsearch = () => {
    searchltslist.value = []
    onsearch.value = false
}
const addgroup = async (item) => {

    await axios.post('http://localhost:3010/uploadnote', { ltsid: item.id, userid: userstore.currentuser.id, fun: 1 }).then(async (res) => {

        if (res.data.code === '1') {
            if (res.data.res.affectedRows === 0) {
                tip(2, 'opps,你已在群聊')
            }
            else {
                tip(1, '群聊添加成功')
                await getltslist(userstore.currentuser.username)
                currentlts.value = item
                outsearch()
            }


        }
        else {
            //失败
            tip(4, '群聊添加失败')
        }

    })
}
let currentuserlist = ref([])
const outgroup = async () => {
    await axios.post('http://localhost:3010/deletenote', { ltsid: currentlts.value.id, userid: userstore.currentuser.id, fun: 1 }).then(async (res) => {

        if (res.data.code === '1') {

            tip(1, res.data.msg)
            await getltslist(userstore.currentuser.username)
            currentlts.value = ''
            document.getElementById('ltk').innerHTML = ''
        }
        else {
            //失败
            tip(4, '群聊获取失败')
        }

    })
}
const showgroupdetail = async () => {
    await axios.post('http://localhost:3010/getnote', { ltsid: currentlts.value.id, fun: 4 }).then((res) => {

        if (res.data.code === '1') {

            currentuserlist.value = res.data.res


        }
        else {
            //失败
            tip(4, '群聊获取失败')
        }

    })
    const rightk = document.querySelector('.rightk')

    if (rightk.offsetWidth === 1 || rightk.offsetWidth === 0) {

        rightk.style.width = '250px'


    } else {
        rightk.style.width = '0px'

    }
}

</script>
<template>
    <div class="img8" v-show="showimgdetail">
        <el-icon size="40" style="position:absolute;right:20px;top:20px;" color="#979797" class="pointer" @click="showimgdetail=false">
            <close />
        </el-icon>
        <img class="img7" src="../assets/OIP-C.jpg" alt="">

    </div>
    <div class="flex2">


        <div class="flex3  " style="width:60px;background-color: #2e2e2e;">
            <ul>
                <li class="pointer mt10"><img src="../assets/tx3.jpg" class="img2" alt=""></li>
                <li class="pointer mt10"><el-icon size="25" color="#979797">
                        <ChatRound />
                    </el-icon></li>
                <li class="pointer mt10"><el-icon size="25" color="#979797">
                        <User />
                    </el-icon></li>

            </ul>
            <ul style="position:relative;height:50px">
                <li>
                    <div v-if="showsetting" class="settingblock">
                        <ul>
                            <li class="li1">存储</li>
                            <li class="li1" @click="offline">退出登录</li>
                        </ul>
                    </div>
                </li>
                <li class="pointer" @click="showsetting = !showsetting"><el-icon size="22" color="#979797">
                        <Setting />
                    </el-icon></li>

            </ul>

        </div>
        <div class="flex1 flexr3 white1" style="border-right: 2px solid #ececec;">
            <div class="white1 paddingy1 row" style="width:100%">
                <input class="input2 flexr1 ml5" type="text" v-model="searchk" @keydown.esc.native.prevent="outsearch"
                    @keydown.enter.native.prevent="getgroup">
                <button class="button2 flexcenter" style="margin-left:5px"><el-icon>
                        <Plus />
                    </el-icon></button>
            </div>
            <div style="width:100%">
                <ul class="" style="width:calc(100% - 20px)" v-if="!onsearch">
                    <li id="groupli" @click="setcurrentlts(item, index)" v-for="(item, index) in ltsstore.ltslist"
                        class="grey1 row padding1 pointer" style="width:100%;position: relative;">
                        <img src="../assets/tx1.jpg" class="img3 mr5" alt="">
                        <div class="redball" v-if="ltsstore.noreadlist[item.id]">{{ ltsstore.noreadlist[item.id] }}
                        </div>
                        <div class="column flexr1 " style="align-items: flex-start;">
                            <span style="font-size:1em">{{ item.name }}</span>
                            <span class="yihang grey2 ltsdes"
                                style="font-size:0.76em;">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx默认展示</span>
                        </div>
                        <div class="grey2 mr5 ltstime" style="font-size:0.80em;width:30px;">
                            {{ item.content&&item.content!='[]'&&item.content.length!=0?JSON.parse(item.content)[JSON.parse(item.content).length - 1]['time'].slice(10, 16):'' }}</div>

                    </li>
                </ul>
                <div v-if="onsearch">
                    <div style="display: flex;justify-content: flex-start;">群聊</div>
                    <hr>
                    <ul style="">
                        <li id="groupli" @dblclick="addgroup(item)" v-for="(item, index) in searchltslist"
                            class="grey1 row padding1 pointer" style=""><img src="../assets/tx1.jpg" class="img3"
                                alt="">
                            <div class="column flexr1" style="align-items: flex-start;">
                                <span style="font-size:1em">{{ item.name }}({{ item.num }})</span>
                                <span class="yihang grey2" style="font-size:0.76em;max-width:200px;">xxxxx默认展示</span>
                            </div>
                            <div class="grey2" style="font-size:0.80em;width:60px;">14:50</div>

                        </li>
                    </ul>
                </div>


            </div>

        </div>

        <div class=" flexr9 yellow column">

            <div class=" orange column" style="width:100%;height:100%">
                <div class="white1 row paddingx2"
                    style="height:45px;width:100%;justify-content: space-between;align-items: center;border-bottom: 1px solid #ececec;">
                    <span style="margin-left:10px;">{{ currentlts.name }}({{ currentlts.num }})</span>
                    <el-icon style="margin-right:10px;" class="pointer" size="24" @click="showgroupdetail">
                        <More />
                    </el-icon>
                </div>
                <div class="flexr3 white1" id="ltk" style="width:100%">

                </div>
                <div class="Com_view">

                </div>

                <div class="white1 row"
                    style="position:relative;height:40px;width:100%;justify-content: space-between;align-items: center;border-top:1px solid #ececec">

                    <ul class="row">
                        <li class="ml5" id="face" @click="showemoji = !showemoji"><el-icon size="24" class="pointer">
                                <ElemeFilled />
                            </el-icon></li>
                        <li><el-icon size="24" class="pointer" @click="sendimg">
                                <Folder />
                            </el-icon></li>
                        <li><input type="file" name="" id="fileinput" style="display: none;"></li>
                        <li><el-icon size="24" class="pointer">
                                <ChatLineRound />
                            </el-icon></li>
                    </ul>
                    <div v-if="showemoji" class="emoje_1 box_emoje" style="position:absolute;top:-350px;left:0px;">

                        <EmojiPicker :native="true" @select="onVue3EmojiPicker" />

                    </div>
                    <ul>
                        <li class="mr5"><el-icon size="24" class="pointer">
                                <VideoCamera />
                            </el-icon></li>
                    </ul>
                </div>
                <div class="white1 flexr1 column" style="width:100%;">
                    <div class="flexr1" id="content" style="width:100%">
                        <textarea class="" id="msgblock" v-model="msg1" @keydown.enter.native.prevent="sendmsg(msg1)"
                            style="font-size: 1em;width:99%;height:99%;resize: none;border:0px;outline:none;background-color: #f5f5f5;"></textarea>
                    </div>
                    <div class="white1 row " style="height:44px;width:100%;justify-content: flex-end;"><button
                            class="button3" style="margin-right: 20px;" @click="sendmsg(msg1)">发送(S)</button></div>
                </div>

            </div>
            <div class="rightk">
                <div>群内人员</div>
                <div>
                    <ul class="row" style="flex-flow: wrap;">
                        <li class="column " v-for="item in currentuserlist" style="width:60px;align-items: center;">
                            <img src="../assets/tx2.jpg" class="img6" alt="">
                            <span style="font-size: 0.9em;">{{ item.username }}</span>
                        </li>

                    </ul>
                </div>
                <div>群名称</div>
                <div>
                    <input type="text" class="input2" style="border:1px solid #e3e3e3;margin-bottom: 10px;;">
                </div>
                <button class="button4" @click="outgroup">退出群聊</button>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '../assets/normal.scss';
@import '../assets/part.scss';
</style>