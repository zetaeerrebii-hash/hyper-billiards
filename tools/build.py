#!/usr/bin/env python3
"""Costruisce HYPER BILLIARDS da src/ in due file.

  index.html          pagina per GitHub Pages o qualsiasi hosting statico;
                      three.js da vendor/three/ (stesso dominio, niente CDN)
  dist/artifact.html  pagina per l'artefatto claude.ai del team: documento HTML completo
                      (con <!DOCTYPE html>), three.js r128 da cdnjs (host ammesso dagli artefatti)

Uso:  python3 tools/build.py          (nessuna dipendenza)
      python3 tools/build.py --check  (esce con errore se index.html o dist/ non sono aggiornati: usato in CI)
"""
import base64, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
THREE_CDN = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"

def data_uri(name):
    raw = (SRC / "assets" / f"{name}.png").read_bytes()
    return "data:image/png;base64," + base64.b64encode(raw).decode()

css = (SRC / "styles.css").read_text(encoding="utf-8")
body = (SRC / "body.html").read_text(encoding="utf-8")
js = (SRC / "js" / "core.js").read_text(encoding="utf-8") + (SRC / "js" / "ui.js").read_text(encoding="utf-8")
for key in ("pietro", "zibi", "vecio"):
    js = js.replace(f"__{key.upper()}__", data_uri(key))

head = (
    "<title>HYPER BILLIARDS</title>\n"
    '<meta name="claude:viewport-fit-sides" content="cover">\n'
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600'
    '&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap">\n'
    f"<style>{css}</style>\n<style>body{{margin:0}}</style>\n"
)
doc_open = ('<!DOCTYPE html>\n<html lang="it">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n')
app = f"<script>\n{js}</script>\n"

page = (doc_open + head + "</head>\n<body>\n" + body
        + '\n<script src="vendor/three/three.r128.min.js"></script>\n' + app + "</body>\n</html>\n")
artifact = (doc_open + head + "</head>\n<body>\n" + body
            + f'\n<script src="{THREE_CDN}"></script>\n' + app + "</body>\n</html>\n")

out = {ROOT / "index.html": page, ROOT / "dist" / "artifact.html": artifact}
if "--check" in sys.argv:
    stale = [p.relative_to(ROOT).as_posix() for p, t in out.items() if not p.exists() or p.read_text(encoding="utf-8") != t]
    if stale:
        sys.exit("Build non aggiornata: " + ", ".join(stale) + " — eseguire python3 tools/build.py e fare commit")
    print("Build aggiornata"); sys.exit(0)
(ROOT / "dist").mkdir(exist_ok=True)
for p, t in out.items():
    p.write_text(t, encoding="utf-8", newline="\n")
print(f"index.html {len(page)//1024} KB · dist/artifact.html {len(artifact)//1024} KB")
