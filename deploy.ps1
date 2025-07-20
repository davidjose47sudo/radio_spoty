# =============================================
# AURARADIO DEPLOYMENT SCRIPT
# Este script ejecuta todos los pasos necesarios para el deployment
# =============================================

Write-Host "🎵 AuraRadio - Deployment Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Check if required environment variables are set
Write-Host "`n1. Checking environment variables..." -ForegroundColor Yellow

$envFile = ".env"
if (Test-Path $envFile) {
    Write-Host "✅ .env file found" -ForegroundColor Green
    
    $envContent = Get-Content $envFile -Raw
    
    if ($envContent -match "SUPABASE_URL") {
        Write-Host "✅ Supabase configuration found" -ForegroundColor Green
    } else {
        Write-Host "❌ Supabase configuration missing in .env" -ForegroundColor Red
        Write-Host "Please add your Supabase configuration to .env file" -ForegroundColor Red
        exit 1
    }
    
    if ($envContent -match "GEMINI_API_KEY") {
        Write-Host "✅ Gemini API key configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  GEMINI_API_KEY not found in .env" -ForegroundColor Yellow
        Write-Host "AI radio generation will not work without this key" -ForegroundColor Yellow
    }
    
    if ($envContent -match "CRON_SECRET") {
        Write-Host "✅ Cron secret configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  CRON_SECRET not found in .env" -ForegroundColor Yellow
        Write-Host "Background job processing will not work without this" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ .env file not found" -ForegroundColor Red
    Write-Host "Please create .env file with your configuration" -ForegroundColor Red
    exit 1
}

# Check if Node.js dependencies are installed
Write-Host "`n2. Checking dependencies..." -ForegroundColor Yellow

if (Test-Path "node_modules") {
    Write-Host "✅ Node modules found" -ForegroundColor Green
} else {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
    if (Get-Command pnpm -ErrorAction SilentlyContinue) {
        pnpm install
    } elseif (Get-Command npm -ErrorAction SilentlyContinue) {
        npm install
    } else {
        Write-Host "❌ Neither npm nor pnpm found. Please install Node.js" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
}

# Database deployment instructions
Write-Host "`n3. Database Deployment" -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Cyan

Write-Host "`nTo complete the deployment, you need to execute the following SQL scripts in your Supabase SQL Editor:" -ForegroundColor White

Write-Host "`n📋 STEP 1: Execute Database Schema" -ForegroundColor Green
Write-Host "   File: scripts/deploy-database-updates.sql" -ForegroundColor Gray
Write-Host "   Description: Creates/updates all tables, functions, and triggers" -ForegroundColor Gray

Write-Host "`n📋 STEP 2: Execute RLS Policies" -ForegroundColor Green
Write-Host "   File: scripts/01-create-rls-policies.sql" -ForegroundColor Gray
Write-Host "   Description: Sets up Row Level Security policies" -ForegroundColor Gray

Write-Host "`n📋 STEP 3: Execute Sample Data (Optional)" -ForegroundColor Green
Write-Host "   File: scripts/02-insert-sample-data.sql" -ForegroundColor Gray
Write-Host "   Description: Adds sample artists, albums, songs, and radio stations" -ForegroundColor Gray

Write-Host "`n🔗 Database Access:" -ForegroundColor Blue
$envContent = Get-Content $envFile -Raw
if ($envContent -match 'NEXT_PUBLIC_SUPABASE_URL="([^"]*)"') {
    $supabaseUrl = $matches[1]
    Write-Host "   Supabase Dashboard: $supabaseUrl" -ForegroundColor Cyan
    Write-Host "   SQL Editor: $supabaseUrl/project/_/sql" -ForegroundColor Cyan
}

# Show next steps
Write-Host "`n4. Next Steps" -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Cyan

Write-Host "`n🔑 Get Google Gemini API Key:" -ForegroundColor Blue
Write-Host "   1. Visit: https://aistudio.google.com/" -ForegroundColor Gray
Write-Host "   2. Create an API key" -ForegroundColor Gray
Write-Host "   3. Add it to your .env file as GEMINI_API_KEY" -ForegroundColor Gray

Write-Host "`n🚀 Start Development Server:" -ForegroundColor Blue
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    Write-Host "   pnpm dev" -ForegroundColor Gray
} else {
    Write-Host "   npm run dev" -ForegroundColor Gray
}

Write-Host "`n🎛️ Admin Features:" -ForegroundColor Blue
Write-Host "   - Create your first user account" -ForegroundColor Gray
Write-Host "   - Update your profile role to 'admin' in Supabase" -ForegroundColor Gray
Write-Host "   - Access admin dashboard at /admin" -ForegroundColor Gray

Write-Host "`n📚 Documentation:" -ForegroundColor Blue
Write-Host "   - Read DEPLOYMENT.md for detailed instructions" -ForegroundColor Gray
Write-Host "   - API endpoints documented in the guide" -ForegroundColor Gray

# Check if we should start the dev server
Write-Host "`n5. Ready to Start?" -ForegroundColor Yellow
$startServer = Read-Host "Would you like to start the development server now? (y/N)"

if ($startServer -eq "y" -or $startServer -eq "Y") {
    Write-Host "`n🚀 Starting development server..." -ForegroundColor Blue
    if (Get-Command pnpm -ErrorAction SilentlyContinue) {
        pnpm dev
    } else {
        npm run dev
    }
} else {
    Write-Host "`n✨ Deployment preparation complete!" -ForegroundColor Green
    Write-Host "Don't forget to execute the SQL scripts in Supabase before running the app." -ForegroundColor Yellow
}

Write-Host "`n🎉 Happy coding with AuraRadio!" -ForegroundColor Magenta
