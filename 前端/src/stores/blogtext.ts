import { ref, computed, Reactive } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  let currentuser:any=ref({})
  const setcurrentuser=(obj)=>{
    currentuser.value=obj
  }


  return {currentuser,setcurrentuser  }
}, {
  persist: true,
})
