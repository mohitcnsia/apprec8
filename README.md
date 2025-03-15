# Apprec8Reader Documentation

## 1. Overview
Apprec8Reader is a React Native component designed to display structured textual and image-based content interactively. It supports various content types such as headings, paragraphs, and images while offering a full-screen image viewer.

### Key Features:
- Displays **headings, paragraphs, and images** dynamically.
- **Dark mode support** for better readability.
- **Full-screen image viewing** with zoom capabilities.
- **Clickable cover image** and additional images.
- **Scrollable content** layout.

## 2. Capabilities and How to Test Each Feature

### **2.1 Displaying Text Content**
#### **Description**
Apprec8Reader can render structured content with headings and paragraphs dynamically.

#### **Testing**
1. Navigate to the `Apprec8ReaderTester` screen.
2. Pass a content array with multiple headings and paragraphs.
3. Ensure that:
   - Headings are displayed in bold with larger font size.
   - Paragraphs are displayed in readable text format.
   - Content is properly spaced and justified.

#### **Example Test Data**
```javascript
content: [
  { heading: "Introduction" },
  { paragraph: "Distributed systems are composed of multiple nodes communicating over a network." },
  { heading: "CAP Theorem" },
  { paragraph: "A common trade-off in distributed systems is between consistency and availability." },
]
```

---

### **2.2 Clickable Cover Image**
#### **Description**
Users can tap the cover image to view it in full-screen mode.

#### **Testing**
1. Ensure a valid `coverImage` URL is provided in `route.params`.
2. Tap the cover image.
3. The full-screen image viewer should open with zoom functionality.
4. Swipe down or tap the close button to exit full-screen mode.

#### **Example Test Data**
```javascript
coverImage: "https://example.com/cover.jpg"
```

---

### **2.3 Displaying Inline Images in Content**
#### **Description**
Images can be embedded within the content and clicked to open in full-screen.

#### **Testing**
1. Add an image object to the `content` array.
2. Ensure the image appears within the content.
3. Tap the image and confirm it opens in the full-screen viewer.

#### **Example Test Data**
```javascript
content: [
  { image: "https://example.com/image.jpg" }
]
```

---

### **2.4 Additional Images Section**
#### **Description**
Apprec8Reader supports a dedicated section for displaying extra images that can be viewed in full-screen mode.

#### **Testing**
1. Provide an array of image URLs under `additionalImages`.
2. Ensure that images appear in a grid format.
3. Tap each image to verify it opens in full-screen mode.
4. Close the full-screen viewer and verify smooth transitions.

#### **Example Test Data**
```javascript
additionalImages: [
  "https://example.com/image1.jpg",
  "https://example.com/image2.jpg"
]
```

---

### **2.5 Full-Screen Image Viewer**
#### **Description**
Any image (cover image, inline image, or additional images) can be viewed in a full-screen modal with zooming and swipe-down to close.

#### **Testing**
1. Tap on any image (cover, inline, or additional images).
2. Confirm the image is displayed in full-screen mode.
3. Try pinch-zoom and confirm smooth zooming.
4. Swipe down to close the viewer.

---

### **2.6 Dark Mode Support**
#### **Description**
Apprec8Reader adapts its UI based on the system-wide dark mode setting.

#### **Testing**
1. Switch the device's theme to dark mode.
2. Open Apprec8Reader and confirm:
   - Background is dark.
   - Text is light-colored.
   - Images remain unaffected.
3. Switch back to light mode and ensure styles revert correctly.

---

## 3. Summary
| Feature | Testing Steps |
|---------|--------------|
| **Text Rendering** | Check proper formatting of headings & paragraphs. |
| **Clickable Cover Image** | Tap cover image to view in full-screen. |
| **Inline Images** | Tap inline images to open in full-screen. |
| **Additional Images** | Tap extra images to open in full-screen. |
| **Full-Screen Viewer** | Test zoom, swipe-down to close. |
| **Dark Mode** | Verify UI adapts correctly to dark/light mode. |

By following these steps, you can ensure Apprec8Reader works as expected across all its features.

