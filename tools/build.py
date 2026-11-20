#!/usr/bin/env python3
"""Costruisce Maestria Goriziana da src/ in due file autonomi.

  index.html         pagina completa (doctype, head, body) per GitHub Pages o qualsiasi hosting statico
  dist/artifact.html  stessa pagina senza scheletro, nel formato che si pubblica come artefatto su claude.ai

Uso:  python3 tools/build.py
Non servono dipendenze: i ritratti PNG vengono incorporati come data URI.
"""
import base64, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

def data_uri(name):
    raw = (SRC / "assets" / f"{name}.png").read_bytes()
    return "data:image/png;base64," + base64.b64encode(raw).decode()

css = (SRC / "styles.css").read_text(encoding="utf-8")
body = (SRC / "body.html").read_text(encoding="utf-8")
js = (SRC / "js" / "core.js").read_text(encoding="utf-8") + (SRC / "js" / "ui.js").read_text(encoding="utf-8")
for key in ("pietro", "zibi", "vecio"):
    js = js.replace(f"__{key.upper()}__", data_uri(key))

head = (
    "<title>Maestria Goriziana</title>\n"
    '<meta name="claude:viewport-fit-sides" content="cover">\n'
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600'
    '&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap">\n'
    f"<style>{css}</style>\n\n"
)
scripts = (
    '\n<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n'
    f"<script>\n{js}</script>\n"
)
artifact = head + body + scripts
(ROOT / "dist").mkdir(exist_ok=True)
(ROOT / "dist" / "artifact.html").write_text(artifact, encoding="utf-8")

page = (
    '<!doctype html>\n<html lang="it">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    + head + "<style>body{margin:0}</style>\n</head>\n<body>\n" + body + scripts + "</body>\n</html>\n"
)
(ROOT / "index.html").write_text(page, encoding="utf-8")
print(f"index.html {len(page)//1024} KB · dist/artifact.html {len(artifact)//1024} KB")
