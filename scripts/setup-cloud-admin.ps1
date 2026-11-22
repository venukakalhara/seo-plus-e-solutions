$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
$env:TURSO_DATABASE_URL = 'libsql://seo-plus-venukakalhara.aws-ap-southeast-1.turso.io'
Write-Host 'SEO PLUS - Cloud admin setup'
Write-Host 'Paste your Turso auth token below. It will remain hidden.'
$privateToken = Read-Host 'Turso auth token' -AsSecureString
$tokenPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($privateToken)
try {
    $env:TURSO_AUTH_TOKEN = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($tokenPointer)
    if ([string]::IsNullOrWhiteSpace($env:TURSO_AUTH_TOKEN)) { throw 'Token is required. Nothing was changed.' }
    node scripts/admin-setup.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Setup failed. Please check the message above.' }
} catch {
    Write-Host $_.Exception.Message -ForegroundColor Red
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($tokenPointer)
    Remove-Item Env:TURSO_AUTH_TOKEN -ErrorAction SilentlyContinue
    Remove-Item Env:TURSO_DATABASE_URL -ErrorAction SilentlyContinue
    $privateToken.Dispose()
}
Read-Host 'Press Enter to close'
