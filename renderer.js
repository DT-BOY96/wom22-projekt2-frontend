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

getCabins = async () => {
    console.log('getCabins')
    const cabins = await window.electron.getCabins()
    if (!cabins || cabins.length < 1 ) {
        document.querySelector('#login').style.display = 'block'
        document.querySelector('#bigBox').style.display = 'none'
        if(cabins.length < 1 ) {
            document.querySelector('#msg').innerText ='No cabins found'
        }else {
            document.querySelector('#msg').innerText =`Can't get cabins`
        }
        

        return
    } else if (cabins) {
        document.querySelector('#bigBox').style.display = 'inline'
    }
    let cabinsHTML = ""

    for (const cabin of cabins) {
        cabinsHTML += `
            <option class="cabins" data-id="${cabin.id}">
                ${cabin.address}   
            </option>     
        `;
    }
    document.querySelector('#cabins').innerHTML = cabinsHTML;
    document.querySelector('#cabins2').innerHTML = cabinsHTML;
    document.querySelector('#cabin-edit').innerHTML = cabinsHTML;
}

getServices = async () => {
    console.log('getServices')
    const services = await window.electron.getServices()

    let servicesHTML = "";
    for (const serve of services) {
        servicesHTML += `  
        <option class="services" data-id="${serve.id}">
            ${serve.servicetype}
        </option>
        `;
    }
    document.querySelector('#services').innerHTML = servicesHTML;
    document.querySelector('#services2').innerHTML = servicesHTML;
    document.querySelector('#service-edit').innerHTML = servicesHTML;
}

getOrders = async (event) => {
    console.log('getOrders')
    const orders = await window.electron.getOrders()
    if (!orders) {
        document.querySelector('#orders').innerHTML = "No orders found";
        return
    }
    let ordersHTML = "";
    for (const order of orders) {
        var newdate = new Date(order.date).toLocaleDateString('sv')
        ordersHTML += `  
        
        <option class="orders" value="${order.id}">
            ${order.cabin} ||
            ${order.servicetype} ||
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
    getOrders()
})

document.querySelector('#openeditor').addEventListener('click', async () => {
    console.log("editing")
    document.getElementById('editor').style.display = 'inline'
    document.getElementById('edit-and-delete').style.display = 'none'
})

document.querySelector('#cancel').addEventListener('click', async () => {
    document.getElementById('editor').style.display = 'none'
    document.getElementById('edit-and-delete').style.display = 'inline'
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
})

document.querySelector('#deletebutton').addEventListener('click', async () => {
    const id = document.getElementById('orders').value
    const deleteOrder = await window.electron.deleteOrder({
        id: id
    })
    getOrders()
})

getCabins()
getServices()
getOrders()