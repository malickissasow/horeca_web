import os
import sys
import ftplib
import ssl
import time

FTP_HOST = os.getenv("FTP_HOST", "92.113.24.18")
FTP_PORT = int(os.getenv("FTP_PORT", "21"))
FTP_USER = os.getenv("FTP_USER", "u208608546.app.horecafrica.org")
FTP_PASS = os.getenv("FTP_PASS", "B5@9ll@c")
LOCAL_DIR = os.getenv("LOCAL_DIR", "dist")
REMOTE_DIR = os.getenv("REMOTE_DIR", "public_html")

def connect_ftp():
    print(f"🚀 Connecting to FTP {FTP_HOST}:{FTP_PORT}...")
    for attempt in range(1, 4):
        # Try FTPS (Explicit TLS)
        try:
            print(f"🔒 Attempt {attempt}/3: Connecting via FTPS (TLS)...")
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE

            ftps = ftplib.FTP_TLS(context=context)
            ftps.trust_server_pasv_ipv4_address = True
            ftps.connect(FTP_HOST, FTP_PORT, timeout=15)
            ftps.login(FTP_USER, FTP_PASS)
            ftps.prot_p()  # Enforce encrypted data channel
            ftps.set_pasv(True)
            print("🔒 Connected & Logged in via FTPS (Encrypted Data Channel)!")
            return ftps
        except Exception as e:
            print(f"⚠️ FTPS Attempt {attempt} failed ({e})")

        # Try Plain FTP
        try:
            print(f"⚡ Attempt {attempt}/3: Connecting via Plain FTP...")
            ftp = ftplib.FTP()
            ftp.trust_server_pasv_ipv4_address = True
            ftp.connect(FTP_HOST, FTP_PORT, timeout=15)
            ftp.login(FTP_USER, FTP_PASS)
            ftp.set_pasv(True)
            print("✅ Connected & Logged in via Plain FTP!")
            return ftp
        except Exception as e:
            print(f"⚠️ Plain FTP Attempt {attempt} failed ({e})")

        if attempt < 3:
            print("⏳ Waiting 3 seconds before next retry...")
            time.sleep(3)

    raise RuntimeError(f"❌ Failed to connect to Hostinger FTP {FTP_HOST} after 3 attempts.")

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

def safe_upload_file(ftp, local_file, file_name):
    # Delete any leftover Hostinger .in.filename. temp lock file
    try:
        ftp.delete(f".in.{file_name}.")
    except Exception:
        pass

    try:
        with open(local_file, "rb") as f:
            ftp.storbinary(f"STOR {file_name}", f)
    except Exception as e:
        print(f"⚠️ Retry upload for {file_name} ({e})...")
        try:
            ftp.delete(f".in.{file_name}.")
        except Exception:
            pass
        try:
            with open(local_file, "rb") as f:
                ftp.storbinary(f"STOR {file_name}", f)
        except Exception as e2:
            print(f"Warning storing {file_name}: {e2}")

def deploy():
    ftp = connect_ftp()

    if not os.path.exists(LOCAL_DIR):
        print(f"❌ Local directory {LOCAL_DIR} does not exist!")
        sys.exit(1)

    print(f"📤 Uploading dist/ files to Hostinger {REMOTE_DIR}/...")
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
            print(f"  -> Uploading {rel_path}/{file} to /{target_remote}...")
            safe_upload_file(ftp, local_file, file)
            file_count += 1

    try:
        ftp.quit()
    except Exception:
        pass

    print(f"🎉 Web App Deployment completed! {file_count} files successfully uploaded to https://app.horecafrica.org")

if __name__ == "__main__":
    deploy()
