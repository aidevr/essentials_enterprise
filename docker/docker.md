# Docker Quick-Start Guide

> A concise cheatsheet of essential Docker commands plus a minimal example Dockerfile you can copy‑paste.

---

## 1 · Core CLI Commands

| Action | Command | Notes |
|--------|---------|-------|
| **Pull an image** | `docker pull ubuntu:22.04` | Downloads the specified tag from Docker Hub (defaults to `latest`). |
| **List images** | `docker images` | Shows local image cache. |
| **Run a container (interactive)** | `docker run -it --name demo ubuntu:22.04 bash` | `-it` for interactive TTY. |
| **Run in background** | `docker run -d -p 8080:80 nginx:alpine` | `-d` detached; `-p` maps ports. |
| **Run Redis in background** | `docker run -d --name redis-server -p 6379:6379 redis:alpine` | `-d` detached; `-p` maps ports. |
| **List running containers** | `docker ps` | Add `-a` for stopped ones. |
| **Stop / remove** | `docker stop <ID>` · `docker rm <ID>` | Or `docker rm -f <ID>` to force. |
| **Exec into container** | `docker exec -it <ID> bash` | Opens shell inside running container. |
| **Exec into Redis CLI** | `docker exec -it redis-server redis-cli` | Opens Redis CLI inside the running container. |
| **View logs** | `docker logs -f <ID>` | `-f` = follow (tail). |
| **Copy file in/out** | `docker cp host.txt <ID>:/tmp/` | Works both directions. |
| **Build image** | `docker build -t myapp:1.0 .` | Dot = current directory context. |
| **Tag & push** | `docker tag myapp:1.0 username/myapp:1.0`<br>`docker push username/myapp:1.0` | Requires `docker login`. |

---

## 2 · Minimal Dockerfile Example (Flask)

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
EXPOSE 5000
CMD ["python", "app.py"]
```

<details>
<summary><strong>Context files</strong></summary>

```text
app/
 ├─ app.py
 └─ requirements.txt
```

**requirements.txt**

```
flask==3.0.0
```

**app.py**

```python
from flask import Flask
app = Flask(__name__)

@app.get("/")
def hello():
    return "Hello Docker!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```
</details>

### Build & Run

```bash
docker build -t flask-demo .
docker run -d -p 5000:5000 --name flask1 flask-demo
```

Navigate to **http://localhost:5000** → *Hello Docker!* appears.

---

## 3 · Handy One-Liners

```bash
# List environment variables inside a container
docker exec <ID> env

# Disposable Alpine shell
docker run --rm -it --entrypoint bash alpine

# Export container filesystem
docker export <ID> > container.tar
```