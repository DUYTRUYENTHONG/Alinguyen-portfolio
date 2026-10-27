"use client";
import { useState } from "react";
import { OwnerAvatar, avatarClips } from "../owner-avatar";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export function GuidePreview() {
  const [clip, setClip] = useState("idle_loop");
  const [angle, setAngle] = useState(0);
  const [paused, setPaused] = useState(false);
  return <main className="avatar-preview">
    <a href={`${basePath}/`}>← Portfolio</a>
    <h1>Ali’s 3D guide</h1>
    <p>Stylized adaptation of your portrait. Review the likeness and each animation.</p>
    <div className="avatar-preview-stage"><OwnerAvatar clip={clip} angle={angle} paused={paused} /></div>
    <section className="avatar-preview-controls" aria-label="Animation controls">
      <label>Animation<select value={clip} onChange={e => setClip(e.target.value)}>{avatarClips.map(name => <option key={name}>{name}</option>)}</select></label>
      <button type="button" onClick={() => setAngle(angle - Math.PI / 4)}>Rotate left</button>
      <button type="button" onClick={() => setAngle(angle + Math.PI / 4)}>Rotate right</button>
      <button type="button" onClick={() => setPaused(!paused)}>{paused ? "Play" : "Pause"}</button>
      <a download href={`${basePath}/assets/tour_guide.glb`}>Download GLB</a>
    </section>
  </main>;
}
