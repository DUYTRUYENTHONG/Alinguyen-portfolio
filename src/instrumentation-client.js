import { startHomeMotion } from "./lib/home-motion";

// Next.js runs this after parsing HTML, before hydration. Mutation observation
// also covers client-side returns home and keyed role-based project reordering.
if (typeof window !== "undefined") startHomeMotion();
