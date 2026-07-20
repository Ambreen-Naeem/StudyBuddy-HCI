# -*- coding: utf-8 -*-
import math
from statistics import mean, median, stdev, NormalDist

# ---------- special functions (Numerical Recipes) ----------
def gammln(xx):
    cof = [76.18009172947146, -86.50532032941677, 24.01409824083091,
           -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]
    x = xx; y = xx; tmp = x + 5.5; tmp -= (x + 0.5) * math.log(tmp); ser = 1.000000000190015
    for c in cof:
        y += 1; ser += c / y
    return -tmp + math.log(2.5066282746310005 * ser / x)

def betacf(a, b, x):
    MAXIT = 300; EPS = 3e-12; FPMIN = 1e-300
    qab = a + b; qap = a + 1; qam = a - 1; c = 1.0; d = 1 - qab * x / qap
    if abs(d) < FPMIN: d = FPMIN
    d = 1 / d; h = d
    for m in range(1, MAXIT + 1):
        m2 = 2 * m
        aa = m * (b - m) * x / ((qam + m2) * (a + m2))
        d = 1 + aa * d
        if abs(d) < FPMIN: d = FPMIN
        c = 1 + aa / c
        if abs(c) < FPMIN: c = FPMIN
        d = 1 / d; h *= d * c
        aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2))
        d = 1 + aa * d
        if abs(d) < FPMIN: d = FPMIN
        c = 1 + aa / c
        if abs(c) < FPMIN: c = FPMIN
        d = 1 / d; de = d * c; h *= de
        if abs(de - 1) < EPS: break
    return h

def betai(a, b, x):
    if x <= 0: return 0.0
    if x >= 1: return 1.0
    bt = math.exp(gammln(a + b) - gammln(a) - gammln(b) + a * math.log(x) + b * math.log(1 - x))
    if x < (a + 1) / (a + b + 2):
        return bt * betacf(a, b, x) / a
    return 1 - bt * betacf(b, a, 1 - x) / b

def t_two_tailed_p(t, df):
    return betai(df / 2, 0.5, df / (df + t * t))

def gser(a, x):
    EPS = 3e-12; ITMAX = 400; gln = gammln(a)
    if x <= 0: return 0.0
    ap = a; s = 1.0 / a; dele = s
    for _ in range(1, ITMAX + 1):
        ap += 1; dele *= x / ap; s += dele
        if abs(dele) < abs(s) * EPS: break
    return s * math.exp(-x + a * math.log(x) - gln)

def gcf(a, x):
    EPS = 3e-12; FPMIN = 1e-300; ITMAX = 400; gln = gammln(a)
    b = x + 1 - a; c = 1 / FPMIN; d = 1 / b; h = d
    for i in range(1, ITMAX + 1):
        an = -i * (i - a)
        b += 2; d = an * d + b
        if abs(d) < FPMIN: d = FPMIN
        c = b + an / c
        if abs(c) < FPMIN: c = FPMIN
        d = 1 / d; dele = d * c; h *= dele
        if abs(dele - 1) < EPS: break
    return math.exp(-x + a * math.log(x) - gln) * h

def gammq(a, x):
    if x < 0 or a <= 0: return float("nan")
    if x < a + 1: return 1 - gser(a, x)
    return gcf(a, x)

def chi2_p(chi, df):
    return gammq(df / 2, chi / 2)

def desc(d):
    return dict(n=len(d), mean=mean(d), median=median(d), sd=stdev(d),
                var=stdev(d) ** 2, min=min(d), max=max(d))

def ind_ttest(a, b):
    na, nb = len(a), len(b); ma, mb = mean(a), mean(b)
    va, vb = stdev(a) ** 2, stdev(b) ** 2; df = na + nb - 2
    sp2 = ((na - 1) * va + (nb - 1) * vb) / df
    se = math.sqrt(sp2 * (1 / na + 1 / nb)); t = (ma - mb) / se
    return t, df, t_two_tailed_p(t, df), ma, mb, se, math.sqrt(sp2)

def paired_ttest(a, b):
    d = [x - y for x, y in zip(a, b)]; n = len(d)
    md = mean(d); sd = stdev(d); se = sd / math.sqrt(n); t = md / se; df = n - 1
    return t, df, t_two_tailed_p(t, df), md, sd

def ranks(vals):
    order = sorted(range(len(vals)), key=lambda i: vals[i])
    r = [0] * len(vals); i = 0
    while i < len(vals):
        j = i
        while j + 1 < len(vals) and vals[order[j + 1]] == vals[order[i]]:
            j += 1
        avg = (i + j) / 2 + 1
        for k in range(i, j + 1):
            r[order[k]] = avg
        i = j + 1
    return r

def pearson(x, y):
    n = len(x); mx, my = mean(x), mean(y)
    sxy = sum((a - mx) * (b - my) for a, b in zip(x, y))
    sxx = sum((a - mx) ** 2 for a in x); syy = sum((b - my) ** 2 for b in y)
    r = sxy / math.sqrt(sxx * syy); df = n - 2; t = r * math.sqrt(df / (1 - r * r))
    return r, t, df, t_two_tailed_p(t, df)

def spearman(x, y):
    return pearson(ranks(x), ranks(y))

def mannwhitney(a, b):
    allv = a + b; r = ranks(allv); R1 = sum(r[:len(a)])
    n1, n2 = len(a), len(b)
    U1 = R1 - n1 * (n1 + 1) / 2; U2 = n1 * n2 - U1; U = min(U1, U2)
    mu = n1 * n2 / 2; sd = math.sqrt(n1 * n2 * (n1 + n2 + 1) / 12)
    z = (U - mu) / sd; p = 2 * (1 - NormalDist().cdf(abs(z)))
    return U, z, p, mu, sd

def wilcoxon(a, b):
    diffs = [x - y for x, y in zip(a, b)]; nz = [d for d in diffs if d != 0]
    ad = [abs(d) for d in nz]; r = ranks(ad)
    Wp = sum(r[i] for i, d in enumerate(nz) if d > 0)
    Wn = sum(r[i] for i, d in enumerate(nz) if d < 0)
    W = min(Wp, Wn); n = len(nz)
    mu = n * (n + 1) / 4; sd = math.sqrt(n * (n + 1) * (2 * n + 1) / 24)
    z = (W - mu) / sd; p = 2 * (1 - NormalDist().cdf(abs(z)))
    return W, Wp, Wn, z, p, n

def chi2_indep(table):
    rows = len(table); cols = len(table[0])
    rt = [sum(row) for row in table]
    ct = [sum(table[i][j] for i in range(rows)) for j in range(cols)]
    tot = sum(rt); chi = 0; cells = []
    for i in range(rows):
        for j in range(cols):
            e = rt[i] * ct[j] / tot; chi += (table[i][j] - e) ** 2 / e
            cells.append((i, j, table[i][j], e))
    df = (rows - 1) * (cols - 1)
    chiY = None
    if rows == 2 and cols == 2:
        chiY = 0
        for i in range(2):
            for j in range(2):
                e = rt[i] * ct[j] / tot; chiY += (abs(table[i][j] - e) - 0.5) ** 2 / e
    pY = chi2_p(chiY, df) if chiY is not None else None
    return chi, chiY, df, chi2_p(chi, df), pY, cells

def chi2_gof(obs, exp=None):
    if exp is None:
        exp = [sum(obs) / len(obs)] * len(obs)
    chi = sum((o - e) ** 2 / e for o, e in zip(obs, exp)); df = len(obs) - 1
    return chi, df, chi2_p(chi, df)

def fmt(p):
    return f"{p:.4f}" + ("  (significant, p<.05)" if p < 0.05 else "  (NOT significant, p>=.05)")

# ================= DATA =================
A = [42, 38, 51, 35, 47, 40, 33, 45, 39, 44, 36, 41, 48, 37, 43]   # New UI (redesigned, fixed)
B = [58, 62, 49, 71, 55, 64, 52, 60, 67, 56, 70, 59, 63, 54, 66]   # Old UI (flat, buggy)
SUS_old = [55, 60, 48, 62, 58, 50, 65, 52]
SUS_new = [78, 82, 75, 85, 80, 72, 88, 79]
comfort = [6, 5, 3, 7, 4, 6, 7, 4, 5, 5, 6, 5, 3, 6, 4]
table = [[14, 1], [8, 7]]
pref_labels = ["Dark", "Light", "No preference"]; pref = [11, 6, 3]

print("====== DESCRIPTIVE STATISTICS ======")
for name, d in [("New UI task time", A), ("Old UI task time", B), ("SUS old", SUS_old), ("SUS new", SUS_new)]:
    s = desc(d)
    print(f"{name}: n={s['n']} mean={s['mean']:.2f} median={s['median']:.1f} sd={s['sd']:.2f} min={s['min']} max={s['max']}")
print("Theme preference:", dict(zip(pref_labels, pref)), "mode=", pref_labels[pref.index(max(pref))])

print("\n====== H1: INDEPENDENT (UNRELATED) t-TEST -- task time New vs Old ======")
t, df, p, ma, mb, se, sp = ind_ttest(A, B)
print(f"mean(New)={ma:.2f}s mean(Old)={mb:.2f}s diff={ma-mb:.2f}s pooled_sd={sp:.2f} SE={se:.2f}")
print(f"t({df})={t:.3f}  two-tailed p={fmt(p)}")

print("\n====== H2a: PAIRED (RELATED) t-TEST -- SUS old vs new (interval-treated) ======")
t, df, p, md, sd = paired_ttest(SUS_new, SUS_old)
print(f"mean_diff={md:.2f} sd_diff={sd:.2f} t({df})={t:.3f} p={fmt(p)}")

print("\n====== H2b: WILCOXON SIGNED-RANKS -- SUS old vs new (non-parametric) ======")
W, Wp, Wn, z, p, n = wilcoxon(SUS_new, SUS_old)
print(f"W+={Wp} W-={Wn} W={W} n={n} z={z:.3f} p={fmt(p)}")

print("\n====== H3: MANN-WHITNEY U -- task time New vs Old (non-parametric) ======")
U, z, p, mu, sd = mannwhitney(A, B)
print(f"U={U:.1f} z={z:.3f} p={fmt(p)}")

print("\n====== CORRELATION: tech-comfort vs task time (New UI) ======")
r, t, df, p = pearson(comfort, A)
print(f"Pearson r={r:.3f} t({df})={t:.3f} p={fmt(p)}")
r, t, df, p = spearman(comfort, A)
print(f"Spearman rho={r:.3f} t({df})={t:.3f} p={fmt(p)}")

print("\n====== CHI-SQUARE INDEPENDENCE: syllabus success x UI ======")
chi, chiY, df, p, pY, cells = chi2_indep(table)
print("cells:", [f"r{i}c{j}:O={o},E={e:.2f}" for i, j, o, e in cells])
print(f"chi2({df})={chi:.3f} p={fmt(p)}")
print(f"Yates chi2={chiY:.3f} p={fmt(pY)}")

print("\n====== CHI-SQUARE GOODNESS OF FIT: theme preference vs uniform ======")
chi, df, p = chi2_gof(pref)
print(f"chi2({df})={chi:.3f} p={fmt(p)}")
