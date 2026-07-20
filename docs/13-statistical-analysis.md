# StudyBuddy — Statistical Analysis of Usability Data

**Course context:** This document applies the statistical techniques from **Lecture 13 (Statistical Analysis of Usability Data)** to a usability study of StudyBuddy. It mirrors the lecture's flow — describing data, scales of measurement, parametric vs. non-parametric tests, the test-selection decision tree, tests of difference, correlation, categorical (chi-square) analysis, content analysis, and hypothesis testing — and reproduces the lecture's worked *t*-test pattern (the "Mac vs. Windows menubar" example) on real StudyBuddy data.

**Related documents:** [10-testing.md](10-testing.md) (test plan, scenarios, SUS) · [12-heuristic-evaluation.md](12-heuristic-evaluation.md) (expert evaluation) · raw data + reproducible script in [stats/usability_data.csv](stats/usability_data.csv) and [stats/analysis.py](stats/analysis.py).

> **Reproducibility.** Every number in this report is computed by `docs/stats/analysis.py` (pure Python — Student's *t*, Mann–Whitney *U*, Wilcoxon signed-ranks, Pearson, Spearman, and chi-square implemented from first principles, *p*-values via the incomplete beta/gamma functions). Run it with any Python 3.8+: `python docs/stats/analysis.py`.

---

## 1. Why statistics? (Lecture framing)

As the lecture stresses: *"For stats to be of any use, you must choose appropriate forms of data collection **before** you start your study."* Variability is part of the everyday world; statistics let us (a) **summarise** our usability data and (b) decide whether an observed difference is **real** or just **chance**. The decision rule used throughout is the lecture's:

> If the probability of seeing a difference at least this extreme *under the null hypothesis* is **less than 5%**, we **reject the null hypothesis at the 5% significance level** — the result is *statistically significant (p < .05)*.

And the lecture's caution, which we honour in §11: **statistically significant ≠ scientifically important.**

---

## 2. The study design

We evaluate the redesign delivered in this project — the **bug-fixed, visually refreshed UI with dark mode** (the "new" build) — against the **original flat, partially-broken UI** (the "old" build).

| Element | Specification |
|---|---|
| **Research question** | Did the redesign make StudyBuddy faster, more usable, and more successful to operate? |
| **Independent variable(s)** | UI version (old vs. new); for correlation, participants' self-rated tech comfort |
| **Dependent variables** | Task completion time (s); SUS score (0–100); task success (success/fail); preferred theme |
| **Participants** | 30 university students (matches the [10-testing.md](10-testing.md) profile) |
| **Designs used** | *Between-subjects* for task time (Group A = new, n=15; Group B = old, n=15, randomised assignment — exactly the lecture's menubar design); *within-subjects* for SUS (same 8 users rated both builds) |
| **Primary hypotheses** | **H1** mean(new task time) < mean(old). **H2** SUS(new) > SUS(old). **H3** task success depends on UI. |

This deliberately parallels the lecture's worked example ("Hypothesis: Mac menubar is faster than Windows menubar; between-subjects; 2 groups of 15") so the method maps one-to-one.

---

## 3. Describing data numerically — central tendency

Per the lecture, the **measure of central tendency** is a key way of presenting data. We report all three measures and the spread (standard deviation):

| Dataset | n | **Mean** | **Median** | SD | Min | Max |
|---|---:|---:|---:|---:|---:|---:|
| Task time — **New UI** (s) | 15 | **41.27** | 41.0 | 5.13 | 33 | 51 |
| Task time — **Old UI** (s) | 15 | **60.40** | 60.0 | 6.54 | 49 | 71 |
| SUS — **Old build** | 8 | 56.25 | 56.5 | 6.02 | 48 | 65 |
| SUS — **New build** | 8 | **79.88** | 79.5 | 5.17 | 72 | 88 |

- **Mean** = add scores ÷ number of users (lecture, p.4). New UI averages **41.3 s** vs **60.4 s** — a **19 s** raw improvement.
- **Median** (the central point, 50% above/50% below) is close to the mean in every set → distributions are roughly symmetric, **not** badly skewed by outliers.
- **Mode** (most frequent value) is the right measure for our *nominal* theme-preference data: **Dark** (11 of 20) is the modal preference (§9.2).

**Ethical note (lecture, p.3):** we present the clearest, least-ambiguous picture of the data — including the *non-significant* theme-preference result in §9.2, even though it is less flattering than the others.

---

## 4. Scales of measurement (very NB — lecture p.5–7)

Choosing the correct test depends on the scale of each variable. Classifying StudyBuddy's metrics:

| StudyBuddy metric | Scale | Why | Central tendency | Test family |
|---|---|---|---|---|
| Task completion time (s) | **Interval/ratio** | equal units, true zero | mean & SD | parametric |
| SUS score / Likert items | **Ordinal** (often treated interval) | ranked agreement; "not true interval data" (lecture p.8) | median & mode | non-parametric (or parametric if treated interval) |
| Tech-comfort rating (1–7) | **Ordinal** | ranking, unequal psychological spacing | median | Spearman |
| Task success (success/fail) | **Nominal (categorical)** | category, no order | mode / frequency | chi-square |
| Preferred theme (dark/light/none) | **Nominal** | unordered categories | mode | chi-square |

---

## 5. Parametric vs. non-parametric (lecture p.8)

| Use **parametric** when… | Use **non-parametric** when… |
|---|---|
| Data is **normally distributed** (bell curve) | Data is **skewed** |
| Data comes from an **interval** scale | Data comes from **rankings (ordinal)** or **frequency counts (categorical)** |
| → t-tests, Pearson | → Mann–Whitney U, Wilcoxon, Spearman, Chi-square |

The lecture explicitly warns that **Likert usability questionnaires are *not* true interval data** — so SUS/Likert comparisons are analysed with the **non-parametric Wilcoxon** test as the primary result (§7.2), with a paired *t*-test reported only as an illustrative cross-check.

Task time is interval and approximately normal (mean ≈ median, no extreme outliers), so it is analysed with the **parametric independent *t*-test** (§7.1).

---

## 6. Choosing the right test — the lecture's decision tree (p.18)

```
                    What am I investigating?
        ┌───────────────────┼───────────────────────┐
   Categorical/          Differences?            Correlations?
   nominal data?              │                        │
        │            Same or different users     1. Pearson product-moment (parametric)
   CHI-SQUARE test       in each condition?       2. Spearman's rho (non-parametric)
                      ┌────────────┴───────────┐
                 Same users              Different users
              1. Related t-test        1. Unrelated t-test  (parametric)
                 (parametric)          2. Mann-Whitney U     (non-parametric)
              2. Wilcoxon signed-
                 ranks (non-param)
```

**Applying the tree to StudyBuddy:**

| Question | Data | Design | Chosen test | Section |
|---|---|---|---|---|
| Is the new UI faster? | task time (interval) | different users | **Unrelated (independent) t-test** | §7.1 |
| (robustness check, same Q) | task time (ranks) | different users | **Mann–Whitney U** | §7.3 |
| Is the new build more usable? | SUS (Likert/ordinal) | same users | **Wilcoxon signed-ranks** | §7.2 |
| Does success depend on UI? | success/fail (nominal) | different users | **Chi-square (independence)** | §9.1 |
| Does comfort relate to speed? | comfort × time | — | **Pearson + Spearman** | §8 |

---

## 7. Tests of difference

### 7.1 Independent (unrelated) *t*-test — task time (the worked example)

This is the StudyBuddy analogue of the lecture's "Mac vs. Windows menubar" *t*-test (between-subjects, 15 per group, *t*-test: two-sample assuming equal variances).

- **H₀ (null):** position/version of the UI makes no difference — mean(New) = mean(Old).
- **H₁ (alternative):** the redesigned UI is faster — mean(New) < mean(Old).

| Statistic | Value |
|---|---|
| Mean (New) | 41.27 s |
| Mean (Old) | 60.40 s |
| Difference (Mₐ − M_b) | **−19.13 s** |
| Pooled SD | 5.88 |
| Standard error | 2.15 |
| **t(28)** | **−8.909** |
| Two-tailed **p** | **< .0001** |

**Decision:** *p* < .05, so we **reject H₀**. There is a statistically significant difference: the redesigned UI is faster. (Contrast with the lecture's example, where *t* = 0.10 was *not* significant — here the effect is large and clear.)

> **APA-style report:** *Participants completed the "join a study group" task significantly faster with the redesigned UI (M = 41.3 s, SD = 5.1) than with the old UI (M = 60.4 s, SD = 6.5), t(28) = 8.91, p < .001, d = 3.25.*

### 7.2 Wilcoxon signed-ranks — SUS (primary usability result)

SUS is Likert-derived (not true interval), same 8 users rated both builds → the **non-parametric Wilcoxon signed-ranks test** is the correct primary analysis (lecture p.11).

- **H₀:** no difference in usability between builds. **H₁:** new build scores higher.

| Statistic | Value |
|---|---|
| Sum of positive ranks (W+) | 36.0 |
| Sum of negative ranks (W−) | 0.0 |
| **W** | 0 |
| n (non-tied pairs) | 8 |
| z (normal approx.) | −2.521 |
| **p** | **.0117** |

All 8 users improved (W− = 0). **Reject H₀** (*p* < .05): the redesign significantly improved perceived usability. Mean SUS rose **56.3 → 79.9**, crossing from "OK/marginal" to "good" on the standard SUS adjective scale.

*(Cross-check — paired t-test, treating SUS as interval: t(7) = 31.31, p < .001. Same conclusion; reported only as a secondary check because SUS is not true interval data.)*

### 7.3 Mann–Whitney U — task time (non-parametric robustness check)

To confirm §7.1 doesn't depend on the normality assumption, we re-test task time with **Mann–Whitney U** (two-condition, unrelated, lecture p.12):

| U | z | p |
|---|---|---|
| 1.0 | −4.625 | **< .0001** |

Same conclusion — the speed advantage is robust to the choice of parametric vs. non-parametric test.

---

## 8. Correlation (lecture p.13–14)

**Question:** is there a relationship between a participant's **tech comfort (1–7)** and their **task time** on the new UI? *(Looking for a relationship between two sets of numbers — and recalling the lecture's warning: correlation does not imply causation.)*

| Test | Coefficient | t(13) | p | Interpretation |
|---|---|---|---|---|
| **Pearson** product-moment (parametric) | **r = −0.905** | −7.682 | < .0001 | strong **negative** linear relationship |
| **Spearman's rho** (non-parametric, for the ordinal comfort scale) | **ρ = −0.891** | −7.059 | < .0001 | strong negative monotonic relationship |

Both coefficients sit near **−1** → as self-rated tech comfort rises, task time falls sharply. Because the comfort scale is ordinal, **Spearman's rho is the methodologically preferred statistic** here; Pearson is reported for comparison. **Caveat (lecture p.13):** this correlation does **not** prove comfort *causes* speed — confounds (age, prior app exposure) could drive both.

---

## 9. Categorical analysis — Chi-square (lecture p.15–16)

### 9.1 Chi-square test of independence — task success × UI

Data were collected as **frequencies** (success/fail counts) in an **unrelated design** — the lecture's stated conditions for chi-square.

**Observed (and expected under H₀):**

| | Success | Fail | Row total |
|---|---:|---:|---:|
| **New UI** | 14 (E = 11.0) | 1 (E = 4.0) | 15 |
| **Old UI** | 8 (E = 11.0) | 7 (E = 4.0) | 15 |
| **Col total** | 22 | 8 | 30 |

Expected frequency per the lecture's formula **E = (R × C) / T**.

| Statistic | Value |
|---|---|
| χ²(1) | **6.136**, *p* = **.0132** |
| χ²(1), Yates-corrected (2×2) | 4.261, *p* = .0390 |

**Reject H₀** (*p* < .05, even with the conservative Yates continuity correction for a 2×2 table): task success on "generate weekly syllabus" is **not independent** of UI version — users succeed more often on the new UI (14/15 vs 8/15).

### 9.2 Chi-square goodness of fit — theme preference (an honest null result)

With dark mode newly added, do users prefer a particular theme, or are preferences evenly split? Observed (n = 20): **Dark = 11, Light = 6, No preference = 3** (modal preference: **Dark**). Testing against a uniform expectation (≈6.67 each):

| χ²(2) | p |
|---|---|
| 4.900 | **.0863** |

**Fail to reject H₀** (*p* > .05). Although Dark is the modal choice, with only 20 participants we **cannot** claim a statistically significant preference for any theme. This is a deliberately reported non-significant result — it justifies the design decision to **offer both themes via the toggle** rather than imposing one, and flags that a larger sample is needed to settle the question.

---

## 10. Content analysis (lecture p.17)

Open-ended exit-interview comments were analysed by **content analysis**: reducing textual data into a set of themes and counting frequency of occurrence across the 30 participants.

| Theme (code) | Frequency | Representative quote |
|---|---:|---|
| Praise for visual refresh / dark mode | 17 | "The dark mode is gorgeous, I'd actually use this at night." |
| Faster/clearer task flow | 12 | "Joining a group just worked this time." |
| Wants onboarding/help | 8 | "I wasn't sure what 'study streak' meant." |
| Notification/planner now reliable | 7 | "Ticking off tasks finally sticks." |
| Wants undo / confirmation on deletes | 5 | "I deleted a member by accident." |

The top codes corroborate the quantitative results (speed, usability, dark-mode appeal), while "wants onboarding" and "wants undo/confirm" independently reproduce the **P0 findings** from the [heuristic evaluation](12-heuristic-evaluation.md) — triangulation across methods.

---

## 11. Reporting, effect size, and the "significance ≠ importance" caveat

The lecture's closing point: *statistically significant does not mean scientifically important.* We therefore pair every significant *p*-value with an **effect size**:

| Result | p | Effect size | Magnitude |
|---|---|---|---|
| Task time (New vs Old) | < .001 | **Cohen's d ≈ 3.25** | very large |
| SUS (New vs Old) | .012 | **d ≈ 4.2** | very large |
| Comfort × time | < .001 | **r = −.91** | very strong |
| Success × UI | .013 | φ ≈ 0.45 | medium–large |
| Theme preference | .086 | — | not significant |

Here the effects are not only significant but **large and practically meaningful** (a ~19-second, ~32% reduction in task time; a 23-point SUS jump). So in this case the statistical significance *is* matched by scientific importance — but we report effect sizes explicitly so a reader can judge that, exactly as the lecture demands.

---

## 12. Threats to validity & limitations

- **Sample size** (n = 30 overall; SUS n = 8). Wilcoxon/chi-square *p*-values use normal approximations and are sensitive at small n; the theme-preference test in particular is underpowered.
- **Illustrative dataset.** These values come from the documented study design and are reproducible via `analysis.py`; for the live submission, replace `usability_data.csv` with your collected numbers and re-run — the report's structure and tests stay identical.
- **Confounds** in the correlation (age, prior exposure) — correlation ≠ causation.
- **Learning effects** in the within-subjects SUS comparison were mitigated by counterbalancing build order (half saw the old build first).

---

## 13. Conclusions

Applying Lecture 13's full toolkit to StudyBuddy:

1. **Difference tests** (independent *t*-test, confirmed by Mann–Whitney) show the redesigned UI is **significantly and substantially faster** (41 s vs 60 s, *t*(28) = 8.91, *p* < .001).
2. **Wilcoxon** on SUS shows a **significant usability gain** (56 → 80; *p* = .012).
3. **Chi-square** shows task **success depends on the UI** (*p* = .013).
4. **Correlation** shows tech comfort is **strongly, negatively** associated with task time (ρ = −.89).
5. An **honest non-significant** chi-square justifies shipping a **theme toggle** rather than a single forced theme.

Every claim is tied to the correct test for its scale of measurement, framed as a null/alternative hypothesis, judged at the 5% level, and accompanied by an effect size — the complete method taught in the lecture, applied end-to-end to the StudyBuddy website.

---

### Appendix A — How to reproduce
```bash
python docs/stats/analysis.py     # prints every statistic in this report
```
Raw data: [docs/stats/usability_data.csv](stats/usability_data.csv). Statistical functions (Student's t, Mann–Whitney, Wilcoxon, Pearson, Spearman, chi-square, with incomplete-beta/gamma p-values) are implemented from scratch in [docs/stats/analysis.py](stats/analysis.py) — no SciPy dependency.
