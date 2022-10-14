/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

 getNotes = async () => {
    console.log('getNotes')
    const notes = await window.electron.getNotes()
    console.log(notes)

    if (!notes) {
        document.querySelector('#login').style.display = 'block'
        return
    }

    let notesHTML = "";
    for (const note of notes) {
        notesHTML += `
            <div class="note">
                ${note.text}
                <input class="btn-del" data-id="${note._id}" type="button" value="del">
            </div>
        `;
    }

    document.querySelector('#notes').innerHTML = notesHTML;

}
getNotes()


document.querySelector('#btn-login').addEventListener('click', async () => {
    document.querySelector('#msg').innerText = ''
    const login_failed = await window.electron.notesLogin({
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value
    })
    if (login_failed) {
        document.querySelector('#msg').innerText = login_failed.msg
        return 
    }

    document.querySelector('#login').style.display = 'none'
    getNotes()
})

document.querySelector('#btn-save').addEventListener('click', async () => {
    
    const noteId = 0
    const noteText = document.querySelector('#note-text').value
    const noteSaved = await window.electron.saveNote({
        id: noteId, 
        text: noteText
    })
    console.log(noteSaved)
    getNotes()

})

document.querySelector('#notes').addEventListener('click', async (event) => {
    console.log(event.target)
    if (event.target.classList.contains('btn-del')) {
        console.log("ID:"+event.target.getAttribute('data-id'))
        await window.electron.delNote(event.target.getAttribute('data-id'))

    }
})