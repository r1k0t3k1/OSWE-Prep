module.exports = function () {
    return [
        (req, res, next) => {
            if (req.locals.user.admin) {
				next();
			}
			next(new Error("User not allowed to conduct that action"));
        }
    ];
};