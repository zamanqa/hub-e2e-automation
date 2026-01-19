# Set Environment Variable for Cypress

## Option 1: Set for Current Session (Temporary)

**PowerShell:**
```powershell
$env:CYPRESS_RECORD_KEY="6392946b-2a56-4996-8ab1-987cc71c67bd"
npm run cy:run
```

**CMD:**
```cmd
set CYPRESS_RECORD_KEY=6392946b-2a56-4996-8ab1-987cc71c67bd
npm run cy:run
```

## Option 2: Set Permanently (Recommended)

**PowerShell (Run as Administrator):**
```powershell
[System.Environment]::SetEnvironmentVariable('CYPRESS_RECORD_KEY', '6392946b-2a56-4996-8ab1-987cc71c67bd', 'User')
```

**Or use GUI:**
1. Search "Environment Variables" in Windows
2. Click "Environment Variables"
3. Under "User variables", click "New"
4. Variable name: `CYPRESS_RECORD_KEY`
5. Variable value: `6392946b-2a56-4996-8ab1-987cc71c67bd`
6. Click OK
7. Restart terminal

After setting, your scripts will work:
```bash
npm run cy:run
```
