@echo off
cd /d "%~dp0"
echo Serving http://localhost:8080  (use your PC's LAN IP so she can open it on her phone)
echo Press Ctrl+C to stop.
python -m http.server 8080
if errorlevel 1 (
  echo Python not found. Install Python or run: npx --yes serve -l 8080
  pause
)
