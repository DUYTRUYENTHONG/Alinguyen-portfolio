import { startHomeMotion } from "./lib/home-motion";

// The installed Next.js convention runs before hydration. Start effects only
// after the React provider commits; retain played IDs across client navigation.
if (typeof window !== "undefined") {
	const played = new Set();
 let hydrated = false;
	let home = null;
	let stop = null;
	const sync = () => {
  if (!hydrated) return;
		if (home?.isConnected) return;
		const next = document.querySelector("main.portfolio-main");
		if (next === home) return;
		stop?.();
		home = next;
		stop = home ? startHomeMotion(home, played) : null;
	};
 document.addEventListener("portfolio-hydrated",()=>{hydrated=true;sync();},{once:true});
	if (typeof MutationObserver === "function")
		new MutationObserver(sync).observe(document.documentElement, {
			childList: true,
			subtree: true,
		});
}
