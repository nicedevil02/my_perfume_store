Write-Host "🗑️  شروع پاکسازی کامل فایل‌ها و پوشه‌های تکراری..." -ForegroundColor Yellow
Write-Host ""

$deletedFiles = 0
$deletedFolders = 0

# ================== 1. حذف پوشه‌های اصلی تکراری ==================

Write-Host "📁 حذف پوشه‌های اصلی تکراری..." -ForegroundColor Cyan

$mainFoldersToRemove = @(
    "src/pages",
    "src/app/(auth)",
    "src/app/(shop)",
    "src/app/(admin)",
    "src/components/home",
    "src/components/common",
    "src/components/aiFinders",
    "src/config",
    "src/styles",
    "src/providers"
)

foreach ($folder in $mainFoldersToRemove) {
    if (Test-Path $folder) {
        Remove-Item -Recurse -Force $folder
        Write-Host "  ✅ $folder حذف شد" -ForegroundColor Green
        $deletedFolders++
    }
}

# ================== 2. حذف فایل‌های تکراری در components ==================

Write-Host "`n📄 حذف فایل‌های تکراری..." -ForegroundColor Cyan

$filesToRemove = @(
    # Profile
    "src/components/profile/OrderStatusSummary.tsx",
    "src/components/profile/ProductList.tsx",
    
    # Shop filters (تکراری - نسخه اصلی در filters/ است)
    "src/components/shop/GenderFilter.tsx",
    "src/components/shop/ScentFilter.tsx",
    "src/components/shop/PriceRangeFilter.tsx",
    
    # Layout تکراری
    "src/components/layout/Layout.tsx",
    "src/components/layout/Navbar.tsx",
    "src/components/layout/MainLogo.tsx",
    "src/components/layout/MainNav.tsx",
    "src/components/layout/Sidebar.tsx",
    
    # Products تکراری
    "src/components/products/ProductDetails.tsx",
    "src/components/products/ProductFilters.tsx",
    "src/components/products/ProductGallery.tsx",
    "src/components/products/ProductImageGallery.tsx",
    "src/components/products/ProductInfo.tsx",
    "src/components/products/ProductList.tsx",
    "src/components/products/ProductReviews.tsx",
    "src/components/products/ProductSort.tsx",
    "src/components/products/RelatedProducts.tsx",
    "src/components/products/AddReviewForm.tsx",
    "src/components/products/FragranceNotesDisplay.tsx",
    
    # Cart/Checkout تکراری
    "src/components/cart/CartItem.tsx",
    "src/components/cart/CartSummary.tsx",
    "src/components/cart/MiniCart.tsx",
    "src/components/checkout/CheckoutForm.tsx",
    "src/components/checkout/OrderSummaryCheckout.tsx",
    "src/components/checkout/PaymentMethodSelector.tsx",
    "src/components/checkout/ShippingAddressForm.tsx",
    
    # Auth تکراری
    "src/components/auth/LoginForm.tsx",
    "src/components/auth/RegisterForm.tsx",
    "src/components/auth/SocialLoginButtons.tsx",
    
    # Lib تکراری
    "src/lib/authOptions.ts",
    "src/lib/jwt.ts",
    "src/lib/metadata.ts",
    
    # فایل‌های اضافی
    "src/list_tree.py",
    "src/tree.txt"
)

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Remove-Item -Force $file
        Write-Host "  ✅ $(Split-Path -Leaf $file) حذف شد" -ForegroundColor Green
        $deletedFiles++
    }
}

# ================== 3. حذف پوشه‌های خالی ==================

Write-Host "`n🧹 حذف پوشه‌های خالی..." -ForegroundColor Cyan

function Remove-EmptyFolders {
    param([string]$Path)
    
    Get-ChildItem -Path $Path -Directory -Recurse | 
        Sort-Object { $_.FullName.Length } -Descending |
        ForEach-Object {
            if ((Get-ChildItem $_.FullName -Force | Measure-Object).Count -eq 0) {
                Remove-Item $_.FullName -Force
                Write-Host "  ✅ پوشه خالی حذف شد: $($_.FullName -replace [regex]::Escape($PWD), '')" -ForegroundColor Green
                $script:deletedFolders++
            }
        }
}

# اجرای حذف پوشه‌های خالی
Remove-EmptyFolders -Path "src/components"
Remove-EmptyFolders -Path "src/app"
Remove-EmptyFolders -Path "src/lib"

# ================== 4. بررسی و حذف پوشه‌های خاص خالی ==================

Write-Host "`n🔍 بررسی پوشه‌های خاص..." -ForegroundColor Cyan

$specificEmptyFolders = @(
    "src/components/auth",
    "src/components/checkout",
    "src/app/(shop)/cart",
    "src/app/(shop)/checkout/cancel",
    "src/app/(shop)/checkout/success"
)

foreach ($folder in $specificEmptyFolders) {
    if (Test-Path $folder) {
        $itemCount = (Get-ChildItem $folder -Force | Measure-Object).Count
        if ($itemCount -eq 0) {
            Remove-Item -Recurse -Force $folder
            Write-Host "  ✅ $folder (خالی) حذف شد" -ForegroundColor Green
            $deletedFolders++
        }
    }
}

# ================== 5. گزارش نهایی ==================

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
Write-Host "✨ پاکسازی با موفقیت انجام شد!" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
Write-Host ""
Write-Host "📊 خلاصه عملیات:" -ForegroundColor Yellow
Write-Host "   📄 فایل‌های حذف شده: $deletedFiles" -ForegroundColor White
Write-Host "   📁 پوشه‌های حذف شده: $deletedFolders" -ForegroundColor White
Write-Host "   🎯 جمع کل: $($deletedFiles + $deletedFolders) آیتم" -ForegroundColor White
Write-Host ""
Write-Host "🔥 توصیه‌ها:" -ForegroundColor Green
Write-Host "   1️⃣  npm run build  → بررسی خطاهای build" -ForegroundColor Gray
Write-Host "   2️⃣  git status     → بررسی تغییرات" -ForegroundColor Gray
Write-Host "   3️⃣  npm run dev    → تست پروژه" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ پروژه شما حالا تمیز و بهینه است!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
