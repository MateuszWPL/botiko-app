# AI Tools. Quick Reference (Botiko.pl)

---

## Agenci, `/agent <nazwa>`

Zainstalowane w `~/.claude/agents/`, tylko pod nasz stack.

```
/agent typescript-reviewer    # review kodu TypeScript/NestJS
/agent security-reviewer      # audit auth, RODO, PII, XSS, szyfrowanie
/agent code-reviewer          # ogólny code review
/agent architect              # decyzje architektoniczne, wzorce
/agent planner                # planowanie nowej funkcji krok po kroku
/agent tdd-guide              # TDD workflow z Jest
/agent e2e-runner             # debug i uruchamianie testów e2e
/agent performance-optimizer  # optymalizacja bundle (widget <12KB)
/agent doc-updater            # aktualizacja CLAUDE.md / README
/agent refactor-cleaner       # refaktor bez zmiany zachowania
/agent build-error-resolver   # diagnoza błędów buildu/kompilacji
```

---

## Skille, `/nestjs-patterns` (bez prefiksu /skill)

Zainstalowane w `~/.claude/commands/`, kontekst domenowy dla Claude.

```
/nestjs-patterns      # wzorce NestJS: DI, guards, pipes, interceptors
/nextjs-turbopack     # App Router, SSR, Server Components, hydration
/backend-patterns     # service layer, DTOs, error handling
/frontend-patterns    # komponenty React/Preact, state management
/api-design           # REST versioning, DTOs, backward compat
/tdd-workflow         # testy jednostkowe z Jest, coverage
/e2e-testing          # testy Playwright/Supertest
/security-review      # OWASP checklist, auth, RODO, rate limiting
/database-migrations  # Prisma migrations, schema changes
/postgres-patterns    # pgvector, indeksy, RLS, query optimization
/deployment-patterns  # CI/CD, Docker, środowiska
/git-workflow         # Conventional Commits, PR flow, branching
/coding-standards     # TypeScript strict, naming, struktury
/docker-patterns      # Dockerfile, multi-stage builds
```

---

## MCP Servers, konfiguracja tokenów

Edytuj `~/.claude/settings.json`:

**GitHub MCP:**
- Wygeneruj PAT: github.com → Settings → Developer settings → Personal access tokens → `repo`, `read:org`
- Wklej w: `mcpServers.github.env.GITHUB_PERSONAL_ACCESS_TOKEN`

**Supabase MCP:**
- Wygeneruj token: supabase.com → Account → Access Tokens
- `project-ref` = fragment URL: `https://<project-ref>.supabase.co`
- Wklej w: `mcpServers.supabase.args` i `mcpServers.supabase.env.SUPABASE_ACCESS_TOKEN`
- To samo w `.mcp.json` w projekcie

Po uzupełnieniu: zrestartuj Claude Code.

---

## Hooki (automatyczne)

| Hook | Trigger | Efekt |
|------|---------|-------|
| block `--no-verify` | każdy `git commit` | blokuje pominięcie pre-commit |
| console.log warn | edycja `.ts`/`.tsx` | ostrzeżenie w stderr |

---

## Komendy Claude Code

```
/clear      # wyczyść kontekst
/compact    # skompaktuj (przy ~50 tool callach)
/cost       # koszt sesji
/memory     # zarządzaj pamięcią
```

**Skróty:** `Ctrl+C` przerwij | `Shift+Enter` nowa linia | `↑` poprzednia komenda
