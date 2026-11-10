# Test vs Real Backend & App Environments

Apprec8 supports two completely isolated operating environments: **Real** (production) and **Test** (preview / pilot sandbox).

The separation is enforced at every layer: Android package ID, app display name, app icon background, Firebase project, Auth database, Firestore database, and Cloud Functions.

---

## 1. Environment Comparison

| Dimension | Real (Production) | Test (Sandbox / Pilot) |
| :--- | :--- | :--- |
| **Firebase Project** | `apprec8-ca229` | `apprec8-test` |
| **Firebase CLI Alias** | `default` | `test` |
| **Android Package Name** | `com.mohitchilkoti.apprec8` | `com.mohitchilkoti.apprec8.test` |
| **Android Flavor** | `real` | `preview` (applicationIdSuffix `.test`) |
| **App Display Name** | `apprec8` | `Apprec8 TEST` |
| **Adaptive Icon BG** | Purple (`#3d1141`) | Amber (`#D97706`) |
| **Google Services Config**| `./google-services.json` | `docs/agents/private/google-services.test.json` *(git-ignored)* |
| **Google Web Client ID** | `820807279146-2sri3gvjs1qeagnkprchjc4saqi6d5s7.apps.googleusercontent.com` | `309935610388-vu2pcircoj953jcfjd8aelbmtj5pfua5.apps.googleusercontent.com` |
| **Expo Updates Channel** | `production` (default) | `preview` |
| **JS Variant Key** | *omitted* (byte-identical) | `Constants.expoConfig.extra.appVariant = "test"` |

---

## 2. Android Flavors & Source Sets

Android Gradle configuration (`android/app/build.gradle`) defines two product flavors under `flavorDimensions "version"`:

```groovy
flavorDimensions "version"
productFlavors {
    real {
        dimension "version"
    }
    preview {
        dimension "version"
        applicationIdSuffix ".test"
    }
}
```

> **Note on AGP naming restrictions:** The Android Gradle Plugin explicitly reserves flavor names beginning with `test` for test source sets (e.g. `testDebugUnitTest`). The sandbox flavor is therefore named `preview`, aligning with the OTA channel name and EAS profile, while producing the package `com.mohitchilkoti.apprec8.test`.

### Source Directory Layout
- `android/app/src/main/`: Common codebase, assets, and base resources.
- `android/app/src/preview/res/values/strings.xml`: Overrides `app_name` to `"Apprec8 TEST"`.
- `android/app/src/preview/res/values/colors.xml`: Overrides `iconBackground` to amber (`#D97706`).
- `android/app/src/preview/google-services.json`: Automatically resolved by the Google Services Gradle plugin for the test build *(git-ignored)*.

---

## 3. How to Build & Run

### A. Real (Production)
By default, builds target the real environment. The configuration produced is byte-identical to standard production releases.

- **Run on Connected Device (Debug):**
  ```bash
  npx expo run:android --variant realDebug
  # or via Gradle:
  cd android && ./gradlew assembleRealDebug
  ```

- **Build Release Bundle (.aab):**
  ```bash
  cd android && ./gradlew bundleRealRelease
  ```

- **Verify Release Bundle:**
  ```bash
  scripts/release/check-aab.sh android/app/build/outputs/bundle/realRelease/app-real-release.aab 20.0.30
  ```

- **Publish OTA Update (Production):**
  ```bash
  eas update --branch production --message "Production bug fix"
  ```

### B. Test (Sandbox / Pilot)
To target the test environment, set `APP_VARIANT=test`:

- **Run on Connected Device (Debug):**
  ```bash
  APP_VARIANT=test npx expo run:android --variant previewDebug
  # or via Gradle:
  cd android && ./gradlew assemblePreviewDebug
  ```

- **Build Release Bundle / APK:**
  ```bash
  APP_VARIANT=test cd android && ./gradlew bundlePreviewRelease
  # or APK:
  cd android && ./gradlew assemblePreviewRelease
  ```

- **Publish OTA Update (Preview Channel):**
  ```bash
  eas update --channel preview --message "Preview test build"
  ```

---

## 4. Backend & Firebase Deployment

Firebase project aliases are configured in `.firebaserc`:
- `default`: `apprec8-ca229` (real)
- `test`: `apprec8-test` (test)

### Deploying to Test
Always explicitly specify `--project test` when deploying to the sandbox backend:

```bash
# Deploy Firestore security rules and compound indexes:
firebase deploy --only firestore --project test

# Deploy all Cloud Functions:
firebase deploy --only functions --project test
```

All 31 Cloud Functions are deployed to `apprec8-test` under the Blaze plan.

---

## 5. Content Synchronization

To populate `apprec8-test` with content from `apprec8-ca229`, use `scripts/admin/copyContentToTest.mjs`.

### Content Safety Rules
The script is strictly limited to static educational content:
- **Copied:** `quests`, `quests/{questId}/nodes`, `categories`, `studyContent`, `questions`, `quest_nodes`, `quizzes`.
- **NEVER Copied:** `users`, user progress, children, schools, classes, feedback, reports, or notifications.

### Execution
```bash
# 1. Dry run (inspect document counts without modifying database):
node scripts/admin/copyContentToTest.mjs

# 2. Live sync:
node scripts/admin/copyContentToTest.mjs --apply
```

---

## 6. Authentication & User Isolation Verification

A clean test rule is enforced:
> **RULE:** Any sign-up or data operation within the test application must strictly register in `apprec8-test` and must never appear in `apprec8-ca229`.

This isolation was verified via end-to-end programmatic check (`testAuthIsolation`):
1. User signed up using `apprec8-test` web API key.
2. Verified user registered in `apprec8-test` Auth database.
3. Verified user does not exist in `apprec8-ca229` Auth database (`auth/user-not-found`).
4. Cleaned up throwaway user record.

---

## 7. Send the Test App (Firebase App Distribution)

For every future change, test builds are distributed to testers via **Firebase App Distribution** targeting `apprec8-test`.

### App Distribution Identifiers
- **Firebase Project:** `apprec8-test`
- **Test App ID:** `1:309935610388:android:aa798f8ae50cdc09972501`
- **Android Package:** `com.mohitchilkoti.apprec8.test`

### Step 1: Build the Preview Release APK
```bash
# Ensure test google-services config is placed for preview flavor:
cp docs/agents/private/google-services.test.json android/app/src/preview/google-services.json

# Build the preview release APK:
cd android && APP_VARIANT=test ./gradlew :app:assemblePreviewRelease
```
The compiled APK output is located at:
`android/app/build/outputs/apk/preview/release/app-preview-release.apk`

### Step 2: Distribute to Testers
> [!IMPORTANT]
> **Email Privacy Rule:** Tester email addresses are provided only by the project owner and must **never** be committed to the repository or stored in public tracking files.

```bash
firebase appdistribution:distribute android/app/build/outputs/apk/preview/release/app-preview-release.apk \
  --app 1:309935610388:android:aa798f8ae50cdc09972501 \
  --project test \
  --testers "<comma-separated emails from owner>" \
  --release-notes "Release notes describing the changes"
```

