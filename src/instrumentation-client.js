import { startHomeMotion } from "./lib/home-motion";

// The installed Next.js convention runs before hydration. Start effects only
// when a homepage root exists; retain played IDs across client-side navigation.
if (typeof window !== "undefined") {
	const played = new Set();
	let home = null;
	let stop = null;
	const sync = () => {
		if (home?.isConnected) return;
		const next = document.querySelector("main.portfolio-main");
		if (next === home) return;
		stop?.();
		home = next;
		stop = home ? startHomeMotion(home, played) : null;
	};
	sync();
	if (typeof MutationObserver === "function")
		new MutationObserver(sync).observe(document.documentElement, {
			childList: true,
			subtree: true,
		});
}
