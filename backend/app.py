import subprocess

# Run all microservices
processes = [
    subprocess.Popen(["python", "authentication.py"]),
    subprocess.Popen(["python", "connection.py"]),
    subprocess.Popen(["python", "news.py"]),
    subprocess.Popen(["python", "stocks.py"]),
]

for process in processes:
    process.wait()
