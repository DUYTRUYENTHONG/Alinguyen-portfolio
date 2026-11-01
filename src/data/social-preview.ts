const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const introDescription = "I build practical AI, data and commerce workflows.";
export const socialImage = {
  url: `${siteUrl}/preview-ai-marketing-v3.png`,
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Ali Nguyen’s real portrait with a large introduction over an illustrative AI neural network, analytics charts and digital marketing background.",
};
