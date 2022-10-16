/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
getCabins = async () => {
    console.log('getCabins')
    const cabins = await window.electron.getCabins()
    if (!cabins) {
        document.querySelector('#login').style.display = 'block'
        document.querySelector('#bigBox').style.display = 'none'

        return
    } else if (cabins) {
        document.querySelector('#bigBox').style.display = 'inline'
    }
    let cabinsHTML = ""

    for (const cabin of cabins) {
        cabinsHTML += `
            <option class="cabin" data-id="${cabin._id}">
                ${cabin.address}   
            </option>     
        `;
    }
    document.querySelector('#cabins').innerHTML = cabinsHTML;
}
//getCabins()

getServices = async () => {
    console.log('getServices')
    const services = await window.electron.getServices()

    let servicesHTML = "";
    for (const service of services) {
        servicesHTML += `  
        <option class="service" data-id="${service._id}">
            ${service.servicetype}
        </option>
        `;
    }
    document.querySelector('#services').innerHTML = servicesHTML;
    document.querySelector('#service-edit').innerHTML = servicesHTML;
}
//getServices()

getOrders = async (event) => {
    console.log('getOrders')
    const orders = await window.electron.getOrders()
    if (!orders) {
        document.querySelector('#orders').innerHTML = "No orders found";
        return
    }
    let ordersHTML = `<h3 class="left-h3">Your Orders</h3>`;
    for (const order of orders) {
        var newdate = new Date(order.date).toLocaleDateString('sv')
        ordersHTML += `  
        
        <option class="orders" value="${order.id}">
            ${order.cabin}
            ${order.servicetype}
            ${newdate}
        </option>
        `;
    }
    document.querySelector('#orders2').innerHTML = ordersHTML;
    document.querySelector('#orders').innerHTML = ordersHTML;
}

document.querySelector('#orderbutton').addEventListener('click', async (event) => {
    const cabin = document.querySelector('#cabins').value
    const service = document.querySelector('#services').value
    const date = document.querySelector('#calender').value
    const makeOrder = await window.electron.makeOrder({
        cabin: cabin,
        servicetype: service,
        date: date
    })
    console.log(makeOrder)
    getOrders()
})

document.querySelector('#openeditor').addEventListener('click', async () => {
    console.log("editing")
    const id = document.getElementById('orders').value
    document.getElementById('editor').style.display = 'inline'
    document.getElementById('edit&order').style.display = 'none'


})

document.querySelector('#cancel').addEventListener('click', async () => {
    document.getElementById('editor').style.display = 'none'
    document.getElementById('edit&order').style.display = 'inline'
})

document.querySelector('#makeedit').addEventListener('click', async () => {
    const id = document.getElementById('orders').value
    const cabin = document.querySelector('#cabin-edit').value
    const service = document.querySelector('#service-edit').value
    const date = document.querySelector('#date-edit').value
    const editOrder = await window.electron.editOrder({
        id: id,
        cabin: cabin,
        servicetype: service,
        date: date
    })
    console.log(id)

    console.log(cabin)
    console.log(service)
    console.log(date)

})

document.querySelector('#deletebutton').addEventListener('click', async () => {
    const id = document.getElementById('orders').value
    const deleteOrder = await window.electron.deleteOrder({
        id: id
    })
    console.log(deleteOrder)
    getOrders()
})

document.querySelector('#btn-login').addEventListener('click', async () => {
    document.querySelector('#msg').innerText = ''
    const login_failed = await window.electron.login({
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value
    })
    if (login_failed) {
        document.querySelector('#msg').innerText = login_failed.msg
        return
    }

    document.querySelector('#login').style.display = 'none'
    document.querySelector('#bigBox').style.display = 'inline'
    getCabins()
    getServices()
    getOrders()
})

getCabins()
getServices()
getOrders()