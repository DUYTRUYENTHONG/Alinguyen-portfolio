const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const introDescription = "I build practical AI, data and commerce workflows.";
export const socialImage = {
  url: `${siteUrl}/opengraph-image.png?avatar=real-v2`,
  width: 1733,
  height: 907,
  type: "image/png",
  alt: "Ali Nguyen’s real portrait in a black suit beside his name, Applied AI and Product Engineer title, and a short introduction.",
};
