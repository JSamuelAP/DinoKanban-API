import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';

import { connectToDB } from '../database/config.js';
import authRouter from '../routes/auth.routes.js';
import boardsRouter from '../routes/boards.routes.js';
import cardsRouter from '../routes/cards.routes.js';
import { formatResponse } from '../helpers/formatResponse.js';

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
      docs: '/api/v1/',
      auth: '/api/v1/auth',
      boards: '/api/v1/boards',
      cards: '/api/v1/cards',
    };

    this.connectDB();
    this.setMiddlewares();
    this.setRoutes();
  }

  async connectDB() {
    await connectToDB();
  }

  setMiddlewares() {
    const corsOptions = {
      origin: [process.env.FRONTEND_DEV_URL, process.env.FRONTEND_PROD_URL],
      credentials: true,
    };

    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(express.static('public'));
    this.app.use(morgan('dev'));
  }

  setRoutes() {
    this.app.get(this.PATHS.docs, (req, res) =>
      res.redirect('https://documenter.getpostman.com/view/27778436/2s9Ykq7LXn')
    );
    this.app.use(this.PATHS.auth, authRouter);
    this.app.use(this.PATHS.boards, boardsRouter);
    this.app.use(this.PATHS.cards, cardsRouter);
    this.app.use((req, res, next) => {
      const { method, url } = req;
      res
        .status(404)
        .json(formatResponse(404, `Error: ${method} ${url} not found`));
    });
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
