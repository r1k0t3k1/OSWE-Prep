module.exports = async function (socket) {
    if (socket.locals.user.admin) {
        return
    }else{
        throw new Error("User not allowed to conduct that action");
    }
};