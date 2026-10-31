# How to Build the Android APK (Improved Workflow)

## Steps

1. Make sure the latest files (especially `.github/workflows/build-apk.yml`) are pushed to your GitHub repository.

2. Go to your repository → **Actions** tab.

3. Select the workflow **"Build Android APK"**.

4. Click **Run workflow** → **Run workflow**.

5. Wait for the build (usually 8–20 minutes).

6. When it finishes successfully:
   - Open the completed run
   - Scroll down to **Artifacts**
   - Download **PhoneMatch-APK**

7. Unzip the downloaded file → you will get the `.apk`

8. Install the APK on your phone.

## Tips

- First build is always slower.
- If it fails, open the failed step and check the red error lines.
- You can cancel a stuck run using the "Cancel workflow" button.
- Debug APK is for personal testing only.
