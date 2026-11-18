"use client";

import { useEffect, useRef, useState } from "react";
import { Crosshair, Pause, Play } from "lucide-react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import type { mountRobot } from "./robot-renderer";

export function RobotStage() {
  const host = useRef<HTMLDivElement>(null),
    scene = useRef<ReturnType<typeof mountRobot> | null>(null);
  const [paused, setPaused] = useState(false),
    [ready, setReady] = useState(false);
  const reduced = useReducedMotion(),
    enabled = useRef(true);
  useEffect(() => {
    enabled.current = !paused && !reduced;
    scene.current?.wake();
  }, [paused, reduced]);
  useEffect(() => {
    let disposed = false;
    import("./robot-renderer")
      .then(({ mountRobot }) => {
        if (!disposed && host.current) {
          scene.current = mountRobot(host.current, () => enabled.current);
          setReady(true);
        }
      })
      .catch(() => {});
    return () => {
      disposed = true;
      scene.current?.dispose();
      scene.current = null;
    };
  }, []);
  return (
    <div
      className="robot-stage"
      aria-label="Illustration of the factory floor"
    >
      <div className="stage-tag">
        <span className="status-dot" /> SHOP-FLOOR CONTEXT
      </div>
      <span aria-hidden="true" className="stage-index">
        FIG. 01 / 3D
      </span>
      <div
        className="robot-canvas"
        ref={host}
        data-ready={ready}
        aria-hidden="true"
      />
      <div className="stage-caption">
        <Crosshair size={15} aria-hidden="true" /> <span>Factory-floor illustration</span>
      </div>
      {ready && !reduced && (
        <button
          className="stage-control"
          onClick={() => setPaused(!paused)}
          aria-label={paused ? "Play robot animation" : "Pause robot animation"}
          title={paused ? "Play animation" : "Pause animation"}
        >
          {paused ? <Play size={12} /> : <Pause size={12} />}
        </button>
      )}
    </div>
  );
}
