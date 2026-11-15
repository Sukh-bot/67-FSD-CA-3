/**
 * Custom Request Logging Middleware
 * Captures Method, URL, Client IP, and calculates Response Time
 * FSD Continuous Assessment (CA-3) | Roll No: 67
 */

function requestLogger(req, res, next) {
  const startTime = process.hrtime();
  const timestamp = new Date().toISOString();

  // Log on response completion
  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const timeInMs = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);
    const status = res.statusCode;

    let color = '\x1b[32m'; // green for 2xx
    if (status >= 400 && status < 500) color = '\x1b[33m'; // yellow for 4xx
    if (status >= 500) color = '\x1b[31m'; // red for 5xx

    console.log(
      `[${timestamp}] \x1b[35m[EXPRESS-LOG]\x1b[0m ${req.method} ${req.originalUrl || req.url} ` +
      `${color}${status}\x1b[0m - ${timeInMs}ms | IP: ${req.ip || '127.0.0.1'}`
    );
  });

  next();
}

module.exports = requestLogger;
