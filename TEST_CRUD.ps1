#!/usr/bin/env powershell

# Colors for output
$green = "`e[32m"
$red = "`e[31m"
$yellow = "`e[33m"
$reset = "`e[0m"

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [object]$Body = $null,
        [hashtable]$Headers = @{}
    )
    
    Write-Host "`n$yellow[TEST]$reset $Name" -ForegroundColor Yellow
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params["Body"] = $Body | ConvertTo-Json
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "$green✓ SUCCESS$reset" -ForegroundColor Green
        Write-Host ($response | ConvertTo-Json -Depth 3) | Out-String
        return $true
    } catch {
        Write-Host "$red✗ FAILED$reset" -ForegroundColor Red
        Write-Host $_.Exception.Message | Out-String
        return $false
    }
}

$baseUrl = "http://localhost:3000"

Write-Host "`n$yellow===== ADMIN CRUD TEST SUITE =====$reset`n" -ForegroundColor Yellow

# Test 1: GET All Countries (Public)
Test-Endpoint -Name "GET /countries (Public)" `
    -Method GET `
    -Url "$baseUrl/countries"

# Test 2: GET All Product Types (Public)
Test-Endpoint -Name "GET /product-types (Public)" `
    -Method GET `
    -Url "$baseUrl/product-types"

# Test 3: GET All Skin Types (Public)
Test-Endpoint -Name "GET /skin-types (Public)" `
    -Method GET `
    -Url "$baseUrl/skin-types"

# Test 4: GET All Skin Concerns (Public)
Test-Endpoint -Name "GET /concerns (Public)" `
    -Method GET `
    -Url "$baseUrl/concerns"

Write-Host "`n$yellow===== END OF TESTS =====$reset`n" -ForegroundColor Yellow
