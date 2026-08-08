import os
import ssl
from ftplib import FTP_TLS

FTP_HOST = "92.113.24.18"
FTP_PORT = 21
FTP_USER = "u208608546.app.horecafrica.org"
FTP_PASS = "B5@9ll@c"
LOCAL_DIST_DIR = os.path.abspath("./dist")

class ImplicitFTP_TLS(FTP_TLS):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._sock = None

    def connect(self, host='', port=0, timeout=-999):
        res = super().connect(host, port, timeout)
        self.sock = self.context.wrap_socket(self.sock, server_hostname=self.host)
        return res

def upload_directory(ftps, local_dir, remote_dir):
    try:
        ftps.cwd(remote_dir)
    except Exception:
        ftps.mkd(remote_dir)
        ftps.cwd(remote_dir)

    for item in os.listdir(local_dir):
        local_path = os.path.join(local_dir, item)
        if os.path.isfile(local_path):
            print(f"  -> Uploading {item} to {remote_dir}...")
            with open(local_path, "rb") as f:
                ftps.storbinary(f"STOR {item}", f)
        elif os.path.isdir(local_path):
            remote_subdir = f"{remote_dir}/{item}".rstrip('/')
            upload_directory(ftps, local_path, remote_subdir)
            ftps.cwd(remote_dir)

def main():
    print(f"🚀 Connecting to FTP {FTP_HOST}:{FTP_PORT} via FTPS (Explicit TLS)...")
    ftps = FTP_TLS()
    ftps.connect(FTP_HOST, FTP_PORT)
    ftps.login(FTP_USER, FTP_PASS)
    ftps.prot_p()
    print("🔒 Connected & Logged in via FTPS (Encrypted Data Channel)!")

    print(f"📤 Deploying web dist/ files to Hostinger public_html/...")
    upload_directory(ftps, LOCAL_DIST_DIR, "/public_html")

    ftps.quit()
    print("🎉 Web App Deployment completed! Live on https://app.horecafrica.org")

if __name__ == "__main__":
    main()
