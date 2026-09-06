# Push a README.md file to another adab-tech repo via the GitHub API.
param(
  [Parameter(Mandatory = $true)][string]$Repo,
  [Parameter(Mandatory = $true)][string]$ReadmePath
)

$owner = 'adab-tech'
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
$json | gh api -X PUT "repos/$owner/$Repo/contents/README.md" --input -
Write-Host "Updated $owner/$Repo README"
