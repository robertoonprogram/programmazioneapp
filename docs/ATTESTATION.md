# Cryptographically attested LiberaPack source

The GitHub Actions workflow [Signed source provenance](../.github/workflows/attest-source.yml) is configured to run whenever a commit is pushed to `main`, and it also supports manual runs.

## What the workflow does

1. Checks out the exact Git revision identified by `GITHUB_SHA`.
2. Runs the deterministic reference-engine checks and tests.
3. Builds a `liberapack-source-<commit-sha>.tar.gz` archive from the Git commit.
4. Calculates a SHA-256 checksum and saves it in `SHA256SUMS`.
5. Requests a **Sigstore-signed GitHub artifact attestation**, with the archived source as the subject.
6. Uploads the archive and checksum to the workflow run for temporary retention (**90 days**).

The public attestation can be checked against the archive's hash and the GitHub repository/workflow identity. GitHub uses a public transparency log for attestations produced from public repositories.

## Find an attestation

Open [GitHub Actions — Signed source provenance](https://github.com/robertoonprogram/programmazioneapp/actions/workflows/attest-source.yml) and select a **successful** run.

The run summary should contain the attestation link and the corresponding commit SHA.

Download the artifact named `liberapack-source-<commit-sha>`; preserve its `.tar.gz` file and `SHA256SUMS` in a **private backup outside GitHub**.

## Verify locally

With `gh` (GitHub CLI) installed, in the directory containing the downloaded files:

```bash
sha256sum -c SHA256SUMS
gh attestation verify liberapack-source-<commit-sha>.tar.gz --repo robertoonprogram/programmazioneapp
```

Replace `<commit-sha>` with the actual full hash from that run.

If `sha256sum` is unavailable on macOS, you can check a file's hash with `shasum -a 256 filename.tar.gz` and compare it to the value in `SHA256SUMS`.

## What it proves, and what it does not

A successful attestation provides stronger cryptographic **artifact integrity and origin-of-build evidence** than an ordinary unsigned commit. It ties a specific archive to a GitHub Actions execution and a specific repository revision.

It **does not** determine the legal author of the underlying source, establish that all code was human-written, prove when an idea was conceived, or give exclusive ownership of any third-party components.

**If the workflow has not completed successfully, do not claim an attestation exists.** See GitHub's [artifact attestation documentation](https://docs.github.com/en/actions/concepts/security/artifact-attestations).
