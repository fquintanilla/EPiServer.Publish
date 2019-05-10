@echo off
cls

echo Creating the module zip file..
powershell -command "Compress-Archive -Path .\ClientResources\, .\module.config -DestinationPath .\modules\_protected\EPiServer.Publish\EPiServer.Publish.zip -CompressionLevel Optimal -Force"
echo.

echo Creating NuGet package..
echo.
nuget pack Verndale.Publish.csproj -Build -Properties Configuration=Release -Verbosity detailed

echo.
echo.
echo Done