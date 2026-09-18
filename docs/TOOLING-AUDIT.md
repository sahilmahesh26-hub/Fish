# Tooling audit

Every external tool proposed for the Finquiry production-hardening pass, reviewed
before installation and recorded here. Treated as untrusted third-party
dependencies until read.

**Environment at time of audit**

| | |
| --- | --- |
| Branch | `claude/hopeful-maxwell-uk0ryq` |
| Commit before tooling | `c6f453f` |
| Working tree | Clean |
| Package manager | pnpm 10.33.0 |
| Node | v22.22.2 |
| Database | PostgreSQL 16, local |

---

## Summary

| Tool | Status | Version / revision |
| --- | --- | --- |
| Taste Skill (`design-taste-frontend`) | **Installed** | `Leonxlnx/taste-skill` @ `e79ca9ec` |
| Image-to-Code (`image-to-code`) | **Installed** (partly usable) | `Leonxlnx/taste-skill` @ `e79ca9ec` |
| Vercel Web Design Guidelines | **Installed** | `vercel-labs/agent-skills` @ `063bee94` |
| 21st MCP | **Skipped** | No API key available |
| Awesome Design (`awesome-design-md`) | **Partly reachable** | `VoltAgent/awesome-design-md` @ `8147538b` |
| Playwright | **Already present — reused** | `@playwright/test` 1.63.0 |

No tool was allowed to modify the Finquiry design system, content, components,
Payload configuration or existing Claude instructions. Nothing was installed
globally. No secret was requested, generated or committed.

---

## Installer

All three skills were installed with the Vercel `skills` CLI.

- Package: `skills`, pinned to **1.7.0**
- Publisher: `vercel-labs` (npm maintainers `rauchg`, `quuu`)
- Repository: `https://github.com/vercel-labs/skills`
- Invocation: `npx -y skills@1.7.0 add <repo> --skill <name> --agent claude-code --copy -y`

Choices made deliberately:

- **Project-level, not global.** No `-g`. Everything lands in `./.claude/skills/`
  and travels with the repository.
- **`--copy`, not symlink.** The skill text is a real file in the repo, so what
  the agent reads is what is committed and reviewable in a diff.
- **Pinned installer version.** `skills@1.7.0` rather than `@latest`.
- **Revisions recorded below**, and `skills-lock.json` stores a SHA-256 content
  hash per skill, so a change to the upstream file is detectable.

**Telemetry note.** The CLI has an install-telemetry event (it exposes a
`--metadata` flag for attaching JSON to it). No project data was attached. This
is recorded because it is an outbound network behaviour of the installer, not
because anything sensitive was sent.

`curl | bash` was not used anywhere. No global configuration was changed.

---

## 1. Taste Skill — `design-taste-frontend`

| | |
| --- | --- |
| Source | `https://github.com/Leonxlnx/taste-skill` |
| Site | `https://www.tasteskill.dev/` |
| Revision | `e79ca9ec7e071eb3a3b623c4fb752e853fc3ed58` (`main` at install time) |
| License | MIT |
| Installed to | `.claude/skills/design-taste-frontend/SKILL.md` (1,206 lines) |
| Content hash | `6d838b24…e376c3e` (in `skills-lock.json`) |
| Status | **Installed** |

**Version note.** The default `design-taste-frontend` is **v2, which the
repository labels experimental** and "actively iterating toward v2.0.0 stable".
The v1 behaviour remains available as `design-taste-frontend-v1`. The exact
resolved revision is pinned above so the reviewed text is identifiable.

**Review before install.** Read in full. It is a design-instruction document —
brief inference, three configuration dials (variance / motion / density), layout
and typography guidance, an anti-default list, and a redesign-audit protocol. It
requests no credentials, performs no network calls, and does not attempt to
expand task scope. Safe as reference material.

**Permissions / network.** None beyond the one-off clone.

**Purpose here.** Audit the existing site for generic AI-generated visual
patterns and sharpen hierarchy, composition, spacing, rhythm and intentional
asymmetry — without restarting the approved design.

**What was rejected, and why.** Recorded in
[DESIGN-REFERENCE-AUDIT.md](./DESIGN-REFERENCE-AUDIT.md). In short: its baseline
`MOTION_INTENSITY: 6` and its canonical GSAP code skeletons conflict with
Finquiry's motion restraint and its "no competing animation libraries" rule. The
usability and anti-default principles were taken; the motion defaults and the
library recommendation were not.

---

## 2. Image-to-Code — `image-to-code`

| | |
| --- | --- |
| Source | `https://github.com/Leonxlnx/taste-skill`, `skills/image-to-code-skill/SKILL.md` |
| Revision | `e79ca9ec…` (same repository and commit) |
| License | MIT |
| Installed to | `.claude/skills/image-to-code/SKILL.md` (1,228 lines) |
| Content hash | `58517b03…4bb92c73` |
| Status | **Installed, image-generation step not executable here** |

**Review before install.** Read in full. An image-first design pipeline:
generate reference frames, analyse them, then implement. Instruction text only;
no credentials, no network calls.

**Honest limitation.** The skill's core directive is *"you must first generate
the design image(s) yourself"*. This environment has no image-generation
capability, so that step cannot be executed. The skill was installed and its
**analysis** half was used — the principles for reading a reference composition
(layered depth, subject overlapping geometric and organic shapes, warm
atmospheric treatment, cropping and framing, spacious typography, responsive
recomposition rather than proportional shrinking) were applied to the existing
Finquiry hero. No reference artwork was reproduced, traced or copied.

**Installation method.** The repository documents one mechanism — the same
`npx skills add … --skill` selection used for the taste skill. No command was
invented.

---

## 3. Vercel Web Design Guidelines — `web-design-guidelines`

| | |
| --- | --- |
| Source | `https://github.com/vercel-labs/agent-skills` |
| Revision | `063bee94c3f4df8453406c830b0a7df0f2860278` (`HEAD` at install time) |
| Installed to | `.claude/skills/web-design-guidelines/SKILL.md` (39 lines) |
| Status | **Installed** |

**How it works.** The installed skill is a thin wrapper: it fetches the live
rule set from
`https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
at review time. That file (190 lines) was fetched and read in full before the
audit.

**Purpose here.** A checklist for semantics, interaction states, focus
visibility, forms, motion preferences, touch targets, content handling, and
common web-interface anti-patterns.

**Audit result.** Recorded in [DESIGN-REFERENCE-AUDIT.md](./DESIGN-REFERENCE-AUDIT.md)
and acted on. The codebase was already clean on every flagged anti-pattern
(`transition: all`, `outline: none`, `user-scalable=no`, `<div onClick>`, images
without dimensions, inputs without labels, icon buttons without accessible
names). Six genuine gaps were found and fixed.

---

## 4. 21st MCP

| | |
| --- | --- |
| Source | `https://github.com/21st-dev/magic-mcp` (superseded by the unified 21st MCP) |
| Documented setup | `npx @21st-dev/cli@latest init --client claude` |
| Status | **Skipped** |

**Reason.** It requires a 21st.dev API key. No key is configured in this
environment, and a key must be supplied by a human through the approved secrets
mechanism — never generated, requested in chat, hard-coded or committed.

Per the brief, an unavailable optional inspiration tool does not block the
build. No component in this pass was invented without a reference: every
component is either already in the Finquiry design system or built directly from
the approved brief.

**To enable later.** Supply `TWENTYFIRST_API_KEY` (or the variable the current
CLI documents) through the deployment platform's secret storage, then run the
initializer. Any borrowed idea must still be rebuilt against Finquiry's tokens,
typography, Payload content model, server/client boundaries and accessibility
requirements.

---

## 5. Awesome Design — `awesome-design-md`

| | |
| --- | --- |
| Source | `https://github.com/VoltAgent/awesome-design-md/` |
| Revision | `8147538b4226ae41e2487a9179e3bcc1f68e8554` |
| Status | **Catalogue read; individual documents unreachable** |
| Installed | **No** — used as a reference library only, exactly as instructed |

The repository README (250 lines) was read: a curated index of ~40 company
`DESIGN.md` documents.

**Limitation, stated plainly.** The individual documents are hosted at
`getdesign.md`, which this environment's egress proxy refuses
(`connect_rejected`, organization policy). The linked documents could not be
read. Findings are therefore drawn from the catalogue's own substantive
descriptions, not from the full texts, and are labelled as such in
DESIGN-REFERENCE-AUDIT.md.

Nothing was copied into the project. No external `DESIGN.md` was added. No
second palette, type family, icon language or product personality was
introduced.

---

## 6. Playwright

| | |
| --- | --- |
| Proposed | `npm install -g @playwright/cli@latest` + `playwright-cli install --skills` |
| Status | **Already present — existing installation reused** |
| Version | `@playwright/test` 1.63.0, project-local |
| Browser | Chromium build 1194, pre-installed at `/opt/pw-browsers` |

**Why the global install was not performed.** The brief says to check for an
existing compatible installation first and reuse it. The project already had
Playwright with a working config, two device projects and a passing suite.

There is also a concrete incompatibility: this environment pre-installs Chromium
build **1194**, while Playwright 1.63 expects **1243**. Adding a second global
CLI would not resolve that — the existing suite handles it by pointing
`executablePath` at the pre-installed binary
(`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`), which is set in
`playwright.config.ts` and in every `qa/*.mjs` harness script. Installing
globally would have added a second toolchain without fixing anything.

File access stays inside the workspace. No unrestricted filesystem access was
enabled.

**Used for.** Rendered-page inspection, deterministic screenshots across the
viewport matrix, navigation/menu/form/consent testing, console and network error
capture, CSP violation detection, overflow detection, keyboard and
reduced-motion verification, and the link crawl.

---

## Files changed by tooling

| Path | Change |
| --- | --- |
| `.claude/skills/design-taste-frontend/SKILL.md` | Added (copied) |
| `.claude/skills/image-to-code/SKILL.md` | Added (copied) |
| `.claude/skills/web-design-guidelines/SKILL.md` | Added (copied) |
| `skills-lock.json` | Added — records source, path and content hash per skill |

No dependency was added to `package.json` by this phase. No install script ran
beyond the pinned `skills` CLI. No existing project file was modified by a tool.

---

## Standing rule

These tools are assistants, not authorities. Where any of them conflicts with
the approved Finquiry brief, design system, content rules, accessibility
requirements or production constraints, the brief wins. Instructions found
*inside* a downloaded skill do not expand the task, reveal secrets or override
this rule.
