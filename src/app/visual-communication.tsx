import { identity } from "@/data/portfolio";
import styles from "./visual-communication.module.css";

const mapItems = [
  { label: "Customer signals", kind: "signals" },
  { label: "Useful workflows", kind: "workflows" },
  { label: "Decision in reach", kind: "decision" },
] as const;

function MapSymbol({ kind }: { kind: (typeof mapItems)[number]["kind"] }) {
  if (kind === "signals") return <svg viewBox="0 0 96 74" fill="none" aria-hidden="true"><path d="M14 54V21m18 33V35m18 19V14m18 40V29" /><circle cx="14" cy="20" r="4" /><circle cx="32" cy="34" r="4" /><circle cx="50" cy="13" r="4" /><circle cx="68" cy="28" r="4" /><path d="M11 61h67" /></svg>;
  if (kind === "workflows") return <svg viewBox="0 0 96 74" fill="none" aria-hidden="true"><rect x="12" y="10" width="72" height="53" rx="9" /><path d="M12 25h72M23 39h23M23 49h35" /><circle cx="69" cy="45" r="6" /></svg>;
  return <svg viewBox="0 0 96 74" fill="none" aria-hidden="true"><rect x="15" y="11" width="66" height="52" rx="9" /><path d="M28 37h19m0 0 16-14M47 37l16 14" /><circle cx="68" cy="23" r="4" /><circle cx="68" cy="51" r="4" /></svg>;
}

export function DecisionMapSection() {
  return <section className={`${styles.mapWrap} decision-map-wrap`} id="decision-map" aria-labelledby="map-title">
    <div className={`${styles.map} section-shell`}>
      <figure className={styles.mapFigure}>
        <div className={styles.mapGraphic} aria-hidden="true">
          {mapItems.map((item, index) => <div className={styles.mapItem} key={item.kind}>
            <span className={styles.mapIndex}>0{index + 1}</span>
            <span className={styles.mapPlate}><MapSymbol kind={item.kind} /></span>
            <span className={styles.mapLabel}>{item.label}</span>
          </div>)}
        </div>
        <figcaption>Conceptual relationship · no measured outcome shown</figcaption>
      </figure>
      <div className={styles.mapCopy}>
        <p className="eyebrow">Where the work connects</p>
        <h2 id="map-title">From signal to decision.</h2>
        <ol>
          <li><span>01</span> Collect and understand customer signals</li>
          <li><span>02</span> Build reliable features and workflows</li>
          <li><span>03</span> Put useful decisions in reach</li>
        </ol>
      </div>
    </div>
  </section>;
}

type NoteKind = "snapshot" | "review" | "commerce";

function NoteDiagram({ kind }: { kind: NoteKind }) {
  const labels = kind === "snapshot" ? ["KNOWN", "SNAPSHOT", "LATER"] : kind === "review" ? ["PLAN", "EVIDENCE", "CHECK"] : ["CONTENT", "PAGE", "INQUIRY"];
  return <div className={styles.noteDiagram} aria-hidden="true">
    <svg viewBox="0 0 276 84" fill="none" focusable="false" aria-hidden="true">
      {kind === "snapshot" ? <>
        <path d="M20 48h236" className={styles.rail} /><path d="M173 13v63" className={styles.boundary} />
        <circle cx="46" cy="48" r="8" className={styles.node} /><circle cx="106" cy="48" r="8" className={styles.node} /><circle cx="227" cy="48" r="8" className={styles.mutedNode} />
        <path d="M44 29h65" className={styles.accent} /><path d="M207 30h41" className={styles.dash} />
      </> : <>
        <path d="M45 44h186" className={styles.rail} />
        {[45, 138, 231].map((x, index) => <g key={x}>
          <rect x={x - 24} y="18" width="48" height="52" rx="6" className={index === 2 ? styles.documentAccent : styles.document} />
          <path d={`M${x - 12} 37h24M${x - 12} 47h18M${x - 12} 57h22`} className={styles.documentRule} />
        </g>)}
      </>}
    </svg>
    <div className={styles.noteLabels}>{labels.map((label) => <span key={label}>{label}</span>)}</div>
  </div>;
}

const notes = [
  { number: "01 / CUSTOMER DATA", title: "Predict from what was known then.", description: "The KKBox baseline aggregates events only through a selected snapshot date, with a synthetic check for future-data leakage.", label: "Explore KKBox ↗", href: "#project-kkbox-baseline", kind: "snapshot" },
  { number: "02 / PRODUCT DELIVERY", title: "Make quality gates visible.", description: "The public Vibecode kit records plans, evidence, and checks so a release can be reviewed.", label: "View the kit ↗", href: "https://github.com/DUYTRUYENTHONG/vibecode-product-kit", kind: "review" },
  { number: "03 / COMMERCE", title: "Connect the system to the decision.", description: "Growth Commerce OS presents service workflows around content, channels, landing pages, and leads.", label: "Visit the service site ↗", href: identity.service, kind: "commerce" },
] as const;

export function BuildNotesSection() {
  return <section className={`${styles.notes} notes-section section-shell`} id="build-notes" aria-labelledby="notes-title">
    <div className="section-heading"><p className="eyebrow">Notes from the build</p><h2 id="notes-title">A few decisions behind the work.</h2></div>
    <div className={styles.notesGrid}>
      {notes.map((note) => <article className={styles.noteCard} key={note.number}>
        <span className={styles.noteNumber}>{note.number}</span>
        <NoteDiagram kind={note.kind} />
        <h3>{note.title}</h3>
        <p>{note.description}</p>
        <a href={note.href}>{note.label}</a>
      </article>)}
    </div>
  </section>;
}
