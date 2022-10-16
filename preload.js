const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {

  getCabins: () => ipcRenderer.invoke('get-cabins'),

  login: (data) => ipcRenderer.invoke('login', data),

  getServices: (data) => ipcRenderer.invoke('get-services', data),

  getOrders: (data) => ipcRenderer.invoke('get-orders', data),

  makeOrder: (data) => ipcRenderer.invoke('make-order', data),

  editOrder: (data) => ipcRenderer.invoke('edit-order', data),

  deleteOrder: (data) => ipcRenderer.invoke('delete-order', data)

})