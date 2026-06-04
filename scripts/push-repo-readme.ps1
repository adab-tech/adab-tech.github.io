# Push README.md to a GitHub repo via API (creates or updates)
param(
  [Parameter(Mandatory = $true)][string]$Repo,
  [Parameter(Mandatory = $true)][string]$ReadmePath
)

$owner = 'adab-tech'
$path = 'README.md'
$content = Get-Content -Raw -Path $ReadmePath -Encoding UTF8
$b64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($content))

$existing = $null
try {
  $existing = gh api "repos/$owner/$Repo/contents/README.md" --jq .sha 2>$null
} catch {}

$body = @{
  message = 'docs: modernize README with portfolio branding'
  content = $b64
}
if ($existing) { $body.sha = $existing }

$json = $body | ConvertTo-Json
gh api -X PUT "repos/$owner/$Repo/contents/README.md" --input - <<< $json
Write-Host "Updated $owner/$Repo README"
