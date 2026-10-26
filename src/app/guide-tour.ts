export type GuideTourStop = { href: string; title: string; message: string };
const work = { href: "#work", title: "What Ali has built", message: "Explore the live commerce sites, public developer tool and churn baseline. Each project separates its status from the evidence." };
const evidence = { href: "#ai-expertise", title: "How the work is checked", message: "Look at the AI guide, data evaluation and analytics pipeline. Read the checks and limitations beside each example." };
const cvs = { href: "#cvs", title: "Find the right CV", message: "Choose the AI engineering, business and product, or prompt engineering version for your conversation." };
const community = { href: "#community", title: "Something you can use", message: "The free Vietnam Career Agent Kit helps prepare evidence-backed applications. Start with its local demo and review every disclosure." };
const funnel = { href: "#funnel", title: "Follow the customer journey", message: "Explore the illustrative funnel stages, then inspect the commerce projects. These diagrams explain an approach, not measured customer results." };
export function guideTourForRole(role: string): GuideTourStop[] {
  if (["Growth", "Marketer", "Founder"].includes(role)) return [work, funnel, evidence];
  if (["Student", "Fellow builder", "Just curious"].includes(role)) return [work, evidence, community];
  return [work, evidence, cvs];
}
