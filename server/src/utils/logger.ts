import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { appLogger } from "./app-logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para crear directorio de logs si no existe
export function ensureLogDirectory() {
  const logDir = path.join(__dirname, "../../../logs/mercadopago");
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  return logDir;
}

// Función para escribir logs
export function writeLog(data: any) {
  try {
    const logDir = ensureLogDirectory();
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(logDir, `${today}.log`);
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${JSON.stringify(data)}\n`;

    fs.appendFile(logFile, logEntry, (error) => {
      if (error) {
        appLogger.error('payment.log_write_failed', { error: error.message });
      }
    });
  } catch (error) {
    appLogger.error('payment.log_write_failed', { error: error instanceof Error ? error.message : String(error) });
  }
}
