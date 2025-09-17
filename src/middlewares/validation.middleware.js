import joi from "joi";

const registerUserValidation = (req, res, next) => {
	// fullName, username, email, password
	const schema = joi.object({
		fullname: joi.string().required(),
		email: joi.string().email().required(),
		password: joi.string().min(4).max(100).required(),
		username: joi.string().alphanum().required(),
	});
	const { error } = schema.validate(req.body);
	if (error) {
		return res.json({
			message: "Bad Request",
			error,
		});
	}
	next();
};

export { registerUserValidation };
