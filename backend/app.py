import subprocess

# Start all services in parallel
processes = [
    subprocess.Popen(["python", "authentication.py"]),
    subprocess.Popen(["python", "connection.py"]),
    subprocess.Popen(["python", "news.py"]),
    subprocess.Popen(["python", "stocks.py"]),
]

# Optional: Wait for all processes to finish (useful for debugging)
for process in processes:
    process.wait()
