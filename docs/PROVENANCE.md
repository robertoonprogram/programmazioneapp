# LiberaPack — Provenance and historical record

## Scope

This document records publicly verifiable project milestones and explains how to distinguish **GitHub publication history**, **project direction**, **AI-assisted development**, and **third-party material**.

Project: **LiberaPack**, a packing and warehouse-operations prototype for the October 2026 hackathon in Imperia.

Repository: https://github.com/robertoonprogram/programmazioneapp

Primary project maintainer/account: **[@robertoonprogram](https://github.com/robertoonprogram)**.

## Independently inspectable Git history

The following data was read from GitHub's repository commit API. Timestamps are those recorded in commit metadata, expressed in **UTC**; they are not presented as a qualified legal timestamp.

| Milestone | Recorded UTC date | Full Git commit SHA |
| --- | --- | --- |
| Repository's first README for LiberaPack | 2026-10-18 10:58:32 | `2363207dba24eb71c54b44009987304277c9a592` |
| Offline demo source committed | 2026-10-18 10:58:49 | `118e1fa1ee39152ea6aeeb4792b31cf4be902759` |
| Shopify-oriented demo source committed | 2026-10-18 10:58:56 | `e4ee7f7eea9084b66e734178ffcad990b988d2e2` |
| Reference packing engine source committed | 2026-10-18 11:07:08 | `c9e012c20374fde67789073a8f281bc816f7c727` |
| Auditable source snapshot, before this record | 2026-10-18 11:14:07 | `e54672a0ceead4a3769f889bb9f113dbf14b9ea5` |

Open a specific historical revision with

```text
https://github.com/robertoonprogram/programmazioneapp/tree/e54672a0ceead4a3769f889bb9f113dbf14b9ea5
```

The [integrity snapshot](INTEGRITY_2026-10-18.json) lists the paths, Git blob object identifiers and byte sizes present at the last commit above. The manifest was created *after* the captured commit, so the archive describes a pre-manifest project state.

### How to verify locally

```bash
git clone https://github.com/robertoonprogram/programmazioneapp.git
cd programmazioneapp
git show --no-patch --format=fuller 2363207dba24eb71c54b44009987304277c9a592
git ls-tree -r e54672a0ceead4a3769f889bb9f113dbf14b9ea5
git show e54672a0ceead4a3769f889bb9f113dbf14b9ea5:src/warehouse.mjs
```

A Git SHA identifies a particular revision. It supports checking whether its contents have changed, **not** conclusively who authored it or whether that person independently created every component. The commit records observed for this checkpoint are attributed to `robertoonprogram` but **were not cryptographically signed**.

## Contribution and source transparency

- **Project ownership and coordination:** this repository is administered by the `robertoonprogram` account and records the user's LiberaPack project, requirements and development direction.
- **Software implementation:** available sources combine iterations of prototyping, technical design and AI-assisted development. This record does **not** claim that every line was typed manually or that the Git account is the exclusive legal author of every line.
- **External services:** Evolus/Larry, AMD hosting and Shopify integrations involve third-party infrastructure. The live Evolus workspace configuration has **not** been exported into this repository; reference design documents do not constitute evidence of deployment.
- **Prior source references:** earlier code and discussions drew on an externally supplied Delphi/OS1 system. Third-party original code or proprietary derivatives must not be shared without a valid right to do so, and this record claims no ownership of them.
- **Examples and data:** the current reference demonstration is based on synthetic product and order records.

## Rights and attribution

See [Copyright and reuse notice](../NOTICE.md). Copyright in original software expression, where applicable, differs from the underlying business concept; similar independently written software may still be lawful.

## Preserve future evidence

1. Keep the original hackathon submission receipt or confirmation, dated email, video, slides, working files, and archived ZIP packages in a **private** backup. Never put private credentials or customer data in this public repo.
2. Save a ZIP of this repository at the [snapshot commit](https://github.com/robertoonprogram/programmazioneapp/tree/e54672a0ceead4a3769f889bb9f113dbf14b9ea5). Keep an independent backup outside GitHub.
3. Use signed Git commits/tags for future work. GitHub's **Verified** badge improves attribution of signed commits; it does not prove prior invention or all intellectual property rights.
4. Avoid rebasing, force-pushing or deleting the history of `main`. Enable branch protection/rulesets in the GitHub web settings where permitted.
5. For particularly important claims, consider an independent qualified electronic timestamp, deposit, or a legal professional's guidance. GitHub itself is **not** a qualified timestamp service.
6. Keep a private contributor/source ledger showing human design decisions, AI-assisted changes, and any licensed third-party imports.

**Do not retroactively modify timestamps, invent contributions, strip required attributions, or imply that a snapshot alone establishes exclusive legal ownership.**
