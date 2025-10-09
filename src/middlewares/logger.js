// logger middleware
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import requestIp from "request-ip";

export const logger = (req, res, next) => {
  const clientIP = requestIp.getClientIp(req);
  const timeNow = new Date().toLocaleTimeString();
  const resource = req.originalUrl;
  const logLine = `${timeNow}, ${clientIP}, ${resource}\n`;

  if (req.originalUrl !== "/favicon.ico") {
    // get current file path
    const _filename = fileURLToPath(import.meta.url);
    const _dirname = dirname(_filename);

    const logsDir = path.join(_dirname, "../../logs");

    // ensure logs directory exists
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const logFile = path.join(logsDir, "access.log");

    // append log line
    fs.appendFile(logFile, logLine, (err) => {
      if (err) console.error("Error writing log:", err);
    });
  }

  // attach info to request
  req.clientIP = clientIP;
  req.timeNow = timeNow;
  req.resource = resource;

  next();
};
