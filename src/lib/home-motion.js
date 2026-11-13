// Progressive enhancement only: all content is visible without this module.
const headings =
	"#work-title, #community-title, #map-title, #notes-title, #contact-title";
const media =
	"#work .project-screenshot, #work .mock-terminal, #work .mock-churn";
const targets = `${headings}, ${media}`;

export function startHomeMotion() {
	if (!("IntersectionObserver" in window) || !window.matchMedia) return;
	const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
	const states = new Map();
	const played = new Set();
	let scrollY = window.scrollY;
	let scrollTime = performance.now();
	let frame = 0;
	let stopped = false;
	const visible = (node) => {
		const rect = node.getBoundingClientRect();
		return rect.bottom > 0 && rect.top < window.innerHeight && rect.width > 0;
	};
	function settle(node) {
		const state = states.get(node);
		if (!state) return;
		node.dataset.homeMotion = "complete";
		played.add(state.key);
		observer.unobserve(node);
		if (state.timer) clearTimeout(state.timer);
		if (state.load)
			node.querySelector("img")?.removeEventListener("load", state.load);
		states.delete(node);
	}
	function travel(node) {
		const image = node.querySelector("img");
		if (!image?.complete || !image.naturalWidth) return null;
		const overflow = Math.max(
			0,
			image.getBoundingClientRect().height - node.clientHeight,
		);
		const distance = Math.min(12, overflow);
		node.style.setProperty("--home-image-travel", `${distance}px`);
		return distance;
	}
	function play(node, delay = 0) {
		const state = states.get(node);
		if (!state || state.running) return;
		if (
			preference.matches ||
			document.hidden ||
			node.contains(document.activeElement)
		)
			return settle(node);
		if (state.kind === "screenshot") {
			const distance = travel(node);
			if (distance === null) return;
			if (distance < 1) return settle(node);
		}
		state.running = true;
		played.add(state.key);
		observer.unobserve(node);
		node.style.setProperty("--home-delay", `${delay}ms`);
		node.dataset.homeMotion = "running";
		state.timer = setTimeout(() => settle(node), 800 + delay);
	}
	const observer = new IntersectionObserver(
		(entries) => {
			const entering = entries.filter(
				(entry) => entry.isIntersecting && states.has(entry.target),
			);
			entering.forEach((entry, index) => {
				play(entry.target, Math.min(index * 50, 150));
			});
		},
		{ threshold: 0, rootMargin: "-16px 0px -16px 0px" },
	);

	function register(node) {
		if (
			!node.closest("main.portfolio-main") ||
			states.has(node) ||
			node.dataset.homeMotion
		)
			return;
		const card = node.closest('[id^="project-"]');
		const kind = node.matches(headings)
			? "heading"
			: node.matches(".project-screenshot")
				? "screenshot"
				: node.matches(".mock-terminal")
					? "terminal"
					: "timeline";
		const key = kind === "heading" ? node.id : `${card?.id}:${kind}`;
		states.set(node, { kind, key, running: false });
		node.dataset.homeMotionKind = kind;
		// Hydration, restored scroll and first paint must never conceal visible content.
		if (played.has(key) || visible(node) || preference.matches)
			return settle(node);
		node.dataset.homeMotion = "waiting";
		if (kind === "screenshot") {
			const onLoad = () => {
				if (visible(node)) play(node);
			};
			states.get(node).load = onLoad;
			node.querySelector("img")?.addEventListener("load", onLoad);
		}
		observer.observe(node);
	}
	function scan(root) {
		if (root.nodeType !== 1 && root !== document) return;
		if (root.matches?.(targets)) register(root);
		root.querySelectorAll(targets).forEach(register);
		for (const node of states.keys()) if (!node.isConnected) settle(node);
	}
	const mutations = new MutationObserver((records) => {
		for (const record of records)
			for (const node of record.addedNodes) scan(node);
		for (const node of states.keys()) if (!node.isConnected) settle(node);
	});
	const settleWithin = (root) => {
		for (const node of states.keys())
			if (root === node || root?.contains(node)) settle(node);
	};
	const settleVisible = () => {
		for (const node of states.keys()) if (visible(node)) settle(node);
	};
	function onScroll() {
		const now = performance.now();
		const delta = Math.abs(window.scrollY - scrollY);
		const fast =
			delta > window.innerHeight * 0.7 ||
			delta / Math.max(16, now - scrollTime) > 2.4;
		scrollY = window.scrollY;
		scrollTime = now;
		if (fast) settleVisible();
	}
	function onFocus(event) {
		settleWithin(event.target.closest(".work-card") ?? event.target);
	}
	function onClick(event) {
		const link = event.target.closest('a[href*="#"]');
		if (!link) return;
		const url = new URL(link.href, location.href);
		if (url.pathname !== location.pathname || !url.hash) return;
		const destination = document.getElementById(
			decodeURIComponent(url.hash.slice(1)),
		);
		settleWithin(destination);
	}
	function onHash() {
		settleVisible();
	}
	function onResize() {
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			for (const [node, state] of states)
				if (state.kind === "screenshot" && state.running && travel(node) < 1)
					settle(node);
		});
	}
	function onPreference() {
		if (preference.matches) for (const node of states.keys()) settle(node);
	}
	function onPageShow(event) {
		if (event.persisted) settleVisible();
	}
	scan(document);
	mutations.observe(document.documentElement, {
		childList: true,
		subtree: true,
	});
	document.addEventListener("focusin", onFocus);
	document.addEventListener("click", onClick);
	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", onResize, { passive: true });
	window.addEventListener("hashchange", onHash);
	window.addEventListener("pageshow", onPageShow);
	preference.addEventListener("change", onPreference);
	return () => {
		if (stopped) return;
		stopped = true;
		for (const node of states.keys()) settle(node);
		observer.disconnect();
		mutations.disconnect();
		if (frame) cancelAnimationFrame(frame);
		document.removeEventListener("focusin", onFocus);
		document.removeEventListener("click", onClick);
		window.removeEventListener("scroll", onScroll);
		window.removeEventListener("resize", onResize);
		window.removeEventListener("hashchange", onHash);
		window.removeEventListener("pageshow", onPageShow);
		preference.removeEventListener("change", onPreference);
	};
}
