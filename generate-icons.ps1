# Icon Generation Script for Chrome Extension
# This script resizes icon128.png to create icon16.png and icon48.png

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  Chrome Extension Icon Generator" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Check if icon128.png exists
if (-not (Test-Path "icon128.png")) {
    Write-Host "ERROR: icon128.png not found in current directory!" -ForegroundColor Red
    Write-Host "Please make sure you're running this script from the project root." -ForegroundColor Yellow
    exit 1
}

Write-Host "Found icon128.png" -ForegroundColor Green

# Function to resize image using .NET System.Drawing
function Resize-Image {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$Width,
        [int]$Height
    )
    
    try {
        Add-Type -AssemblyName System.Drawing
        
        $img = [System.Drawing.Image]::FromFile((Resolve-Path $InputPath))
        $newImg = New-Object System.Drawing.Bitmap($Width, $Height)
        $graphics = [System.Drawing.Graphics]::FromImage($newImg)
        
        # Set high quality rendering
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        
        $graphics.DrawImage($img, 0, 0, $Width, $Height)
        
        $newImg.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
        
        $graphics.Dispose()
        $newImg.Dispose()
        $img.Dispose()
        
        return $true
    }
    catch {
        Write-Host "Error resizing image: $_" -ForegroundColor Red
        return $false
    }
}

# Generate icon16.png
Write-Host ""
Write-Host "Creating icon16.png (16x16)..." -ForegroundColor Yellow
$result16 = Resize-Image -InputPath "icon128.png" -OutputPath "icon16.png" -Width 16 -Height 16
if ($result16) {
    Write-Host "icon16.png created successfully!" -ForegroundColor Green
}
else {
    Write-Host "Failed to create icon16.png" -ForegroundColor Red
}

# Generate icon48.png
Write-Host ""
Write-Host "Creating icon48.png (48x48)..." -ForegroundColor Yellow
$result48 = Resize-Image -InputPath "icon128.png" -OutputPath "icon48.png" -Width 48 -Height 48
if ($result48) {
    Write-Host "icon48.png created successfully!" -ForegroundColor Green
}
else {
    Write-Host "Failed to create icon48.png" -ForegroundColor Red
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  Icon Generation Complete!" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your extension now has all required icon sizes:" -ForegroundColor White
Write-Host "  - icon16.png  (16x16 pixels)   - Favicon and small displays" -ForegroundColor Gray
Write-Host "  - icon48.png  (48x48 pixels)   - Extension management page" -ForegroundColor Gray
Write-Host "  - icon128.png (128x128 pixels) - Chrome Web Store listing" -ForegroundColor Gray
Write-Host ""
Write-Host "You can now load your extension in Chrome" -ForegroundColor Green
Write-Host ""

