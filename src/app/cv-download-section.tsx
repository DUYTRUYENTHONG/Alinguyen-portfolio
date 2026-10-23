import { cvTracks } from "@/data/portfolio";
import { CvIllustration } from "./cv-illustration";
import styles from "./cv-download-section.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function DownloadIcon() {
  return <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false"><path d="M10 2.5v10m0 0 3.5-3.5M10 12.5 6.5 9M3.5 15.5v2h13v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function CvDownloadSection() {
  return <section className={styles.section} id="cvs" aria-labelledby="cv-title">
    <div className="section-shell">
      <div className={styles.heading}><p className="eyebrow">CVs</p><h2 id="cv-title">Choose the version for your conversation.</h2></div>
      <div className={styles.grid}>{cvTracks.map((track, index) => <article className={styles.card} key={track.title}>
        <CvIllustration kind={index + 1} />
        <div className={styles.cardCopy}><span className={styles.format}>{track.downloads[0].format}</span><h3>{track.title}</h3><p>{track.detail}</p></div>
        <div className={styles.actions}>{track.downloads.map((file) => <div className={styles.fileChoice} key={file.path}>{"focus" in file && <p id={`focus-${file.path}`}>{file.focus}</p>}<a aria-describedby={"focus" in file ? `focus-${file.path}` : undefined} href={`${basePath}/${file.path}`} download aria-label={`${file.label} — ${track.title} CV`}><span>{file.label}</span><DownloadIcon /></a></div>)}</div>
      </article>)}</div>
    </div>
  </section>;
}
