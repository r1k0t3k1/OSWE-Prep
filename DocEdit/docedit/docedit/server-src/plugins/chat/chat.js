$("#open-button").click(function(){
	document.getElementById("myForm").style.display = "block";
})
$("#close-button").click(function(){
	document.getElementById("myForm").style.display = "none";
})
socket.on('newChatMessage', (data) => {
	var newLi = $('<li/>');
	if (data.username){
		newLi.html('<strong>' + data.username + ':</strong>' + data.msg)
	}else{
		newLi.text(data.msg)
	}
	$("#messages").append(newLi)
	$("#msgBox").animate({scrollTop: $('#msgBox').prop('scrollHeight')})
});
$(".inputMessage").keydown(function(data){
	if (data.key === "Enter"){
		var sendMsg = {};
		var input = $(".inputMessage")
		sendMsg.msg = input.val();
		if(socket.locals.user){
			sendMsg.token = socket.locals.user.token
		}
		socket.emit('newChatMessage', sendMsg);
		input.val('');
	}
});