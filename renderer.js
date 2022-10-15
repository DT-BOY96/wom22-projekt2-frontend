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
        return
    }

    let cabinsHTML = "";
    let i = 0;
    for (const cabin of cabins) {

        cabinsHTML += `
           
            <div class="cabin" data-id="${cabin._id}">
                ${cabin.address}
                <input class="btn-del" data-id="${cabin._id}" type="button" value="del" >
                
            </div>     
        `;
        i += 1;
    }

    document.querySelector('#cabins').innerHTML = cabinsHTML;

}
getCabins()

getServices = async () => {
    console.log('getServices')
    const services = await window.electron.getServices()
    console.log(services)
    
}
//getServices()

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
    getCabins()
})

document.querySelector('#btn-save').addEventListener('click', async () => {

    const noteId = 0
    const noteText = document.querySelector('#note-text').value
    const noteSaved = await window.electron.saveNote({
        id: noteId,
        text: noteText
    })
    console.log(noteSaved)
    getCabins()

})

document.querySelector('#cabins').addEventListener('click', async (event) => {
    console.log(event.target.innerText)
    console.log("ID:" + event.target.getAttribute('data-id'))
    if (event.target.classList.contains('btn-del')) {
        console.log("ID:" + event.target.getAttribute('data-id'))
        await window.electron.delNote(event.target.getAttribute('data-id'))

    }
})