import FTPClient from "ftp";

function connectFTP() {
  const ftp = new FTPClient();
  ftp.connect({
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    port: 21
  });
  return ftp;
}

export function ensureDir(dir) {
  return new Promise((resolve, reject) => {
    const ftp = connectFTP();

    ftp.on("ready", () => {
      ftp.mkdir(dir, true, (err) => {
        ftp.end();
        if (err && err.code !== 550) reject(err);
        else resolve();
      });
    });

    ftp.on("error", reject);
  });
}

export function uploadToFTP(buffer, remotePath) {
  return new Promise((resolve, reject) => {
    const ftp = connectFTP();

    ftp.on("ready", () => {
      ftp.put(buffer, remotePath, (err) => {
        ftp.end();
        if (err) reject(err);
        else resolve();
      });
    });

    ftp.on("error", reject);
  });
}

export function deleteFromFTP(remotePath) {
  return new Promise((resolve, reject) => {
    const ftp = connectFTP();

    ftp.on("ready", () => {
      ftp.delete(remotePath, (err) => {
        ftp.end();
        if (err) reject(err);
        else resolve();
      });
    });

    ftp.on("error", reject);
  });
}
