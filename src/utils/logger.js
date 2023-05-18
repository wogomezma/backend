const winston = require("winston");

// Define los niveles de logging
const myCustomLevels = {
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5
  }
};

// Configuración del devLogger
const devLogger = winston.createLogger({
  levels: myCustomLevels.levels,
  level: "debug",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

// Configuración del QALogger
const qaLogger = winston.createLogger({
  levels: myCustomLevels.levels,
  level: "debug",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

// Configuración del ProductionLogger
const prodLogger = winston.createLogger({
  levels: myCustomLevels.levels,
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "errors.log", level: "error" }),
  ],
  exitOnError: false // no salga en excepciones controladas
});

const loggersLevels = {
  production: prodLogger,
  development: devLogger,
  qa: qaLogger
};

function setLogger(req, res, next) {
  req.logger = loggersLevels[process.env.NODE_ENV];
  next();
}

module.exports = setLogger;
