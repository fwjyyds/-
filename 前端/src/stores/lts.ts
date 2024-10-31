import { ref, computed, Reactive } from 'vue'
import { defineStore } from 'pinia'

export const useLtsStore = defineStore('lts', () => {
  let ltslist:any=ref({})
  const setltslist=(obj)=>{
    ltslist.value=obj
  }
let noreadlist:any=ref({})
const setnoreadlist=(obj)=>{
  noreadlist.value=obj
}

  return {ltslist,setltslist,noreadlist,setnoreadlist  }
}, {
  persist: true,
})
