import authService from "../services/auth.services.js";

const signup = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		const response = await authService.signup(username, email, password);
		res.status(response.status_code).json(response);
	} catch (error) {
		res.status(error.status_code).json(error);
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const response = await authService.login(email, password);
		res.status(response.status_code).json(response);
	} catch (error) {
		res.status(error.status_code).json(error);
	}
};

export { login, signup };
