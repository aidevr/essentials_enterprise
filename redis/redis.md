# Redis Hands-On Micro-Lab (≈ 10 minutes)

> Ensure Redis is running on **localhost:6379** and open a CLI with `redis-cli`.

---

## 0 – 1 min • Ping

```bash
redis-cli ping
# → PONG
```

---

## 1 – 2 min • String Set & Get

```bash
SET greeting "Hello Redis!"
GET greeting
```

---

## 2 – 3 min • Key Expiry

```bash
SET temp 123 EX 5     # expires after 5 s
TTL temp
```

---

## 3 – 4 min • Counter

```bash
INCR page:home
INCRBY page:home 5
GET page:home   # → 6
```

---

## 4 – 5 min • List Queue

```bash
LPUSH tasks "build" "test"
RPUSH tasks "deploy"
LRANGE tasks 0 -1     # build, test, deploy
LPOP tasks            # pops build
```

---

## 5 – 6 min • Pub / Sub (two terminals)

**Terminal A**

```bash
redis-cli
SUBSCRIBE news
```

**Terminal B**

```bash
redis-cli
PUBLISH news "Redis 7.2 released!"
```

---

## 6 – 7 min • Snapshot

```bash
SAVE
CONFIG GET dir
```

---

## 7 – 8 min • Cleanup

```bash
KEYS *
DEL greeting temp
FLUSHDB          # ⚠️ clears current DB
```

---

### Quick Reference

| Command | Description |
|---------|-------------|
| `SET` / `GET` | Simple KV operations |
| `INCR`, `INCRBY` | Atomic counters |
| `LPUSH`, `RPUSH`, `LPOP` | List as queue |
| `PUBLISH`, `SUBSCRIBE` | Lightweight pub‑sub |
| `SAVE`, `BGSAVE` | Snapshot to RDB |
| `FLUSHDB` / `FLUSHALL` | Clear DB(s) |

> **Tip:** Run `MONITOR` in another terminal to watch every Redis command live.
    