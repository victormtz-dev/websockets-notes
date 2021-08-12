const socket = io();

const saveNote = (title,description) => {
    socket.emit('client:newnote', {
        title,
        description
      })
}

const deleteNote = id => {
    socket.emit('client:deletenote', id
    )}

const getNote = id => {
    socket.emit('client:getnote', id
    )}

const updateNote = (id,title,description) => {
    socket.emit('client:updatenote', {
        id,
        title,
        description
    })
}


socket.on('server:newnote', appendNote)

socket.on('server:loadnotes', renderNotes)

socket.on('server:selectednote', data => {
    const title = document.getElementById('title')
    const description = document.getElementById('description')

    title.value = data.title
    description.value = data.description

    saveId = data.id
} )