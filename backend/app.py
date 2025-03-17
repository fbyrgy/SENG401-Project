import subprocess

# Run all microservices
processes = [
    subprocess.Popen(["python", "connection.py"]), # port: 5001
    subprocess.Popen(["python", "authentication.py"]), # port: 5002
    subprocess.Popen(["python", "news.py"]), # port: 5003
    subprocess.Popen(["python", "stocks.py"]), # port: 5004
    subprocess.Popen(["python", "LLM.py"]), # port: 5005
    subprocess.Popen(["python", "stockmovers.py"]),  # port: 5006
]

for process in processes:
    process.wait()
