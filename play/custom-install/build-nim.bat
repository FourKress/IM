@call makeapp.bat

@call makeskinzip.bat nim

".\NSIS\makensis.exe" ".\SetupScripts\nim\nim_setup.nsi"
