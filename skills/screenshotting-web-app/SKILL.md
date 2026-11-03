---
name: screenshotting-web-app
description: Use when needing a screenshot of a web app that requires login (SPA behind auth), especially when no browser-automation tool (Playwright/Selenium) is installed but Chrome and the app's auth mechanism are available.
---

# Screenshotting a Login-Gated Web App

Screenshot SPA ber-login memakai **Chrome headless + Chrome DevTools Protocol (CDP)**,
tanpa perlu Playwright/Selenium. Token auth diinjeksi lewat `localStorage` sebelum
navigasi ke halaman target.

## Prasyarat

- Google Chrome terinstall.
- `websocket-client`: `pip install websocket-client`.
- Backend + frontend hidup, dan kamu tahu endpoint login + key localStorage token-nya.

## Langkah

### 1. Jalankan app (atur port, cek tabrakan)

Backend/frontend mungkin sudah dipakai project lain. Cek dulu:

```bash
lsof -nP -iTCP:4200 -sTCP:LISTEN   # siapa yang pakai 4200?
```

Jalankan di port bebas bila tabrakan, dan arahkan frontend ke backend yang benar
(mis. ubah `api-url.ts` sementara, revert setelah selesai).

### 2. Ambil token via curl

```bash
TOKEN=$(curl -s -X POST http://127.0.0.1:8001/api/login \
  -H 'Content-Type: application/json' -H 'Accept: application/json' \
  -d '{"email":"andi@example.com","password":"password"}' \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['token'])")
```

Catat juga bentuk objek user yang disimpan app (untuk `localStorage` kedua).

### 3. Launch Chrome headless

```bash
rm -rf /tmp/chrome-shot
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-shot --no-first-run --no-default-browser-check \
  --window-size=1440,900 about:blank &
```

### 4. Drive via CDP: set token → navigasi → screenshot

```python
import json, time, base64, urllib.request, websocket

def ws_url():
    data = json.load(urllib.request.urlopen("http://127.0.0.1:9222/json"))
    return next(t["webSocketDebuggerUrl"] for t in data if t["type"] == "page")

ws = websocket.create_connection(ws_url(), timeout=60)
_id = [0]
def send(method, params=None):
    _id[0] += 1; mid = _id[0]
    ws.send(json.dumps({"id": mid, "method": method, "params": params or {}}))
    while True:
        m = json.loads(ws.recv())
        if m.get("id") == mid:
            return m.get("result", {})

send("Page.enable"); send("Runtime.enable")
send("Page.navigate", {"url": "http://localhost:4200/"})   # muat dulu di origin yang benar
time.sleep(4)
expr = "localStorage.setItem('appraisal_token','%s'); localStorage.setItem('appraisal_user','%s');" % (TOKEN, USER_JSON)
send("Runtime.evaluate", {"expression": expr, "returnByValue": True})
send("Page.navigate", {"url": "http://localhost:4200/assess/4"})  # halaman target
time.sleep(6)
res = send("Page.captureScreenshot", {"format": "png"})
open("shot.png", "wb").write(base64.b64decode(res["data"]))
```

Kunci: `localStorage` harus di-set pada **origin yang sama** dengan halaman target
(lihat "jebakan" di bawah).

## Verifikasi sebelum percaya hasilnya

Screenshot 4–5 KB biasanya **kosong/blank**. Selalu cek isi halaman dulu lewat dump
`innerText`, bukan cuma ukuran file:

```python
r = send("Runtime.evaluate", {"expression": "document.body.innerText.slice(0,600)", "returnByValue": True})
print(r.get("result", {}).get("value"))   # pastikan konten benar-benar termuat
```

## Jebakan umum

| Gejala | Sebab / solusi |
| --- | --- |
| Screenshot kosong (beberapa KB) | Halaman belum render / redirect ke login. Dump `innerText` untuk lihat apa yang sebenarnya tampil. |
| Redirect ke `/login` | Token tidak terbaca. Set `localStorage` di origin yang benar, lalu navigasi ulang (full reload). |
| `localStorage` ke-set di origin salah | `about:blank` / origin lain. Muat dulu `http://localhost:PORT/`, tunggu commit navigasi, baru set token. |
| Port sudah dipakai | Project lain jalan — cek `lsof`, pakai port bebas. |
| Server mati setelah perintah | Proses background `( ... &)` bisa mati saat shell keluar. Pakai mekanisme background yang benar. |
| Token expired / salah user | Ambil token fresh via curl; pastikan user punya akses ke halaman target. |

## Bersihkan setelah selesai

Kill Chrome headless (`pkill -f remote-debugging-port=9222`) dan kembalikan konfig
sementara (mis. `api-url.ts`).
