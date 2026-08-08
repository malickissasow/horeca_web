import os
import sys
import ftplib

FTP_HOST = os.getenv("FTP_HOST", "92.113.24.18")
FTP_PORT = int(os.getenv("FTP_PORT", "21"))
FTP_USER = os.getenv("FTP_USER", "u208608546.app.horecafrica.org")
FTP_PASS = os.getenv("FTP_PASS", "B5@9ll@c")
LOCAL_DIR = os.getenv("LOCAL_DIR", "dist")
REMOTE_DIR = os.getenv("REMOTE_DIR", "public_html")

def ensure_remote_dir(ftp, remote_path):
    dirs = [d for d in remote_path.split("/") if d]
    current = ""
    for d in dirs:
        current += "/" + d
        try:
            ftp.cwd(current)
        except ftplib.error_perm:
            try:
                ftp.mkd(current)
                print(f"📁 Created remote directory: {current}")
            except Exception as e:
                print(f"Warning creating {current}: {e}")

def deploy():
    print(f"🚀 Connecting to FTP {FTP_HOST}:{FTP_PORT}...")
    ftp = ftplib.FTP()
    ftp.connect(FTP_HOST, FTP_PORT, timeout=30)
    print("✅ Connected!")
    
    print(f"🔑 Logging in as {FTP_USER}...")
    ftp.login(FTP_USER, FTP_PASS)
    ftp.set_pasv(True)
    print("✅ Login & Passive Mode activated!")

    if not os.path.exists(LOCAL_DIR):
        print(f"❌ Local directory {LOCAL_DIR} does not exist!")
        sys.exit(1)

    print(f"📤 Uploading files from {LOCAL_DIR}/ to {REMOTE_DIR}/...")
    file_count = 0

    for root, dirs, files in os.walk(LOCAL_DIR):
        rel_path = os.path.relpath(root, LOCAL_DIR)
        if rel_path == ".":
            target_remote = REMOTE_DIR
        else:
            target_remote = f"{REMOTE_DIR}/{rel_path.replace(os.sep, '/')}"

        ensure_remote_dir(ftp, target_remote)
        ftp.cwd(f"/{target_remote}")

        for file in files:
            local_file = os.path.join(root, file)
            print(f"  -> Uploading {file} to /{target_remote}...")
            with open(local_file, "rb") as f:
                ftp.storbinary(f"STOR {file}", f)
            file_count += 1

    ftp.quit()
    print(f"🎉 Deployment completed! {file_count} files successfully uploaded to https://app.horecafrica.org")

if __name__ == "__main__":
    deploy()
