import socketIoClient from 'socket.io-client'

const socket = socketIoClient('http://localhost:1337')

export default socket
