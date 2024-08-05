
module.exports = class Chat_Plugin {

	constructor(socket) {
	  this.title = "Chat Plugin - WS"
	  this.description = "Chat Plugin, Requires \"Chat Plugin - Traditional\" to work"
	  this.type = "ws"
	}
  
	main(socket) {
		socket.on('newChatMessage', (data) => {
			//send to everyone
			socket.broadcast.emit('newChatMessage', data);
			socket.emit('newChatMessage', data);
		  });
	}
  
}