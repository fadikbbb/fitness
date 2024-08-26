const winston = require('winston');
const morgan = require('morgan');

// Configure logger with winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// Add console logging in non-production environments
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

// Create morgan middleware to use winston for logging HTTP requests
const morganMiddleware = morgan('combined', {
    stream: {
        write: message => logger.info(message.trim())
    }
});

module.exports = { logger, morganMiddleware };
 