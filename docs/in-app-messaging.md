### **Feature: In-App Messaging & Force Update**

**Summary**

This feature allows us to show popups and critical alerts to users, controlled via Firebase Remote Config. It is used for promotional messages, important announcements, and forcing users to update the app. Messages are also saved to the user's `Profile -> My Messages` screen after they are shown as a popup.

**Key Components**

  * `useInAppMessaging.js`: The custom hook that contains all the logic.
  * `InAppMessageModal.js`: The UI component for the popup modal.
  * **Firebase Remote Config:** The backend that controls when and what to show.

**Firebase Setup**

To show a message, you must configure parameters in the Firebase Console under **Remote Config**.

1.  **`active_message`**

      * **Type:** String
      * **Description:** This holds the JSON object for the message you want to display. If it's empty, no message is shown.
      * **Example Value:**
        ```json
        {
          "messageId": "promo_q2_2025",
          "type": "soft_update",
          "title": "New Feature Alert!",
          "body": "We've just improved our app. Check out the new features now for a better experience!",
          "imageUrl": "",
          "primaryButton": { "text": "Check it out", "action": "DISMISS" },
          "secondaryButton": { "text": "Later", "action": "DISMISS" }
        }
        ```

2.  **`update_url_ios`**

      * **Type:** String
      * **Description:** The full App Store URL for your application. Only used when the message `type` is `hard_update`.
      * **Example Value:** `https://apps.apple.com/us/app/your-app/id123456789`

3.  **`update_url_android`**

      * **Type:** String
      * **Description:** The full Play Store URL for your application. Only used when the message `type` is `hard_update`.
      * **Example Value:** `https://play.google.com/store/apps/details?id=com.yourcompany.app`

**How to Show a New Message**

1.  Create your message as a JSON object. **Give it a new, unique `messageId`**.
2.  In the Firebase Console, edit the `active_message` parameter and paste your JSON as its value.
3.  Publish your changes in Firebase.
4.  The popup will now appear for users on their next app launch.

**How to Turn Off a Message**

1.  In the Firebase Console, edit the `active_message` parameter.
2.  Set its value to an empty string (`""`) or an empty object (`{}`).
3.  Publish your changes.

-----

This documentation should give any developer on your team a clear guide on how to use, test, and manage this feature. What do you think? Does this cover everything you need?