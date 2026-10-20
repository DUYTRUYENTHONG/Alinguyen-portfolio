import { cvTracks } from "@/data/portfolio";
import { CvAnchorAlign } from "./cv-anchor-align";
import styles from "./cv-download-section.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function DocumentIllustration({ kind }: { kind: number }) {
  return <div className={`${styles.illustration} ${styles[`illustration${kind}`]}`} aria-hidden="true">
    <div className={styles.scene}>
      {kind === 1 && <>
        <span className={`${styles.sheet} ${styles.engineerRear}`} />
        <span className={`${styles.sheet} ${styles.engineerMiddle}`} />
        <span className={`${styles.sheet} ${styles.engineerFront}`}>
          <span className={styles.paperBand} />
          <svg className={styles.nodeMotif} viewBox="0 0 76 36" fill="none" aria-hidden="true" focusable="false"><path d="M12 24 37 9l27 17" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="24" r="4" fill="#fafaf8" stroke="currentColor" strokeWidth="1.5" /><circle cx="37" cy="9" r="4" fill="#fafaf8" stroke="currentColor" strokeWidth="1.5" /><circle cx="64" cy="26" r="4" fill="#fafaf8" stroke="currentColor" strokeWidth="1.5" /></svg>
          <span className={styles.paperRules}><i /><i /><i /></span>
          <span className={styles.format}>PDF</span>
        </span>
      </>}
      {kind === 2 && <>
        <span className={styles.folderBack} />
        <span className={`${styles.sheet} ${styles.folderPaperOne}`}><span className={styles.paperRules}><i /><i /></span></span>
        <span className={`${styles.sheet} ${styles.folderPaperTwo}`}><span className={styles.paperRules}><i /><i /></span><span className={styles.format}>PDF</span></span>
        <span className={styles.folderFront} />
      </>}
      {kind === 3 && <>
        <span className={`${styles.sheet} ${styles.manuscriptRear}`} />
        <span className={`${styles.sheet} ${styles.manuscriptFront}`}>
          <span className={styles.manuscriptBracket}>[&nbsp;]</span>
          <span className={styles.paperRules}><i /><i /><i /><i /></span>
          <span className={styles.format}>DOCX</span>
        </span>
      </>}
    </div>
  </div>;
}

function DownloadIcon() {
  return <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false"><path d="M10 2.5v10m0 0 3.5-3.5M10 12.5 6.5 9M3.5 15.5v2h13v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function CvDownloadSection() {
  return <section className={styles.section} id="cvs" aria-labelledby="cv-title">
    <CvAnchorAlign />
    <div className="section-shell">
      <div className={styles.heading}><p className="eyebrow">CVs</p><h2 id="cv-title">Choose the version for your conversation.</h2></div>
      <div className={styles.grid}>{cvTracks.map((track, index) => <article className={styles.card} key={track.title}>
        <DocumentIllustration kind={index + 1} />
        <div className={styles.cardCopy}><h3>{track.title}</h3><p>{track.detail}</p></div>
        <div className={styles.actions}>{track.downloads.map((file) => <a key={file.path} href={`${basePath}/${file.path}`} download aria-label={`${file.label} — ${track.title} CV`}><span>{file.label}</span><DownloadIcon /></a>)}</div>
      </article>)}</div>
    </div>
  </section>;
}
