/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules
 */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {

  getCabins: () => ipcRenderer.invoke('get-cabins'),

  login: (data) => ipcRenderer.invoke('login', data),

  getServices: (data) => ipcRenderer.invoke('get-services', data),

  getOrders: (data) => ipcRenderer.invoke('get-orders', data),

  makeOrder: (data) => ipcRenderer.invoke('make-order', data),

  editOrder: (data) => ipcRenderer.invoke('edit-order', data),

  deleteOrder: (data) => ipcRenderer.invoke('delete-order', data)

  /*
    btnClick: () => {
      console.log('button clicke (preload)')
      ipcRenderer.invoke('btn-click')
    },
  
    // expose a function in main (node) to renderer
    getStuffFromMain: () => ipcRenderer.invoke('get-stuff-from-main'),
  
    // send data back to main
    sendStuffToMain: (data) => ipcRenderer.invoke('send-stuff-to-main', data)
  */
})