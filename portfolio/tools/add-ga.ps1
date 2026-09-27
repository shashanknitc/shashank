<#
.SYNOPSIS
    Match downloaded graphical abstracts to the filenames the site expects and
    install them into assets\ga.

.DESCRIPTION
    Publication pages save images under whatever name the server hands you
    (cover, ga, image, ACS-schematic...), so this script figures out which
    downloaded file belongs to which paper by looking at the journal, the year
    and the topic words in the filename.

    Matching runs in three passes, most confident first:
      1. exact filename match against the expected name
      2. exact match ignoring case, spaces and punctuation
      3. keyword scoring on journal + year + topic words

    Anything it cannot place with confidence is reported and left alone, so
    nothing gets copied to the wrong paper. Files already present in the
    destination are kept unless -Force is given.

.PARAMETER Source
    Folder holding the downloaded images. Defaults to your Downloads folder.

.PARAMETER Destination
    Where the site reads images from. Defaults to ..\assets\ga next to this script.

.PARAMETER Force
    Overwrite destination files that already exist.

.PARAMETER DryRun
    Show what would happen, copy nothing.

.PARAMETER MaxWidth
    Optional downscale. Images wider than this are resized to fit, which keeps
    page weight down. Use 0 to disable.

.EXAMPLE
    .\add-ga.ps1
    Matches everything in Downloads against the expected names.

.EXAMPLE
    .\add-ga.ps1 -Source "C:\Users\HP\Desktop\new-abstracts" -DryRun
    Check a folder of downloads without changing anything.
#>

[CmdletBinding()]
param(
    [string] $Source = (Join-Path $env:USERPROFILE 'Downloads'),
    [string] $Destination = (Join-Path $PSScriptRoot '..\assets\ga'),
    [switch] $Force,
    [switch] $DryRun,
    [int]    $MaxWidth = 0,
    [switch] $AllowSmall
)

$ErrorActionPreference = 'Stop'

$ImageExtensions = @('.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp')

# One entry per graphical abstract slot on the site.
#   Code     - the publisher's own article id, which is what the downloaded
#              filename is built from. Exact and unambiguous when present.
#              ACS   pubs.acs.org  -> .../images/medium/ol6c02280/hi-res/
#                                    m_ol6c02280_0007.gif   (ol = Org. Lett.)
#              RSC   /image/articlelanding/2025/cc/d4cc04914d/...
#                                    .../cc-2025-0049/d4cc04914d-ga-1.png
#              Thieme /ejournals/abstract/10.1055/a-2413-7058 -> "a-2413-7058"
#   Journal  - shorthand that may appear in the name
#   Keywords - topic words, used only as a last resort
$Expected = @(
    [PSCustomObject]@{ Name = 'orglett-2026.png';                 Code = '6c02280';    Journal = 'orglett';    Year = '2026'; Keywords = @('enaminative','aminoacid','peptide') }
    [PSCustomObject]@{ Name = 'chemcomm-2025-para-substitution.png'; Code = 'd4cc04914d'; Journal = 'chemcomm'; Year = '2025'; Keywords = @('para','polarity') }
    [PSCustomObject]@{ Name = 'chemcomm-2025-pyridinium.png';       Code = 'd4cc06026a'; Journal = 'chemcomm';  Year = '2025'; Keywords = @('pyridinium','stereoselective') }
    [PSCustomObject]@{ Name = 'synthesis-2025-giese.png';           Code = '24137058';   Journal = 'synthesis'; Year = '2025'; Keywords = @('giese','coumarin') }
    [PSCustomObject]@{ Name = 'joc-2024-perfluoroalkylation.png';   Code = '4c01469';    Journal = 'joc';       Year = '2024'; Keywords = @('coumarin','perfluoroalkylation') }
    [PSCustomObject]@{ Name = 'obc-2024-perfluoroalkylation.png';   Code = 'd4ob00511b'; Journal = 'obc';       Year = '2024'; Keywords = @('heteroarene','trifluoro') }
    [PSCustomObject]@{ Name = 'synthesis-2023-selenation.png';      Code = '21122353';   Journal = 'synthesis'; Year = '2023'; Keywords = @('selenation','selenium','tryptamine') }
    [PSCustomObject]@{ Name = 'obc-2022-iminochromene.png';         Code = 'd2ob01584f'; Journal = 'obc';       Year = '2022'; Keywords = @('iminochromene','chromene') }
    [PSCustomObject]@{ Name = 'chemcomm-2022-benzo-core.png';       Code = 'd2cc03073j'; Journal = 'chemcomm';  Year = '2022'; Keywords = @('benzo','site') }
    [PSCustomObject]@{ Name = 'obc-2022-redox-amines.png';          Code = 'd2ob00943a'; Journal = 'obc';       Year = '2022'; Keywords = @('redox','amine') }
    [PSCustomObject]@{ Name = 'synthesis-2020-spiro-lactams.png';   Code = '00401707907'; Journal = 'synthesis'; Year = '2020'; Keywords = @('spiro','lactam','oxindole') }
)

function Get-Normalized {
    param([string] $Text)
    return ($Text -replace '[^a-z0-9]', '')
}

function Test-IsHtmlFile {
    param([string] $Path)
    $stream = $null
    try {
        $bytes = New-Object byte[] 16
        $stream = [System.IO.File]::OpenRead($Path)
        $read = $stream.Read($bytes, 0, 16)
        if ($read -lt 5) { return $false }
        $head = [System.Text.Encoding]::ASCII.GetString($bytes, 0, $read).TrimStart().ToLower()
        return $head.StartsWith('<!doct') -or $head.StartsWith('<html')
    }
    catch {
        return $false
    }
    finally {
        if ($stream) { $stream.Dispose() }
    }
}

function Get-ImageInfo {
    param([string] $Path)

    if (Test-IsHtmlFile -Path $Path) {
        return [PSCustomObject]@{ Ok = $false; Note = 'not an image (saved HTML page?)'; TooSmall = $false; Width = 0; Height = 0; KB = [math]::Round((Get-Item -LiteralPath $Path).Length / 1KB) }
    }

    try {
        Add-Type -AssemblyName System.Drawing -ErrorAction SilentlyContinue
        $img = [System.Drawing.Image]::FromFile($Path)
        try {
            $w = $img.Width
            $h = $img.Height
        }
        finally {
            $img.Dispose()
        }
        $note = ''
        $tooSmall = $false
        if ($w -lt 800) {
            # ACS alone serves the same graphic at small/medium/large/hi-res.
            # The small ones are ~300-520px wide and look like a blurry strip
            # once scaled into the 244px column.
            $note = "only ${w}px wide - looks like a publisher thumbnail, not the full graphic"
            $tooSmall = $true
        }
        elseif ($h -lt 300) { $note = 'short strip, will render small' }
        if ($w / $h -gt 2.4 -and $w -ge 800) { $note = 'very wide, will render short' }
        return [PSCustomObject]@{ Ok = $true; Note = $note; TooSmall = $tooSmall; Width = $w; Height = $h; KB = [math]::Round((Get-Item -LiteralPath $Path).Length / 1KB) }
    }
    catch {
        return [PSCustomObject]@{ Ok = $false; Note = 'unsupported or corrupt format'; TooSmall = $false; Width = 0; Height = 0; KB = [math]::Round((Get-Item -LiteralPath $Path).Length / 1KB) }
    }
}

function Copy-Downscaled {
    param([string] $From, [string] $To, [int] $Limit)

    if ($Limit -le 0) {
        Copy-Item -LiteralPath $From -Destination $To -Force
        return
    }

    Add-Type -AssemblyName System.Drawing
    $src = [System.Drawing.Image]::FromFile($From)
    try {
        if ($src.Width -le $Limit) {
            Copy-Item -LiteralPath $From -Destination $To -Force
            return
        }
        $height = [int][math]::Round($src.Height * $Limit / $src.Width)
        $bmp = New-Object System.Drawing.Bitmap($Limit, $height)
        try {
            $g = [System.Drawing.Graphics]::FromImage($bmp)
            try {
                $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
                $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
                $g.DrawImage($src, 0, 0, $Limit, $height)
            }
            finally { $g.Dispose() }
            $bmp.Save($To, [System.Drawing.Imaging.ImageFormat]::Png)
        }
        finally { $bmp.Dispose() }
    }
    finally { $src.Dispose() }
}

if (-not (Test-Path -LiteralPath $Source)) {
    throw "Source folder not found: $Source"
}
if (-not (Test-Path -LiteralPath $Destination)) {
    throw "Destination folder not found: $Destination"
}

$sourceImages = Get-ChildItem -LiteralPath $Source -File |
    Where-Object { $ImageExtensions -contains $_.Extension.ToLower() } |
    ForEach-Object {
        [PSCustomObject]@{
            Item  = $_
            Flat  = (Get-Normalized $_.BaseName)
            Used  = $false
        }
    }

Write-Host ''
Write-Host "Source      : $Source  ($($sourceImages.Count) image file(s))"
Write-Host "Destination : $Destination"
if ($DryRun) { Write-Host 'Mode        : DRY RUN, nothing will be copied' -ForegroundColor Yellow }
Write-Host ''

if ($sourceImages.Count -eq 0) {
    Write-Host 'No images found in the source folder.' -ForegroundColor Yellow
    Write-Host 'Download the abstracts first — see assets\ga\README.txt for where and how.' -ForegroundColor Yellow
    Write-Host ''
}

$plan = @()
$notes = @()

foreach ($slot in $Expected) {
    $target = Join-Path $Destination $slot.Name
    $exists = Test-Path -LiteralPath $target
    $candidate = $null
    $how = ''

    # pass 1 + 2: exact, then punctuation/case-insensitive
    $candidate = $sourceImages | Where-Object { -not $_.Used -and $_.Item.Name -eq $slot.Name } | Select-Object -First 1
    if (-not $candidate) {
        $flat = Get-Normalized ($slot.Name -replace '\.png$', '')
        $candidate = $sourceImages | Where-Object { -not $_.Used -and $_.Flat -eq $flat } | Select-Object -First 1
        if ($candidate) { $how = 'name' }
    }
    if ($candidate) { $how = 'name' }

    # pass 3: exact article code, then keyword scoring
    if (-not $candidate) {
        $scored = foreach ($img in ($sourceImages | Where-Object { -not $_.Used })) {
            $flat = $img.Flat
            $score = 0
            $why = @()
            if ($flat.Contains((Get-Normalized $slot.Code))) { $score += 6; $why += 'code' }
            if ($flat.Contains($slot.Journal)) { $score += 3; $why += 'journal' }
            if ($flat.Contains($slot.Year)) { $score += 2; $why += 'year' }
            foreach ($kw in $slot.Keywords) {
                if ($flat.Contains((Get-Normalized $kw))) { $score += 2; $why += $kw }
            }
            [PSCustomObject]@{ Img = $img; Score = $score; Why = $why }
        }

        $best = $scored | Sort-Object -Property Score -Descending | Select-Object -First 1
        $runnerUp = $scored | Sort-Object -Property Score -Descending | Select-Object -Skip 1 -First 1

        # a bare article code is proof enough on its own; anything weaker needs
        # corroboration from a second signal
        $minScore = if ($best -and $best.Why -contains 'code') { 6 } else { 5 }

        if ($best -and $best.Score -ge $minScore) {
            if ($runnerUp -and $runnerUp.Score -eq $best.Score) {
                $notes += "$($slot.Name): ambiguous - $($best.Img.Item.Name) and $($runnerUp.Img.Item.Name) score equally ($($best.Score)). Rename one by hand."
            }
            else {
                $candidate = $best.Img
                $how = ($best.Why | Select-Object -First 2) -join '+'
            }
        }
    }

    if ($candidate) {
        $candidate.Used = $true
        $info = Get-ImageInfo -Path $candidate.Item.FullName
        $status = 'copy'
        if ($exists -and -not $Force) { $status = 'keep' }
        elseif ($exists -and $Force) { $status = 'replace' }
        if ($info.TooSmall -and -not $AllowSmall -and $status -ne 'keep') { $status = 'skip-small' }

        $plan += [PSCustomObject]@{
            Slot    = $slot.Name
            From    = $candidate.Item.Name
            Match   = $how
            Status  = $status
            Present = $exists
            Info    = $info
            Path    = $candidate.Item.FullName
        }
    }
    else {
        $info = if ($exists) { Get-ImageInfo -Path $target } else { $null }
        $plan += [PSCustomObject]@{
            Slot    = $slot.Name
            From    = ''
            Match   = ''
            Status  = if ($exists) { 'installed' } else { 'missing' }
            Present = $exists
            Info    = $info
            Path    = $null
        }
    }
}

$plan | Format-Table -AutoSize `
    @{ e = { $_.Slot }; n = 'Slot' },
    @{ e = { if ($_.From) { $_.From } else { '-' } }; n = 'Matched download' },
    @{ e = { if ($_.Match) { $_.Match } else { '-' } }; n = 'By' },
    @{ e = { $_.Status }; n = 'Action' } |
    Out-String -Width 200 | Write-Host

foreach ($row in $plan) {
    if ($row.Info -and -not $row.Info.Ok) {
        Write-Host "  ! $($row.Slot): $($row.Info.Note)" -ForegroundColor Red
    }
    elseif ($row.Info -and $row.Info.Note) {
        Write-Host "  ~ $($row.Slot): $($row.Info.Note) ($($row.Info.Width)x$($row.Info.Height))" -ForegroundColor Yellow
    }
}

foreach ($note in $notes) {
    Write-Host "  ! $note" -ForegroundColor Red
}

$toWrite = $plan | Where-Object { $_.Path -and $_.Status -notin @('keep', 'skip-small') }
foreach ($row in $toWrite) {
    $target = Join-Path $Destination $row.Slot
    if ($DryRun) {
        Write-Host "  would $($row.Status): $($row.Slot)" -ForegroundColor DarkGray
    }
    else {
        Copy-Downscaled -From $row.Path -To $target -Limit $MaxWidth
        Write-Host "  $($row.Status): $($row.Slot)" -ForegroundColor Green
    }
}

$skipped = $plan | Where-Object { $_.Present -and $_.Status -eq 'keep' }
if ($skipped) {
    Write-Host ''
    Write-Host "$($skipped.Count) file(s) already installed and left untouched (use -Force to replace)." -ForegroundColor DarkGray
}

$tooSmall = $plan | Where-Object { $_.Status -eq 'skip-small' }
if ($tooSmall) {
    Write-Host ''
    Write-Host 'Skipped - the download is a low-resolution thumbnail:' -ForegroundColor Red
    foreach ($row in $tooSmall) {
        Write-Host "  - $($row.Slot): $($row.Info.Note) ($($row.Info.Width)x$($row.Info.Height))"
    }
    Write-Host '  Re-download the full-size graphic, or pass -AllowSmall to install it anyway.' -ForegroundColor DarkGray
}

$stillMissing = $plan | Where-Object { -not $_.Present -and -not $_.Path }
if ($stillMissing) {
    Write-Host ''
    Write-Host "Still missing $($stillMissing.Count) abstract(s):" -ForegroundColor Yellow
    foreach ($row in $stillMissing) { Write-Host "  - $($row.Slot)" }
}

$used = $sourceImages | Where-Object { $_.Used }
$unused = $sourceImages | Where-Object { -not $_.Used }
if ($unused) {
    Write-Host ''
    Write-Host "Not matched to any slot (left alone) - rename these if they are abstracts:" -ForegroundColor DarkGray
    foreach ($img in $unused) { Write-Host "  - $($img.Item.Name)" }
}

Write-Host ''
if (-not $DryRun) { Write-Host 'Done. Refresh the browser to see them.' -ForegroundColor Green }
