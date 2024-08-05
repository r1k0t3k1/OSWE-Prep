import subprocess

def crack_hash(hash):
    print(f"[+] Cracking password...")

    cmd = f"hashcat -m 100 -a 0 {hash} /usr/share/wordlists/rockyou.txt --show"
    proc = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    while True:
        line = proc.stdout.readline()
        if line:
            yield line

        if not line and proc.poll() is not None:
            break

hash = "a3196843b24ad61987c3d145f2d6a2d67e53a256" 
for line in crack_hash(hash):
    if f"{hash}:" in line.decode():
        print(line.decode().split(":")[1])
