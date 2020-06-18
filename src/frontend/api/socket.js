import socketIoClient from 'socket.io-client'

let socket 

if (process.env.NODE_ENV === 'production') {
  socket = socketIoClient('https://www.polaris.pulse-tools.com')
} else {
  socket = socketIoClient('http://localhost:1337')
}

export default socket
