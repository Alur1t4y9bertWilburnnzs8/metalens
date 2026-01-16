
$ErrorActionPreference = "Stop"

try {
    $gitPath = (Get-ItemProperty -Path 'HKLM:\SOFTWARE\GitForWindows' -ErrorAction SilentlyContinue).InstallPath
    if (!$gitPath) { $gitPath = (Get-ItemProperty -Path 'HKLM:\SOFTWARE\WOW6432Node\GitForWindows' -ErrorAction SilentlyContinue).InstallPath }
    
    if (!$gitPath) {
        Write-Error "Could not find Git path in Registry."
        exit 1
    }

    $gitExe = Join-Path $gitPath "cmd\git.exe"
    if (-not (Test-Path $gitExe)) {
        Write-Error "Git executable not found at $gitExe"
        exit 1
    }
    
    Write-Host "Using Git executable: $gitExe"

    # Define function for cleaner execution
    function Run-Git {
        param([string[]]$Arguments)
        Write-Host "Running: git $Arguments"
        & $gitExe $Arguments
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Last command exited with code $LASTEXITCODE"
        }
    }

    Run-Git "init"
    Run-Git "config", "user.email", "bot@metalens.dev"
    Run-Git "config", "user.name", "Metalens Bot"
    Run-Git "add", "."
    Run-Git "commit", "-m", "Initial_commit_by_AI_Agent"
    Run-Git "branch", "-M", "main"
    
    # Try removing remote just in case
    try { & $gitExe remote remove origin 2>$null } catch {}
    
    Run-Git "remote", "add", "origin", "https://github.com/Alur1t4y9bertWilburnnzs8/metalens.git"
    
    Write-Host "Pushing... (Browser login might be required)"
    Run-Git "push", "-u", "origin", "main"
    
    Write-Host "Done."

} catch {
    Write-Error $_
    exit 1
}
