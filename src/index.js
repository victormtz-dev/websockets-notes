import express from 'express';
import { Server as WebSocketServer } from 'socket.io';
import http from 'http';
import {v4 as uuid} from 'uuid'
import config from "./config";

let notes = []

const app = express();
const httpServer = http.createServer(app);
const io = new WebSocketServer(httpServer)


app.use(express.static(__dirname + '/public'));


io.on('connection', (socket) => {
    console.log('a user connected');

    socket.emit('server:loadnotes', notes)

  

    socket.on('client:newnote', newNote => {
       const note  = { ...newNote, id: uuid() }
       //console.log(`new note: ${JSON.stringify(note)}`)
        notes.push(note)
        io.emit('server:newnote', note)
    })

    socket.on('client:deletenote', (noteId) => {
        notes = notes.filter((note) => note.id !== noteId);
            
        io.emit('server:loadnotes', notes)
    });

    socket.on('client:getnote', (noteId) => {
      const note = notes.find(note => note.id === noteId)
      socket.emit('server:selectednote', note)
    });

    socket.on('client:updatenote', (updateNote) => {
       notes = notes.map(note => {
        if (note.id === updateNote.id) {
          note.title = updateNote.title
          note.description = updateNote.description
        }

        return note
    })

    io.emit('server:loadnotes', notes)
  })

   // socket.emit('server:rendernotes')
});



httpServer.listen(config.port, () => {
  console.log('Listening on port: ', config.port);
});