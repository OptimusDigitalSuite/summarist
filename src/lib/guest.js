// The documented guest login: a real Firebase account with hardcoded
// credentials, so recruiters can click one button and land in the app.
//
// Create this user once in Firebase console → Authentication → Users. Override
// via .env.local if you prefer different credentials.
export const GUEST_EMAIL = process.env.NEXT_PUBLIC_GUEST_EMAIL || "guest@gmail.com";
export const GUEST_PASSWORD = process.env.NEXT_PUBLIC_GUEST_PASSWORD || "guest123";
