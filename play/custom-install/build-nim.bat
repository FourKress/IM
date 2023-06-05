@call makeapp.bat

@call makeskinzip.bat nim

echo %cd%
echo %0

"%cd%\custom-install\NSIS\makensis.exe" "%cd%\custom-install\SetupScripts\nim\nim_setup.nsi"
