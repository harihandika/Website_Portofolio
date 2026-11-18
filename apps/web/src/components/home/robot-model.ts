import * as T from "three";

// Axis groups pivot in the XY plane. The layered castings sit on the Z axle.
export function buildRobot() {
  const steel = new T.MeshStandardMaterial({
    color: 0x697073,
    metalness: 0.93,
    roughness: 0.27,
  });
  const chrome = new T.MeshStandardMaterial({
    color: 0xbfc7ca,
    metalness: 0.96,
    roughness: 0.22,
  });
  const rubber = new T.MeshStandardMaterial({
    color: 0x1d201e,
    roughness: 0.54,
    metalness: 0.2,
  });
  const paint = new T.MeshStandardMaterial({
    color: 0xff7224,
    roughness: 0.32,
    metalness: 0.44,
  });
  const amber = new T.MeshStandardMaterial({
    color: 0xf68b36,
    roughness: 0.36,
    metalness: 0.4,
  });
  const black = new T.MeshStandardMaterial({
    color: 0x303332,
    metalness: 0.8,
    roughness: 0.35,
  });
  function mesh(
    parent: T.Object3D,
    geo: T.BufferGeometry,
    mat: T.Material,
    x = 0,
    y = 0,
    z = 0,
  ) {
    const m = new T.Mesh(geo, mat);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  }
  function group(parent: T.Object3D, x = 0, y = 0, z = 0) {
    const g = new T.Group();
    g.position.set(x, y, z);
    parent.add(g);
    return g;
  }
  function cyl(
    p: T.Object3D,
    a: number,
    b: number,
    h: number,
    mat: T.Material,
    x = 0,
    y = 0,
    z = 0,
    n = 48,
  ) {
    return mesh(p, new T.CylinderGeometry(a, b, h, n), mat, x, y, z);
  }
  function axle(
    p: T.Object3D,
    r: number,
    h: number,
    z: number,
    mat: T.Material,
    x = 0,
    y = 0,
    n = 48,
  ) {
    const m = cyl(p, r, r, h, mat, x, y, z, n);
    m.rotation.x = Math.PI / 2;
    return m;
  }
  function pivot(p: T.Object3D, r: number, w: number) {
    axle(p, r, w, 0, paint);
    axle(p, r * 0.87, 0.09, w / 2, black);
    axle(p, r * 0.73, 0.07, w / 2 + 0.06, steel);
    axle(p, r * 0.58, 0.075, w / 2 + 0.1, black);
    axle(p, r * 0.32, 0.085, w / 2 + 0.13, chrome);
    axle(p, r * 0.22, 0.09, w / 2 + 0.15, steel);
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      axle(
        p,
        r * 0.062,
        0.05,
        w / 2 + 0.115,
        chrome,
        r * 0.66 * Math.cos(a),
        r * 0.66 * Math.sin(a),
        6,
      );
    }
    axle(p, r * 0.79, 0.13, -w / 2, rubber);
  }
  function link(
    p: T.Object3D,
    l: number,
    a: number,
    b: number,
    depth: number,
    z: number,
    mat: T.Material,
  ) {
    const s = new T.Shape();
    s.moveTo(-a, 0);
    s.bezierCurveTo(-a * 0.9, l * 0.42, -b * 0.94, l * 0.77, -b, l);
    s.absarc(0, l, b, Math.PI, 0, true);
    s.bezierCurveTo(b * 0.95, l * 0.68, a * 0.83, l * 0.36, a, 0);
    s.absarc(0, 0, a, 0, -Math.PI, true);
    const g = new T.ExtrudeGeometry(s, {
      depth,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.045,
      bevelThickness: 0.045,
      curveSegments: 22,
    });
    return mesh(p, g, mat, 0, 0, z - depth / 2);
  }
  function tube(
    p: T.Object3D,
    points: number[][],
    radius: number,
    mat: T.Material,
  ) {
    const path = new T.CatmullRomCurve3(
      points.map(([x, y, z]) => new T.Vector3(x, y, z)),
    );
    return mesh(p, new T.TubeGeometry(path, 40, radius, 10, false), mat);
  }
  const root = new T.Group();
  const base = group(root, 0.58);
  cyl(base, 0.65, 0.74, 0.13, black, 0, 0.07);
  cyl(base, 0.57, 0.65, 0.16, steel, 0, 0.2);
  cyl(base, 0.55, 0.6, 0.08, rubber, 0, 0.31);
  cyl(base, 0.46, 0.57, 0.3, paint, 0, 0.49);
  cyl(base, 0.45, 0.48, 0.12, black, 0, 0.7);
  cyl(base, 0.405, 0.45, 0.08, chrome, 0, 0.79);
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    cyl(
      base,
      0.045,
      0.045,
      0.035,
      chrome,
      0.63 * Math.cos(a),
      0.148,
      0.63 * Math.sin(a),
      6,
    );
  }
  const mount = group(base, 0, 0.84);
  link(mount, 0.32, 0.34, 0.31, 0.55, 0, paint);
  const shoulder = group(mount, 0, 0.31);
  shoulder.rotation.z = -0.38;
  link(shoulder, 1.64, 0.29, 0.24, 0.36, -0.13, paint);
  link(shoulder, 1.64, 0.15, 0.12, 0.1, 0.115, amber);
  tube(
    shoulder,
    [
      [-0.29, 0, -0.05],
      [-0.36, 0.28, 0.01],
      [-0.3, 0.94, 0.01],
      [-0.23, 1.39, 0.01],
    ],
    0.058,
    black,
  );
  tube(
    shoulder,
    [
      [-0.37, 0.22, 0.02],
      [-0.35, 0.62, 0.02],
      [-0.29, 1.05, 0.02],
    ],
    0.07,
    chrome,
  );
  pivot(shoulder, 0.37, 0.69);
  const elbow = group(shoulder, 0, 1.64);
  elbow.rotation.z = 2.23;
  link(elbow, 1.54, 0.235, 0.155, 0.32, -0.1, paint);
  link(elbow, 1.54, 0.15, 0.095, 0.07, 0.13, amber);
  pivot(elbow, 0.31, 0.65);
  for (const z of [-0.14, -0.03, 0.08])
    tube(
      elbow,
      [
        [-0.18, -0.13, z],
        [-0.42, -0.12, z],
        [-0.44, 0.26, z],
        [-0.27, 0.59, z],
        [-0.2, 1.27, z],
        [-0.14, 1.52, z],
      ],
      0.036,
      rubber,
    );
  const wrist = group(elbow, 0, 1.54);
  wrist.rotation.z = 0.58;
  pivot(wrist, 0.202, 0.44);
  link(wrist, 0.36, 0.146, 0.11, 0.22, 0, paint);
  cyl(wrist, 0.12, 0.16, 0.16, steel, 0, 0.43);
  for (let i = 0; i < 4; i++)
    cyl(wrist, 0.126, 0.126, 0.032, i % 2 ? steel : black, 0, 0.51 + i * 0.038);
  const hand = group(wrist, 0, 0.7);
  mesh(hand, new T.BoxGeometry(0.37, 0.15, 0.22), black);
  for (const sign of [-1, 1]) {
    const jaw = group(hand, sign * 0.143, 0.08);
    jaw.rotation.z = sign * 0.15;
    mesh(jaw, new T.BoxGeometry(0.07, 0.3, 0.13), chrome, 0, 0.12);
    mesh(jaw, new T.BoxGeometry(0.11, 0.06, 0.13), steel, -sign * 0.026, 0.25);
  }
  return { root, shoulder, elbow, wrist };
}
