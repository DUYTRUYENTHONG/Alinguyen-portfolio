const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const introDescription = "I build practical AI, data and commerce workflows.";
export const socialImage = {
  url: `${siteUrl}/ali-intro-social-v1.png`,
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Ali Nguyen’s cartoon avatar in a black suit beside a short introduction to his applied AI, data and commerce work.",
};
