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
		res.cookie("refresh-token", response.data.refreshToken, {
			httpOnly: true,
			secure: process.env.MODE === "production",
			expires: new Date(Date.now() + response.data.refreshExpiresIn * 1000),
		});
		delete response.data.refreshToken;
		delete response.data.refreshExpiresIn;
		res.status(response.status_code).json(response);
	} catch (error) {
		res.status(error.status_code).json(error);
	}
};

const refreshToken = async (req, res) => {
	const uid = req.uid;

	try {
		const response = await authService.refreshToken(uid);
		res.status(response.status_code).json(response);
	} catch (error) {
		res.status(error.status_code).json(error);
	}
};

const logout = (req, res) => {
	res.clearCookie("refresh-token");
	res.sendStatus(200);
};

export { login, signup, refreshToken, logout };
