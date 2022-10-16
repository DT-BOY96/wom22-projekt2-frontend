// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fetch = require('electron-fetch').default
require('dotenv').config()

const Store = require('electron-store')
const store = new Store()


const API_URL = process.env.API_URL_ENV
const API_URL2 = process.env.API_URL_ENV_2

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: true // true to hide, press Alt to show when hidden
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open DevTools automatically (comment out if you don't want it)
  mainWindow.webContents.openDevTools()

}

// Called when Electron is ready to create browser windows.
app.whenReady().then(() => {
  createWindow()

  // Check original template for MacOS stuff!
})

ipcMain.handle('login', async (event, data) => {
  console.log('login (main)')
  console.log(API_URL + '/users/login')
  try {
    const resp = await fetch(API_URL + '/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      timeout: 3000
    })
    const user = await resp.json()
    console.log(user)

    if (resp.status > 201) return user

    store.set('jwt', user.token)
    return false // false = login succeeded

  } catch (error) {
    console.log(error.message)
    return { 'msg': "Login failed." }
  }

})

ipcMain.handle('get-cabins', async () => {
  console.log('get-cabins (main)')
  try {
    const resp = await fetch(API_URL2 + '/cabins', {
      headers: { 'Authorization': 'Bearer ' + store.get('jwt') },
      timeout: 2000
    })
    const cabins = await resp.json()

    if (resp.status > 201) {
      return false
    }
    return cabins

  } catch (error) {
    console.log(error.type)
    return false
  }

})

ipcMain.handle('get-services', async () => {
  console.log('get-services (main)')
  try {
    const resp = await fetch(API_URL2 + '/services', {
      method: 'GET',
      timeout: 4000
    })
    const services = await resp.json()

    if (resp.status > 201) {
      return false
    }
    return services

  } catch (error) {
    console.log(error.message)
    return false
  }
})

ipcMain.handle('get-orders', async () => {
  console.log('get-orders (main)')
  try {
    const resp = await fetch(API_URL2 + '/orders', {
      method: 'GET',
      timeout: 4000
    })
    const orders = await resp.json()

    if (resp.status > 201) {
      return false
    }
    return orders

  } catch (error) {
    console.log(error.message)
    return false
  }
})

ipcMain.handle('make-order', async (event, data) => {
  console.log('make-order (main)')
  try {
    const resp = await fetch(API_URL2 + '/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cabin: data.cabin,
        servicetype: data.servicetype,
        date: data.date
      }),
      timeout: 4000

    })
    const order = await resp.json()

    if (resp.status > 201) {
      return false
    }
    return order

  } catch (error) {
    console.log(error.message)
    return false
  }
})

ipcMain.handle('edit-order', async (event, data) => {
  console.log('edit-order (main)')
  try {
    const resp = await fetch(API_URL2 + '/orders', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: data.id, 
        cabin: data.cabin,
        servicetype: data.servicetype,
        date: data.date
      }),
      timeout: 4000
    })
    const patchorder = await resp.json()

    if (resp.status > 201) {
      return false
    }
    return patchorder

  } catch (error) {
    console.log(error.message)
    return false
  }
})

ipcMain.handle('delete-order', async (event, data) => {
  console.log('get-services (main)')
  try {
    const resp = await fetch(API_URL2 + '/orders', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: data.id
      }),
      timeout: 4000
    })
    const services = await resp.json()

    if (resp.status > 201) {
      return false
    }
    return services

  } catch (error) {
    console.log(error.message)
    return false
  }
})

app.on('window-all-closed', () => {
  app.quit()
  // Check original template for MacOS stuff!
})