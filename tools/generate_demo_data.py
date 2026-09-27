#!/usr/bin/env python3
"""Genereert de demodata van VoltYard (deterministisch, seed 42).

Uitvoer in demo/:
  regelprofielen.json, zones.json, laders.json,
  schip-voltara-400.csv (importdemo, 2 bewust ongeldige rijen),
  seed-voertuigen.csv, seed-controles.csv, seed-laadsessies.csv,
  en prototype/sample-data.json (subset voor het klikbare prototype).

Alle merken, modellen, WMI-codes en VIN's zijn FICTIEF.
Gebruik: python3 tools/generate_demo_data.py
"""
import csv, json, random
from datetime import date, datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEMO = ROOT / "demo"
PROTO = ROOT / "prototype"
REFERENTIEDATUM = date(2026, 9, 28)  # "vandaag" in de demo; de seed in code verschuift relatief t.o.v. nu
rng = random.Random(42)

# ---------- VIN (ISO 3779, 17 tekens, controlecijfer op positie 9) ----------
TRANSLIT = {**{str(d): d for d in range(10)},
            **dict(zip("ABCDEFGH", range(1, 9))), **dict(zip("JKLMN", range(1, 6))), "P": 7, "R": 9,
            **dict(zip("STUVWXYZ", range(2, 10)))}
WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2]
VDS_CHARS = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789"

def vin_check_digit(vin: str) -> str:
    total = sum(TRANSLIT[c] * w for c, w in zip(vin, WEIGHTS))
    r = total % 11
    return "X" if r == 10 else str(r)

def make_vin(wmi: str, model_code: str, year_code: str, plant: str, serial: int) -> str:
    vds = (model_code + "".join(rng.choice(VDS_CHARS) for _ in range(5 - len(model_code))))[:5]
    body = f"{wmi}{vds}0{year_code}{plant}{serial:06d}"
    return body[:8] + vin_check_digit(body) + body[9:]

# ---------- Fictieve fabrikanten en modellen ----------
FABRIKANTEN = [
    {"code": "VLT", "naam": "Voltara", "land": "China", "wmi": "LVX", "plant": "H",
     "modellen": [{"naam": "Voltara V5", "code": "V5", "aandrijving": "BEV", "kwh": 60.0},
                  {"naam": "Voltara V7 Long Range", "code": "V7", "aandrijving": "BEV", "kwh": 82.0}]},
    {"code": "KST", "naam": "Kestrel Motors", "land": "Duitsland", "wmi": "WKM", "plant": "B",
     "modellen": [{"naam": "Kestrel K3", "code": "K3", "aandrijving": "BEV", "kwh": 77.0},
                  {"naam": "Kestrel K5 Hybrid", "code": "K5", "aandrijving": "PHEV", "kwh": 19.7}]},
    {"code": "NHV", "naam": "Nordhavn EV", "land": "Zweden", "wmi": "YNH", "plant": "G",
     "modellen": [{"naam": "Nordhavn N2", "code": "N2", "aandrijving": "BEV", "kwh": 69.0},
                  {"naam": "Nordhavn N4", "code": "N4", "aandrijving": "BEV", "kwh": 107.0}]},
    {"code": "SNL", "naam": "Sunlei", "land": "China", "wmi": "LSN", "plant": "Z",
     "modellen": [{"naam": "Sunlei S1", "code": "S1", "aandrijving": "BEV", "kwh": 45.0},
                  {"naam": "Sunlei S3", "code": "S3", "aandrijving": "BEV", "kwh": 72.0}]},
]

STANDAARD_VERTREK = [
    {"bestemmingsType": "Verscheping", "minSoc": 20, "maxSoc": 50},
    {"bestemmingsType": "Veerboot", "minSoc": 20, "maxSoc": 40},
    {"bestemmingsType": "Truck", "minSoc": 30, "maxSoc": 80},
    {"bestemmingsType": "Trein", "minSoc": 30, "maxSoc": 80},
    {"bestemmingsType": "Dealer", "minSoc": 50, "maxSoc": 80},
]

def profiel(id_, fab, naam, aandrijving, min_, doel, max_, krit, interval, twaalf, ontlaad,
            modelpatroon=None, versie=1, vertrek=None):
    return {"id": id_, "fabrikantCode": fab, "naam": naam, "modelPatroon": modelpatroon,
            "aandrijving": aandrijving, "minOpslagSoc": min_, "doelOpslagSoc": doel, "maxLaadSoc": max_,
            "kritiekSoc": krit, "controleIntervalDagen": interval, "twaalfVoltIntervalDagen": twaalf,
            "standaardOntlaadPerDag": ontlaad, "versie": versie, "geldigVanaf": "2026-06-01",
            "vertrekRegels": vertrek or STANDAARD_VERTREK}

PROFIELEN = [
    profiel("TERMINAL-DEFAULT", None, "Terminal – veilige standaard", "BEV", 35, 50, 60, 20, 7, 14, 0.15),
    profiel("VLT-BEV", "VLT", "Voltara – standaard BEV", "BEV", 30, 50, 60, 15, 14, 14, 0.10, versie=3),
    profiel("VLT-V7", "VLT", "Voltara – V7 Long Range", "BEV", 30, 50, 60, 15, 10, 14, 0.12, modelpatroon="Voltara V7*"),
    profiel("KST-BEV", "KST", "Kestrel – BEV", "BEV", 25, 50, 70, 12, 21, 14, 0.08),
    profiel("KST-PHEV", "KST", "Kestrel – PHEV", "PHEV", 20, 40, 60, 10, 21, 10, 0.20),
    profiel("NHV-BEV", "NHV", "Nordhavn – BEV", "BEV", 30, 55, 60, 15, 14, 14, 0.09,
            vertrek=[{**r, "maxSoc": 45} if r["bestemmingsType"] == "Verscheping" else r for r in STANDAARD_VERTREK]),
    profiel("SNL-BEV", "SNL", "Sunlei – BEV", "BEV", 35, 50, 55, 20, 7, 7, 0.25),
]

def kies_profiel(fab_code, model, aandrijving):
    import fnmatch
    kand = [p for p in PROFIELEN if p["fabrikantCode"] == fab_code and p["aandrijving"] == aandrijving]
    specifiek = [p for p in kand if p["modelPatroon"] and fnmatch.fnmatch(model, p["modelPatroon"])]
    if specifiek: return specifiek[0]
    generiek = [p for p in kand if not p["modelPatroon"]]
    return generiek[0] if generiek else PROFIELEN[0]

ZONES = [
    {"code": "A-STD", "type": "Standaard", "capaciteit": 2500, "maxEvs": 0},
    {"code": "B-EV-1", "type": "EV", "capaciteit": 700, "maxEvs": 520},
    {"code": "B-EV-2", "type": "EV", "capaciteit": 700, "maxEvs": 520},
    {"code": "C-EV-3", "type": "EV", "capaciteit": 600, "maxEvs": 480},  # bewust overschreden in de demo
    {"code": "D-EV-4", "type": "EV", "capaciteit": 600, "maxEvs": 500},
    {"code": "L-LAAD", "type": "Laden", "capaciteit": 60, "maxEvs": 60},
    {"code": "Q-QUAR", "type": "Quarantaine", "capaciteit": 20, "maxEvs": 20},
]
LADERS = ([{"code": f"L{i}", "type": "Vast", "vermogenKw": 22, "zone": "L-LAAD", "aansluitingen": 1,
            "status": "Defect" if i == 17 else "Beschikbaar"} for i in range(1, 21)]
          + [{"code": "M1", "type": "Mobiel", "vermogenKw": 50, "zone": None, "aansluitingen": 1, "status": "Beschikbaar"},
             {"code": "M2", "type": "Mobiel", "vermogenKw": 50, "zone": None, "aansluitingen": 1, "status": "Beschikbaar"}])

serials = {f["code"]: 100000 + rng.randint(0, 5000) for f in FABRIKANTEN}
def nieuwe_vin(fab, model):
    serials[fab["code"]] += rng.randint(1, 9)
    return make_vin(fab["wmi"], model["code"], rng.choice("ST"), fab["plant"], serials[fab["code"]])

def dump(path: Path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

def main():
    dump(DEMO / "regelprofielen.json", {"fabrikanten": [{k: v for k, v in f.items() if k != "plant"} for f in FABRIKANTEN],
                                         "profielen": PROFIELEN})
    dump(DEMO / "zones.json", ZONES)
    dump(DEMO / "laders.json", LADERS)

    # ---- Importdemo: schip met 400 Voltara's, waarvan 2 ongeldig ----
    voltara = FABRIKANTEN[0]
    rows = []
    for i in range(400):
        m = voltara["modellen"][0 if rng.random() < 0.6 else 1]
        rows.append([nieuwe_vin(voltara, m), voltara["naam"], m["naam"], m["aandrijving"], m["kwh"], voltara["code"],
                     rng.choice(["Truck", "Truck", "Trein", "Verscheping"]),
                     (REFERENTIEDATUM + timedelta(days=rng.randint(10, 60))).isoformat()])
    rows[137][0] = rows[137][0][:9] + "O" + rows[137][0][10:]   # 'O' is niet toegelaten in een VIN
    rows[288][0] = rows[288][0][:16]                             # 16 tekens
    with open(DEMO / "schip-voltara-400.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["vin", "merk", "model", "aandrijving", "batterijKwh", "fabrikantCode", "bestemming", "vertrekDatum"])
        w.writerows(rows)

    # ---- Seed: ~2000 voertuigen met geschiedenis ----
    ev_zones = [z["code"] for z in ZONES if z["type"] == "EV"]
    voertuigen, controles, sessies = [], [], []
    for n in range(2000):
        fab = rng.choices(FABRIKANTEN, weights=[40, 20, 15, 25])[0]
        m = rng.choice(fab["modellen"])
        p = kies_profiel(fab["code"], m["naam"], m["aandrijving"])
        vin = nieuwe_vin(fab, m)
        aankomst = REFERENTIEDATUM - timedelta(days=int(rng.triangular(1, 240, 25)))
        soc = rng.randint(28, 72)
        ontlaad = max(0.02, rng.gauss(p["standaardOntlaadPerDag"], p["standaardOntlaadPerDag"] * 0.35))
        twaalf_ok = rng.random() > 0.05
        dag, laatste_soc, idx = aankomst, soc, 0
        schade = rng.random() < 0.008
        while dag <= REFERENTIEDATUM:
            dagen_verder = p["controleIntervalDagen"] + rng.randint(-2, 4)
            if rng.random() < 0.12: dagen_verder += rng.randint(5, 20)  # controle vergeten → te laat
            twaalf = "OK" if twaalf_ok else rng.choice(["Zwak", "Dood"])
            controles.append([vin, datetime.combine(dag, datetime.min.time()).replace(hour=rng.randint(6, 20), minute=rng.randint(0, 59)).isoformat(),
                              round(laatste_soc), twaalf, "true" if (schade and idx == 0) else "false",
                              "true" if (schade and idx == 0 and rng.random() < 0.5) else "false",
                              "Aankomstcontrole" if idx == 0 else "", "Handmatig", p["id"], p["versie"]])
            # laden als onder minimum
            if laatste_soc < p["minOpslagSoc"] and rng.random() < 0.7:
                doel = p["doelOpslagSoc"]
                kwh = round((doel - laatste_soc) / 100 * m["kwh"] / 0.9, 1)
                start = datetime.combine(dag, datetime.min.time()).replace(hour=rng.randint(7, 15))
                sessies.append([vin, rng.choice([l["code"] for l in LADERS if l["status"] != "Defect"]), start.isoformat(),
                                (start + timedelta(hours=max(1, kwh / 20))).isoformat(), round(laatste_soc), doel, kwh, "true"])
                laatste_soc = doel
            nxt = dag + timedelta(days=dagen_verder)
            if nxt > REFERENTIEDATUM: break
            laatste_soc = max(3, laatste_soc - ontlaad * dagen_verder)
            dag, idx = nxt, idx + 1
        zone = "Q-QUAR" if schade else ("A-STD" if rng.random() < 0.01 else rng.choice(ev_zones))
        vertrek = rng.random() < 0.45
        voertuigen.append([vin, fab["code"], fab["naam"], m["naam"], m["aandrijving"], m["kwh"], zone, p["id"],
                           aankomst.isoformat(),
                           (REFERENTIEDATUM + timedelta(days=rng.randint(2, 45))).isoformat() if vertrek else "",
                           rng.choice(["Truck", "Trein", "Verscheping", "Dealer"]) if vertrek else "",
                           "false" if (not twaalf_ok and rng.random() < 0.5) else "true"])

    def write(name, header, data):
        with open(DEMO / name, "w", newline="", encoding="utf-8") as fh:
            w = csv.writer(fh); w.writerow(header); w.writerows(data)
    write("seed-voertuigen.csv", ["vin", "fabrikantCode", "merk", "model", "aandrijving", "batterijKwh", "zone",
                                  "regelProfielId", "aangekomenOp", "vertrekDatum", "bestemming", "rijvaardig"], voertuigen)
    write("seed-controles.csv", ["vin", "gemetenOp", "soc", "twaalfVoltStatus", "schadeGemeld", "verdachteBatterij",
                                 "opmerking", "bron", "regelProfielId", "regelProfielVersie"], controles)
    write("seed-laadsessies.csv", ["vin", "lader", "start", "einde", "startSoc", "eindSoc", "kwh", "kwhGeschat"], sessies)

    # ---- Subset voor het prototype: 60 voertuigen, met de meest "interessante" voorop ----
    laatste = {}
    for c in controles: laatste[c[0]] = c
    hist = {}
    for c in controles: hist.setdefault(c[0], []).append({"t": c[1][:10], "soc": c[2]})
    def score(v):
        c = laatste[v[0]]; p = next(p for p in PROFIELEN if p["id"] == v[7])
        return (c[2] < p["minOpslagSoc"]) * 3 + (v[6] == "Q-QUAR") * 4 + (c[3] != "OK") * 2 + (v[6] == "A-STD") * 2
    subset = sorted(voertuigen, key=score, reverse=True)[:24] + rng.sample(voertuigen, 36)
    seen, proto = set(), []
    for v in subset:
        if v[0] in seen: continue
        seen.add(v[0]); c = laatste[v[0]]
        proto.append({"vin": v[0], "fab": v[1], "merk": v[2], "model": v[3], "aandrijving": v[4], "kwh": v[5],
                      "zone": v[6], "profiel": v[7], "aankomst": v[8], "vertrek": v[9] or None, "bestemming": v[10] or None,
                      "rijvaardig": v[11] == "true", "soc": c[2], "twaalfV": c[3], "laatsteControle": c[1][:10],
                      "historiek": hist[v[0]][-8:]})
    vin_fab = {v[0]: v[1] for v in voertuigen}
    facturatie = {}
    for s_ in sessies:
        if s_[2].startswith(REFERENTIEDATUM.strftime("%Y-%m")):
            f = facturatie.setdefault(vin_fab[s_[0]], {"sessies": 0, "kwh": 0.0})
            f["sessies"] += 1; f["kwh"] = round(f["kwh"] + s_[6], 1)
    zone_telling = {z["code"]: sum(1 for v in voertuigen if v[6] == z["code"]) for z in ZONES}
    dump(PROTO / "sample-data.json", {"referentiedatum": REFERENTIEDATUM.isoformat(), "profielen": PROFIELEN,
                                      "fabrikanten": [{"code": f["code"], "naam": f["naam"]} for f in FABRIKANTEN],
                                      "zones": [{**z, "aantal": zone_telling[z["code"]]} for z in ZONES],
                                      "laders": LADERS, "facturatie": facturatie, "voertuigen": proto, "totaalVoertuigen": len(voertuigen)})
    # ---- Prototype bouwen: data in de HTML-template injecteren (één zelfstandig bestand) ----
    data = json.loads((PROTO / "sample-data.json").read_text(encoding="utf-8"))
    tpl = (PROTO / "index.template.html").read_text(encoding="utf-8")
    (PROTO / "index.html").write_text(tpl.replace("__DATA__", json.dumps(data, ensure_ascii=False, separators=(",", ":"))), encoding="utf-8")
    print(f"{len(voertuigen)} voertuigen, {len(controles)} controles, {len(sessies)} laadsessies, prototype: {len(proto)}")

if __name__ == "__main__":
    main()
