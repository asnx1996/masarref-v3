#!/usr/bin/env python3
"""تنزيل خطوط جوجل محلياً + توليد CSS بمسارات نسبية.

نأخذ مقطعي arabic و latin بس (نفس اللي مسوّينه بـfonts.css الموجود)،
وننزّل ملفات woff2 جوّا fonts/<slug>/ ونكتب fonts/<slug>.css يشير إلهن.
"""
import os, re, sys, urllib.request, pathlib

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

# slug -> (family spec for css2, css font-family name)
FAMILIES = {
    "cairo":   ("Cairo:wght@300..800",                     "Cairo"),
    "tajawal": ("Tajawal:wght@300;400;500;700;800",        "Tajawal"),
    "almarai": ("Almarai:wght@300;400;700;800",            "Almarai"),
    "ibm":     ("IBM+Plex+Sans+Arabic:wght@300;400;500;600;700", "IBM Plex Sans Arabic"),
    "amiri":   ("Amiri:wght@400;700",                      "Amiri"),
    "reem":    ("Reem+Kufi:wght@400..700",                 "Reem Kufi"),
}

KEEP_SUBSETS = {"arabic", "latin"}
ROOT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ".")
FONTS_DIR = ROOT / "fonts"


def get(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=45) as r:
        return r.read()


BLOCK = re.compile(r"/\*\s*([a-z0-9-]+)\s*\*/\s*(@font-face\s*\{.*?\})", re.S)
URL = re.compile(r"url\((https://[^)]+\.woff2)\)")

total = 0
for slug, (spec, fam) in FAMILIES.items():
    css = get(f"https://fonts.googleapis.com/css2?family={spec}&display=swap").decode("utf-8")
    out_dir = FONTS_DIR / slug
    out_dir.mkdir(parents=True, exist_ok=True)

    pieces, n, size = [], 0, 0
    for subset, block in BLOCK.findall(css):
        if subset not in KEEP_SUBSETS:
            continue
        m = URL.search(block)
        if not m:
            continue
        data = get(m.group(1))
        n += 1
        size += len(data)
        name = f"{subset}-{n}.woff2"
        (out_dir / name).write_bytes(data)
        pieces.append(f"/* {subset} */\n" + block.replace(m.group(1), f"{slug}/{name}"))

    header = (f"/* {fam} — منزَّل محلياً من Google Fonts (رخصة OFL).\n"
              f"   مولَّد بسكربت — لا تعدّله بالإيد. */\n")
    (FONTS_DIR / f"{slug}.css").write_text(header + "\n".join(pieces) + "\n", encoding="utf-8")
    total += size
    print(f"{slug:8s} {n:2d} files  {size/1024:7.1f} KB")

print(f"{'TOTAL':8s}      {total/1024:9.1f} KB")
