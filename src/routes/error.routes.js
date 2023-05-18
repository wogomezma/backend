const express = require('express');
const setLogger = require('../utils/logger');
const useLogger = require('../utils/logger-basic');
const app = express();

app.use(setLogger);
//app.use(useLogger);

class ErrorsRoutes {
    path = "/loggerTest";
    router = express.Router();  // Correct usage
    
    constructor() {
      this.initErrorsRoutes();
    }
  
    initErrorsRoutes() {


        this.router.get(`${this.path}/`, async (req, res) => {
            req.logger.debug('Test debug message');
            req.logger.http('Test http message');
            req.logger.info('Test info message');
            req.logger.warning('Test warning message');
            req.logger.error('Test error message');
            req.logger.fatal('Test fatal message');
            res.send('Testing logger');
        });


        this.router.get(`${this.path}/error`, async (req, res) => {
            req.logger.error(`Error with GET /Error/`);
            res.send("Error en GET /Error/");
            });

        this.router.get(`${this.path}/warn`, async (req, res) => {
            req.logger.warning(`Warn with GET /Warn/`);
            res.send("Warn en GET /Warn/");
        });

        this.router.get(`${this.path}/info`, async (req, res) => {
            req.logger.info(`Info with GET /info/`);
            res.send("Info en GET /info/");
        });

        this.router.get(`${this.path}/http`, async (req, res) => {
            req.logger.http(`HTTP with GET /http/`);
            res.send("HTTP en GET /http/");
        });

        this.router.get(`${this.path}/debug`, async (req, res) => {
            req.logger.debug(`Debug with GET /debug/`);
            res.send("Debug en GET /debug/");
        });

        this.router.get(`${this.path}/fatal`, async (req, res) => {
            try {
                throw new Error("Error en GET /fatal/");
              } catch (error) {
                req.logger.fatal(`Fatal with GET ${error.message}`);
              }
              res.send("Fatal en GET /fatal/");
        });
    }
}

module.exports = ErrorsRoutes;
