export const SITE = {
  website: "https://stack.cowrywise-ambassadors.com/", // Updated for Stack branding
  author: "Cowrywise Ambassador Writing Group",
  profile: "https://cowrywise.com/ambassadors",
  desc: "A beautiful platform for the Cowrywise Ambassador Writing Group to share insights, stories, and financial wisdom.",
  title: "Stack",
  ogImage: "stack-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false, // Disabled GitHub edit links
    text: "",
    url: "",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Africa/Lagos", // Updated to Lagos timezone
} as const;
