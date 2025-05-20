# PowerShell script to copy the pneumonia model to the API directory
Copy-Item -Path "../pneumonia_detection_model.h5" -Destination "./" -Force
Write-Host "Copied pneumonia_detection_model.h5 to the pneumonia-api directory"
