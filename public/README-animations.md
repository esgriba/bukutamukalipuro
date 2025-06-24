# Animation Files for SweetAlert

This document provides instructions for adding animation files to enhance SweetAlert notifications.

## Check Mark Animation

For the success notification, the system is configured to use a check mark animation file named `check-mark.gif`.

Please download a check mark animation (like a green checkmark animation) and save it in this directory as `check-mark.gif`.

You can find free check mark animations at:

1. [LottieFiles](https://lottiefiles.com/search?q=check%20mark&category=animations) - Download as GIF
2. [GIPHY](https://giphy.com/search/check-mark) - Search for "check mark" and download a suitable animation
3. [Icons8](https://icons8.com/animated-icons/check-mark) - Download animated check marks

After downloading, rename the file to `check-mark.gif` and place it in this directory.

## Customizing the Animation

If you prefer a different animation or want to change how it's displayed, you can modify the `backdrop` property in the SweetAlert call in the `GuestBookForm.tsx` file:

```typescript
backdrop: `
  rgba(0,123,255,0.2)
  url("/check-mark.gif")
  left top
  no-repeat
`;
```

You can adjust:

- The position (left top, center center, right bottom, etc.)
- The size by adding `20px` or other dimensions
- The opacity by changing the rgba value
