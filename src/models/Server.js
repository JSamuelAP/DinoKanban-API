import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

import { connectToDB } from "../database/config.js";
import authRouter from "../routes/auth.routes.js";
import usersRouter from "../routes/users.routes.js";
import boardsRouter from "../routes/boards.routes.js";
import cardsRouter from "../routes/cards.routes.js";

/**
 * Class for REST API
 *
 * @class Server
 */
class Server {
	constructor() {
		this.app = express();
		this.PORT = process.env.PORT || 3000;
		this.PATHS = {
			auth: "/api/v1/auth",
			users: "/api/v1/users",
			boards: "/api/v1/boards",
			cards: "/api/v1/cards",
		};
		this.allowedDomains = [
			process.env.FRONTEND_DEV_URL,
			process.env.FRONTEND_PROD_URL,
		];

		this.connectDB();
		this.setMiddlewares();
		this.setRoutes();
	}

	async connectDB() {
		await connectToDB();
	}

	setMiddlewares() {
		this.app.use(
			cors({
				origin: function (origin, callback) {
					if (this.allowedDomains.indexOf(origin) !== -1) callback(null, true);
					else callback(new Error("Not allowed by CORS"));
				},
				credentials: true,
			})
		);
		this.app.use(express.json());
		this.app.use(cookieParser());
		this.app.use(express.static("public"));
		this.app.use(morgan("dev"));
	}

	setRoutes() {
		this.app.use(this.PATHS.auth, authRouter);
		this.app.use(this.PATHS.users, usersRouter);
		this.app.use(this.PATHS.boards, boardsRouter);
		this.app.use(this.PATHS.cards, cardsRouter);
	}

	/**
	 * Starts the server on its port
	 */
	start() {
		this.app.listen(this.PORT, () => {
			console.log(`🚀 Server running on port ${this.PORT}`);
		});
	}
}

export default Server;
