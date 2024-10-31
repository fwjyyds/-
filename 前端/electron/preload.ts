import { ipcRenderer, contextBridge,ipcMain, IpcMainInvokeEvent} from 'electron'
import axios from 'axios'
//--------- Expose some API to the Renderer process ---------
// ipcMain.handle('baidu',async(_:IpcMainInvokeEvent,query:string = '')=>{
//   let url=`https://suggestion.baidu.com/su?wd=${query}`
//   let res=await axios.get(url,{responseType:'arraybuffer'})


//   return res.data
// })

contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
})
