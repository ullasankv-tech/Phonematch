# How to Build the Android APK using GitHub Actions

## Steps

1. Push this project to your GitHub repository (main or master branch).

2. Go to your repository on GitHub → **Actions** tab.

3. You will see the workflow **"Build Android APK"**.

4. Click on it, then click **"Run workflow"** (manual trigger) or just wait for it to run after a push.

5. When the workflow finishes (usually 4–8 minutes), open the completed run.

6. Scroll down to **Artifacts**.

7. Download **PhoneMatch-APK**.

8. Unzip it if needed — you will get `app-debug.apk`.

9. Transfer the APK to your phone and install it  
   (enable “Install from unknown sources” if asked).

## Notes

- This creates a **Debug APK** (fine for personal use).
- The APK is unsigned for production/Play Store.
- Every new push to main/master can trigger a new build.
- You can also start a build manually from the Actions tab.
