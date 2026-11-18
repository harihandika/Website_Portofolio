import * as T from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { buildRobot } from "./robot-model";

export function mountRobot(host: HTMLDivElement, motionEnabled: () => boolean) {
  const renderer = new T.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.13;
  const scene = new T.Scene(),
    pmrem = new T.PMREMGenerator(renderer),
    room = new RoomEnvironment();
  const env = pmrem.fromScene(room, 0.025);
  scene.environment = env.texture;
  scene.environmentIntensity = 0.78;
  room.dispose();
  pmrem.dispose();
  const camera = new T.OrthographicCamera(-2, 2, 2, -2, 0.1, 60);
  camera.position.set(3.1, 3.43, 8.5);
  camera.lookAt(0.12, 1.58, 0);
  const light = new T.DirectionalLight(0xfff3df, 3.0);
  light.position.set(-4, 7, 5);
  scene.add(light);
  const rim = new T.DirectionalLight(0xffbb77, 1.8);
  rim.position.set(3, 4, -3);
  scene.add(rim);
  const { root, shoulder, elbow, wrist } = buildRobot();
  scene.add(root);
  const grid = new T.GridHelper(5, 18, 0x63675f, 0x63675f);
  grid.position.y = -0.015;
  grid.material.transparent = true;
  grid.material.opacity = 0.19;
  scene.add(grid);
  for (const [radius, color] of [
    [1.13, 0xc67a45],
    [1.3, 0x737771],
  ]) {
    const ring = new T.Mesh(
      new T.RingGeometry(radius, radius + 0.009, 100),
      new T.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.6,
        side: T.DoubleSide,
      }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(0.58, -0.006, 0);
    scene.add(ring);
  }
  host.append(renderer.domElement);
  let frame = 0,
    last = 0,
    t = 0,
    pointer = 0,
    shown = true,
    moving = true;
  const draw = () => renderer.render(scene, camera);
  const tick = (now: number) => {
    frame = 0;
    if (!shown || document.hidden) return;
    const enabled = motionEnabled();
    if (enabled && now - last >= 32) {
      t += Math.min(now - last, 64) * 0.001;
      last = now;
      shoulder.rotation.z = -0.38 + Math.sin(t * 0.61) * 0.09;
      elbow.rotation.z = 2.23 + Math.sin(t * 0.61 + 0.8) * 0.12;
      wrist.rotation.z = 0.58 + Math.sin(t * 0.7) * 0.13;
      root.rotation.y += (pointer * 0.19 - root.rotation.y) * 0.08;
      draw();
    } else if (!enabled && moving) draw();
    moving = enabled;
    if (enabled) frame = requestAnimationFrame(tick);
  };
  const wake = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };
  const resize = new ResizeObserver(() => {
    const w = host.clientWidth,
      h = host.clientHeight;
    if (!w || !h) return;
    const half = Math.max(1.78, (1.9 * h) / w);
    camera.left = (-half * w) / h;
    camera.right = (half * w) / h;
    camera.top = half;
    camera.bottom = -half;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    draw();
    wake();
  });
  resize.observe(host);
  const observe = new IntersectionObserver((entries) => {
    shown = entries[0].isIntersecting;
    wake();
  });
  observe.observe(host);
  const point = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    pointer = Math.max(
      -1,
      Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1),
    );
  };
  const reset = () => {
    pointer = 0;
  };
  host.addEventListener("pointermove", point);
  host.addEventListener("pointerleave", reset);
  document.addEventListener("visibilitychange", wake);
  wake();
  return {
    wake,
    dispose() {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observe.disconnect();
      document.removeEventListener("visibilitychange", wake);
      host.removeEventListener("pointermove", point);
      host.removeEventListener("pointerleave", reset);
      const materials = new Set<T.Material>();
      scene.traverse((obj) => {
        if (obj instanceof T.Mesh || obj instanceof T.LineSegments) {
          obj.geometry.dispose();
          for (const m of Array.isArray(obj.material)
            ? obj.material
            : [obj.material])
            materials.add(m);
        }
      });
      materials.forEach((m) => m.dispose());
      env.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
