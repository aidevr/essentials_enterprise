## `who`
### Who is logged in
```bash
who
whoami
```

---

## `awk`
`awk` is a tiny, single-purpose scripting language built into almost every Unix/Linux system. Think of it as a data-driven Swiss-army knife.

```bash
awk '{print $1, $3}' file.txt  # prints 1st & 3rd columns
who | awk '{print $1}'
```

### Why people love `awk`
1. No loop boilerplate – reading line-by-line is implicit.
2. Built-in math, regex, and associative arrays (e.g., `cnt[key]++`).
3. Portable – ships with busybox, macOS, every Linux distro.

```bash
awk -F, 'NR>1 { sum += $2 } END { print sum }' sales.csv
```

| Piece               | Purpose                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------ |
| `-F,`               | Sets the field separator to a comma, so `$1`, `$2`, `$3` map to *item*, *amount*, *date*.  |
| `NR>1`              | Skips the header row (`NR` = record number). Remove this guard if your file has no header. |
| `{ sum += $2 }`     | Adds the numeric value in column 2 to the running total `sum` for every data row.          |
| `END { print sum }` | After the last line, prints the accumulated total—in this case **1800**.                   |

---

## `grep`
`grep` (“global regular expression print”) is the go-to Unix command for scanning text and showing only the lines that match a pattern. It streams through input line-by-line—so it’s lightning-fast even on multi-gigabyte logs—and supports both plain strings and powerful regular expressions.

### Examples:
1. **Case-insensitive search**
   ```bash
   grep -i "error" app.log
   ```
   → Prints every line that contains “error”, “Error”, or “ERROR”.

2. **Count matches instead of showing them**
   ```bash
   grep -c "404" access.log
   ```
   → Outputs the number of HTTP 404 lines.

3. **Show line numbers for context**
   ```bash
   grep -n "^Fatal" system.log
   ```
   → Example output: `23:Fatal: disk failure` (prefixes each hit with its line number).

4. **Invert match (everything that *doesn’t* match)**
   ```bash
   grep -v "^#" config.conf
   ```
   → Useful for stripping comment lines that start with `#`.

5. **Recursive search through a codebase**
   ```bash
   grep -R --color -E "TODO|FIXME" src/
   ```
   → Walks every file under `src/`, highlights TODO or FIXME.

6. **Show surrounding context lines**
   ```bash
   grep -A2 -B1 "panic" kernel.log
   ```
   → 1 line *Before* and 2 lines *After* each “panic” for quick diagnosis.

| Flag      | Meaning                                           |
| --------- | ------------------------------------------------- |
| `-i`      | Ignore case                                       |
| `-c`      | Count matches                                     |
| `-n`      | Show line numbers                                 |
| `-v`      | Invert (show non-matches)                         |
| `-R`      | Recurse through sub-directories                   |
| `-E`      | Extended regex (no backslash for `+`, `{n}` etc.) |
| `--color` | Highlight the matched text                        |

---

## `grep` powered with `awk`
### 1. Count the number of unique IPs that caused 404 errors
```bash
grep ' 404 ' access.log | awk '{print $1}' | sort -u | wc -l
```

| Stage              | What it does                                       |
| ------------------ | -------------------------------------------------- |
| `grep ' 404 '`     | Keep only lines where the HTTP status is 404.      |
| `awk '{print $1}'` | Extract the **first field** = client IP.           |
| `sort -u`          | De-duplicate the IPs (stable way before counting). |
| `wc -l`            | Print the final count of distinct offenders.       |

### 2. How many Coffee sales exceeded 400 PKR?
```bash
grep '^Coffee,' sales.csv | awk -F, '$2 > 400' | wc -l
```

| Stage                | Explanation                                                                       |
| -------------------- | --------------------------------------------------------------------------------- |
| `grep '^Coffee,'`    | Quickly filters rows beginning with **Coffee**.                                   |
| `awk -F, '$2 > 400'` | CSV delimiter (`-F,`); pass through only those where **column 2** (amount) > 400. |
| `wc -l`              | Counts the qualifying rows.                                                       |

---

## File Descriptors → Sockets → Essential Inspection Commands

### 1. File Descriptors (FDs) — the Foundation
- Every open **file, pipe, socket, or device** in a Linux process is referenced by a small integer — the **file descriptor**.  
- The first three are always reserved:  

| FD  | Purpose      |
| --- | ------------ |
| `0` | **stdin**    |
| `1` | **stdout**   |
| `2` | **stderr**   |

```bash
# Inspect the FDs of the current shell
ls -l /proc/$$/fd
```

---

### 2. Sockets & Active-Connection Inspection
#### `ss` — the Modern Netstat
Small, lightning-fast.

| Switch | Meaning                              | Example Output (trimmed)                      |
| ------ | ------------------------------------ | --------------------------------------------- |
| `-t`   | Show TCP sockets                     | `ESTAB 0 0 192.0.2.8:56784 93.184.216.34:443` |
| `-u`   | Show UDP sockets                     | `UNCONN 0 0 0.0.0.0:123 0.0.0.0:*`            |
| `-n`   | Numeric IP/ports (skip DNS)          | –                                             |
| `-a`   | All states (LISTEN, ESTAB, …)        | –                                             |
| `-p`   | Show owning **PID / process** (root) | `users:(("nginx",pid=1324,fd=7))`             |
| `-l`   | Only **LISTEN** sockets              | –                                             |

```bash
# All listening TCP ports + owning PID
sudo ss -ltnp

# Count established outbound HTTPS connections
ss -tn state established '( dport = :443 )' | wc -l

# High-level socket summary
ss -s
```

---

### 3. `lsof -i` — Who Owns Which Network FD?
| Switch  | Purpose                                 |
| ------- | --------------------------------------- |
| `-i`    | Show Internet sockets (TCP/UDP)         |
| `-n`    | Numeric IPs (skip DNS)                  |
| `-P`    | Numeric ports (skip service names)      |
| `:PORT` | Restrict to a given port (e.g., `:443`) |

```bash
# All processes with network FDs (no DNS lookups)
sudo lsof -i -n -P | head -5

# Who’s bound to port 8080?
sudo lsof -i:8080 -n -P
```

---

### 4. Quick FD-Count per Process
```bash
# How many FDs is PID 2541 using?
ls /proc/2541/fd | wc -l
```

---

### `ulimit` & `sysctl` — Controlling Resource Limits in Linux
#### 1. `ulimit` (shell built-in)
| Flag | Resource                  | Example (`bash`)             |
| ---- | ------------------------- | ---------------------------- |
| `-n` | **open files**            | `ulimit -n` → view           |
| `-u` | Max **user processes**    | `ulimit -u 16384`            |
| `-c` | Core-dump file size       | `ulimit -c unlimited`        |
| `-a` | Show **all** limits       | `ulimit -a`                  |

#### 2. `sysctl` (kernel runtime parameters)
```bash
# View a single value
sysctl net.ipv4.ip_local_port_range

# Change (runtime, not persisted)
sudo sysctl -w net.core.somaxconn=4096
```

---

## Linux Command Quick‑Reference (Hands‑On Cheatsheet)
| Topic                | Goal                                   | Command Example                  | What It Does                     |
| -------------------- | ------------------------------------- | -------------------------------- | -------------------------------- |
| **File Permissions** | Set read‑write for owner, read‑only for group, none for others | `chmod 640 report.txt`          | Changes mode bits → `rw- r-- ---` |
| **File Ownership**   | Give the current user ownership of a file | `sudo chown $USER:$USER report.txt` | Sets user **and** group to you |
| **Compression**      | Create a gzipped tarball of all `.log` files | `tar -czf logs.tar.gz *.log`    | `-c` create, `-z` gzip, `-f` filename |
| **Process Viewer**   | Live CPU / memory monitor             | `top`                           | Inside **top** press `M` (mem) or `q` (quit) |
| **Environment Var**  | Define & print a variable in the current shell | `export DEMO=42 && echo $DEMO` | Stores `DEMO`; echoes `42`      |
| **Full Process List**| Show every running process with user & start time | `ps -ef`                      | `-e` all PIDs, `-f` full format |

---

### Pro Tip
```bash
# Who owns the most open files?
lsof | awk '{print $3}' | sort | uniq -c | sort -nr | head
```

### Expanded Examples with Context
#### 1. Permissions
`ls -l report.txt`


`chmod 640 report.txt`

Result: owner can read/write; group read-only; others no access.


### 2.  Ownership
`sudo chown bob:finance report.txt`
`ls -l report.txt`
-rw-r----- 1 bob finance 0 Jun 16 16:02 report.txt

### 3. Compression
tar -czf logs.tar.gz *.log   # create
tar -tzf logs.tar.gz         # list contents
tar -xzf logs.tar.gz         # extract

### 4. top
top – starts live view.

Press M – sort by memory.

Press 1 – show CPU per core.

Press q – quit.



### 5. export API_KEY=abc123
`echo $API_KEY            # prints abc123`

`unset API_KEY            # removes it`

### 6. ps -ef
```bash
ps -ef | head -5
UID    PID  PPID  C STIME TTY          TIME CMD
root     1     0  0 10:00 ?        00:00:02 /sbin/init
alice  724     1  0 10:01 ?        00:00:00 /usr/lib/systemd/systemd --user
alice  750   724  0 10:01 ?        00:00:00 (sd-pam)
alice 1043   850  1 10:02 pts/0    00:00:00 top

```
UID user - PID process ID - PPID parent - C CPU%

STIME start - CMD command line
