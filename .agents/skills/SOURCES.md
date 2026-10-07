# Official skill sources

This directory vendors the complete skill sets from the official CesiumJS and
Mapbox repositories. Skill contents are kept byte-for-byte identical to the
upstream files at the pinned commits listed below.

| Project  | Repository                                    | Pinned commit                              | Installed skills |
| -------- | --------------------------------------------- | ------------------------------------------ | ---------------: |
| CesiumJS | https://github.com/CesiumGS/cesiumjs-skills   | `5f4792c09c4496f214ba9679cac6d7b3b014dcdd` |               15 |
| Mapbox   | https://github.com/mapbox/mapbox-agent-skills | `aab3a6fef5c62b7c42c1f68e05885a1b50c42d24` |               20 |

## Layout notes

- The 35 directories containing `SKILL.md` come directly from each upstream
  repository's `skills/` directory, including their references, examples,
  evals, and `AGENTS.md` files.
- `README.md` is the unchanged catalog from Mapbox's upstream `skills/`
  directory. Together with the 184 files inside the skill directories, this
  makes 185 upstream skill-set files.
- `using-cesiumjs-skills/docs/DOMAINS.md` is an unchanged copy of CesiumJS's
  upstream `docs/DOMAINS.md`. It is colocated with the orientation skill so its
  documented relative reference resolves inside this repository.
- `_licenses/` contains unchanged copies of both upstream repository licenses.
- Upstream plugin manifests, MCP configuration, hooks, and repository
  development tooling are intentionally excluded.

## Updating

1. Select and record the new immutable commit from each official repository.
2. Install every upstream `skills/<name>` directory into a temporary directory
   with Codex's `skill-installer` GitHub helper and the selected `--ref`.
3. Verify the expected skill count, unique frontmatter names, and complete
   directory equality against the selected commits.
4. Replace the vendored skill directories, refresh the CesiumJS domain map and
   both licenses, and update the pinned commits in this file.

Do not edit upstream skill content locally. Keep project-specific guidance in a
separate project-owned skill instead.
