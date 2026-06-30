# WORKLOG — dziennik prac Botiko.pl

**Jeden plik-źródło prawdy: co, kiedy i przez kogo zostało zrobione.**
Najnowsze wpisy na górze. Claude dopisuje wpis po każdym logicznym etapie (przy commicie).

> Po co: szybki przegląd „co się działo ostatnio" bez czytania git loga. Backlog +
> historia w jednym miejscu. Roadmapa (co PLANUJEMY) żyje w [`TASK.md`](TASK.md) —
> tu zapisujemy co ZROBIONE.

## Format wpisu

```
## RRRR-MM-DD (dzień tygodnia)

### <krótki tytuł etapu> — <agent/rola> — [PR #xx | branch]
- Co zrobione: <punkty>
- Pliki/obszar: <gdzie>
- Review: <którzy agenci sprawdzili, werdykt>
- Status: ✅ done / 🔄 w toku / ⏸ czeka
```

Legenda statusu: ✅ ukończone i sprawdzone · 🔄 w toku · ⏸ zablokowane/czeka na decyzję

---

## 2026-06-30 (wtorek)

### Workflow armii subagentów + dziennik prac — Claude — branch `feat/agent-workflow`
- Co zrobione:
  - Utworzono `WORKLOG.md` (ten plik) — jeden dziennik prac, wpis po każdym etapie.
  - Utworzono `docs/AGENT-WORKFLOW.md` — spisany proces „kiedy którego agenta" + definition of done.
  - Dodano 2 nowe agenty wersjonowane w repo: `.claude/agents/botiko-content.md` (poprawność treści PL + język marki) i `.claude/agents/botiko-business.md` (logika biznesowa + zakres MVP).
  - Zmapowano 7 ról zespołu na istniejących + nowych agentów.
  - Zarejestrowano nowe dokumenty w `DOCS.md`; dodano sekcję workflow do `CLAUDE.md`.
- Pliki/obszar: `.claude/agents/`, `WORKLOG.md`, `docs/AGENT-WORKFLOW.md`, `DOCS.md`, `CLAUDE.md`
- Review: zgodność z DOCS.md (jedna funkcja = jeden dokument) ✅
- Status: ✅ done
