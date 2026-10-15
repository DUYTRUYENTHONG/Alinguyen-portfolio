import type { ComponentProps } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function portfolioHref(href: string) {
  if (!href.startsWith("/")) return href;
  const hashAt = href.indexOf("#");
  const path = hashAt < 0 ? href : href.slice(0, hashAt);
  const hash = hashAt < 0 ? "" : href.slice(hashAt);
  const route = path === "/" ? "/" : `${path.replace(/\/$/, "")}/`;
  return `${basePath}${route}${hash}`;
}

export function PortfolioLink({ href, ...props }: Omit<ComponentProps<"a">, "href"> & { href: string }) {
  return <a {...props} href={portfolioHref(href)} />;
}
