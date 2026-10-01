import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type {
  Group,
  Mesh,
  PerspectiveCamera,
  Points,
  Raycaster,
  Scene,
  Sprite,
  Vector2,
  WebGLRenderer,
} from "three";

/** Domains orbiting the Dishayaan core — real v1 tracks plus exam routes. */
export interface NetworkNode {
  id: string;
  label: string;
  color: number;
  subs: string[];
}

export const NETWORK_NODES: NetworkNode[] = [
  {
    id: "ai",
    label: "AI & ML",
    color: 0x2563eb,
    subs: ["Artificial Intelligence", "Machine Learning", "Generative AI", "Data", "Projects"],
  },
  {
    id: "robotics",
    label: "Robotics",
    color: 0x7c3aed,
    subs: ["Sensors", "Control", "Embedded systems", "Automation", "Robotic systems"],
  },
  {
    id: "drones",
    label: "Drones",
    color: 0x06b6d4,
    subs: ["Aerodynamics", "Flight controllers", "Telemetry", "Mapping", "Regulation"],
  },
  {
    id: "cs",
    label: "Computer Sci",
    color: 0x2563eb,
    subs: ["Python", "Algorithms", "Data structures", "Web", "Git"],
  },
  {
    id: "markets",
    label: "Stock Market",
    color: 0x16a34a,
    subs: ["Financial statements", "Charts", "Risk", "Paper trading", "Portfolios"],
  },
  {
    id: "biotech",
    label: "Biotech",
    color: 0x16a34a,
    subs: ["Genetics", "Lab work", "Bioinformatics", "Life sciences"],
  },
  {
    id: "physics",
    label: "Physics",
    color: 0xfb923c,
    subs: ["Mechanics", "Numericals", "Simulation", "Experiment design"],
  },
  {
    id: "engineering",
    label: "Engineering",
    color: 0xfb923c,
    subs: ["Design thinking", "CAD", "Prototyping", "Testing"],
  },
  {
    id: "research",
    label: "Research",
    color: 0x7c3aed,
    subs: ["Literature", "Method", "Analysis", "Writing", "Ethics"],
  },
  {
    id: "jee",
    label: "JEE",
    color: 0x2563eb,
    subs: ["Physics", "Chemistry", "Maths", "Chapter map", "Mock analysis"],
  },
  {
    id: "neet",
    label: "NEET",
    color: 0x16a34a,
    subs: ["Biology depth", "Recall systems", "Accuracy", "Revision"],
  },
  {
    id: "nda",
    label: "NDA",
    color: 0x7c3aed,
    subs: ["Maths", "General ability", "Fitness rhythm", "SSB readiness"],
  },
  {
    id: "cs-cma",
    label: "CS / CMA",
    color: 0x06b6d4,
    subs: ["Company law", "Cost accounting", "Answer writing", "Attempt planning"],
  },
  {
    id: "startup",
    label: "Startups",
    color: 0xec4899,
    subs: ["Problem discovery", "Pricing", "Pitching", "Money basics"],
  },
];

interface HoverState {
  node: NetworkNode;
  x: number;
  y: number;
}

export function FutureNetwork({
  className,
  onHover,
}: {
  className?: string;
  onHover?: (node: NetworkNode | null) => void;
}) {
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hoverRef = useRef(onHover);
  const [fallback, setFallback] = useState(false);
  const [hover, setHover] = useState<HoverState | null>(null);

  useEffect(() => {
    hoverRef.current = onHover;
  }, [onHover]);

  useEffect(() => {
    if (isMobile) {
      setFallback(true);
      return;
    }
    const el = containerRef.current;
    if (!el) return;

    let disposed = false;
    let teardown: (() => void) | undefined;

    const boot = async () => {
      // A WebGL context is required; if the device refuses one, degrade.
      try {
        const probe = document.createElement("canvas");
        const gl =
          probe.getContext("webgl2") ??
          probe.getContext("webgl") ??
          probe.getContext("experimental-webgl");
        if (!gl) {
          setFallback(true);
          return;
        }
      } catch {
        setFallback(true);
        return;
      }

      const THREE = await import("three");
      if (disposed) return;
      teardown = mountScene(THREE, el, {
        reduce: !!reduceMotion,
        onHoverChange: setHover,
        onHover: (n) => hoverRef.current?.(n),
      });
    };

    void boot();

    return () => {
      disposed = true;
      teardown?.();
    };
  }, [isMobile, reduceMotion]);

  if (fallback) {
    return (
      <div className={cn("relative", className)}>
        <FutureNetwork2D onHoverChange={setHover} onHover={onHover} />
        <HoverTooltip hover={hover} />
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div
        ref={containerRef}
        className="h-[300px] w-full sm:h-[420px] lg:h-[520px]"
        aria-hidden="true"
      />
      <HoverTooltip hover={hover} />
    </div>
  );
}

function HoverTooltip({ hover }: { hover: HoverState | null }) {
  if (!hover) return null;
  return (
    <div
      className="pointer-events-none absolute z-20 w-[210px] border-2 border-ink bg-white p-3 shadow-neo"
      style={{
        left: hover.x,
        top: hover.y,
        transform: "translate(-50%, -110%)",
      }}
    >
      <p className="text-xs font-bold uppercase tracking-wider">{hover.node.label}</p>
      <ul className="mt-2 space-y-1">
        {hover.node.subs.map((s) => (
          <li key={s} className="text-[11px] leading-snug text-muted-foreground">
            — {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface MountOptions {
  reduce: boolean;
  onHoverChange: (hover: HoverState | null) => void;
  onHover: (node: NetworkNode | null) => void;
}

function mountScene(
  THREE: typeof import("three"),
  container: HTMLDivElement,
  options: MountOptions,
): () => void {
  const scene: Scene = new THREE.Scene();
  const camera: PerspectiveCamera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / Math.max(container.clientHeight, 1),
    0.1,
    100,
  );
  camera.position.set(0, 0, 9.5);

  const renderer: WebGLRenderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.display = "block";

  const root = new THREE.Group();
  scene.add(root);

  // ── Core node ─────────────────────────────────────────────────────
  const coreGeo = new THREE.IcosahedronGeometry(0.62, 1);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x0f172a,
    wireframe: true,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  root.add(core);

  const coreInnerGeo = new THREE.SphereGeometry(0.3, 24, 24);
  const coreInnerMat = new THREE.MeshBasicMaterial({ color: 0x2563eb });
  const coreInner = new THREE.Mesh(coreInnerGeo, coreInnerMat);
  root.add(coreInner);

  const coreLabel = makeLabel(THREE, "DISHAAYAAN", 36, "#ffffff", "#0f172a", 1.9);
  coreLabel.position.set(0, -1.05, 0);
  root.add(coreLabel);

  // ── Satellites arranged on a Fibonacci sphere ─────────────────────
  const radius = 3.35;
  const nodeMeshes: Mesh[] = [];
  const nodeSprites: Sprite[] = [];
  const disposables: Array<{ dispose: () => void }> = [
    coreGeo,
    coreMat,
    coreInnerGeo,
    coreInnerMat,
  ];

  const linePositions: number[] = [];

  NETWORK_NODES.forEach((node, i) => {
    // Fibonacci sphere keeps spacing even without clustering.
    const t = (i + 0.5) / NETWORK_NODES.length;
    const inclination = Math.acos(1 - 2 * t);
    const azimuth = Math.PI * (1 + Math.sqrt(5)) * i;
    const x = radius * Math.sin(inclination) * Math.cos(azimuth);
    const y = radius * Math.cos(inclination) * 0.72;
    const z = radius * Math.sin(inclination) * Math.sin(azimuth);

    const geo = new THREE.SphereGeometry(0.115, 18, 18);
    const mat = new THREE.MeshBasicMaterial({ color: node.color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.userData.node = node;
    root.add(mesh);
    nodeMeshes.push(mesh);
    disposables.push(geo, mat);

    const sprite = makeLabel(
      THREE,
      node.label,
      26,
      "#0f172a",
      "rgba(255,255,255,0.94)",
      1.28,
    );
    sprite.position.set(x, y - 0.42, z);
    root.add(sprite);
    nodeSprites.push(sprite);
    disposables.push(sprite.material as unknown as { dispose: () => void });

    linePositions.push(0, 0, 0, x, y, z);
  });

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(linePositions, 3),
  );
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x0f172a,
    transparent: true,
    opacity: 0.22,
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  root.add(lines);
  disposables.push(lineGeo, lineMat);

  // ── Particle field for depth ──────────────────────────────────────
  const particleCount = 420;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i += 1) {
    const r = 4.4 + Math.random() * 5.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    particlePositions[i * 3 + 1] = r * Math.cos(phi) * 0.8;
    particlePositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3),
  );
  const particleMat = new THREE.PointsMaterial({
    color: 0x64748b,
    size: 0.045,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });
  const particles: Points = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);
  disposables.push(particleGeo, particleMat);

  // ── Interaction ───────────────────────────────────────────────────
  const pointer: Vector2 = new THREE.Vector2(3, 3);
  const raycaster: Raycaster = new THREE.Raycaster();
  let pointerX = 0;
  let pointerY = 0;
  let targetRotX = 0;
  let targetRotY = 0;
  let hovered: Mesh | null = null;
  let frame = 0;
  // React state updates are throttled: the tooltip only needs to follow the
  // cursor roughly 12 times a second, not on every animation frame.
  let lastHoverEmit = 0;
  let lastHoverNode: NetworkNode | null = null;

  const emitHover = (node: NetworkNode | null, mesh: Mesh | null) => {
    const now = performance.now();
    if (node === lastHoverNode && now - lastHoverEmit < 80) return;
    lastHoverEmit = now;
    lastHoverNode = node;
    if (!node || !mesh) {
      options.onHoverChange(null);
      return;
    }
    const rect = rectOf();
    const projected = mesh.position.clone().project(camera);
    options.onHoverChange({
      node,
      x: ((projected.x + 1) / 2) * rect.width,
      y: ((-projected.y + 1) / 2) * rect.height,
    });
  };

  const rectOf = () => container.getBoundingClientRect();

  const onPointerMove = (event: PointerEvent) => {
    const rect = rectOf();
    const nx = (event.clientX - rect.left) / rect.width;
    const ny = (event.clientY - rect.top) / rect.height;
    pointerX = (nx - 0.5) * 2;
    pointerY = (ny - 0.5) * 2;
    pointer.set(nx * 2 - 1, -(ny * 2 - 1));
    targetRotY = pointerX * 0.45;
    targetRotX = pointerY * 0.32;
  };

  const onPointerLeave = () => {
    pointer.set(3, 3);
    pointerX = 0;
    pointerY = 0;
    targetRotX = 0;
    targetRotY = 0;
    if (hovered) {
      hovered.scale.setScalar(1);
      hovered = null;
    }
    options.onHoverChange(null);
    options.onHover(null);
  };

  container.addEventListener("pointermove", onPointerMove, { passive: true });
  container.addEventListener("pointerleave", onPointerLeave);

  const onResize = () => {
    const w = container.clientWidth;
    const h = Math.max(container.clientHeight, 1);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  const observer = new ResizeObserver(onResize);
  observer.observe(container);

  const clock = new THREE.Clock();

  const renderFrame = () => {
    frame = requestAnimationFrame(renderFrame);
    const elapsed = clock.getElapsedTime();

    if (options.reduce) {
      // Static composition: honour prefers-reduced-motion fully.
      root.rotation.set(-0.18, 0.5, 0);
    } else {
      root.rotation.y += 0.0016;
      root.rotation.x += (targetRotX * 0.25 - root.rotation.x) * 0.05;
      root.rotation.z += (targetRotY * 0.08 - root.rotation.z) * 0.05;
      particles.rotation.y = elapsed * 0.012;
      core.rotation.y = elapsed * 0.35;
      core.rotation.x = elapsed * 0.18;
      const pulse = 1 + Math.sin(elapsed * 1.4) * 0.06;
      coreInner.scale.setScalar(pulse);
    }

    // Hover test
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(nodeMeshes, false)[0];
    const nextHovered = (hit?.object as Mesh | undefined) ?? null;

    if (nextHovered !== hovered) {
      if (hovered) hovered.scale.setScalar(1);
      hovered = nextHovered;
      if (hovered) hovered.scale.setScalar(1.9);
      const node = (hovered?.userData.node as NetworkNode | undefined) ?? null;
      options.onHover(node);
      emitHover(node, hovered);
    } else if (hovered) {
      emitHover(hovered.userData.node as NetworkNode, hovered);
    }

    renderer.render(scene, camera);
  };
  renderFrame();

  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    container.removeEventListener("pointermove", onPointerMove);
    container.removeEventListener("pointerleave", onPointerLeave);
    nodeSprites.forEach((s) => {
      const mat = s.material as import("three").SpriteMaterial;
      mat.map?.dispose();
      mat.dispose();
    });
    disposables.forEach((d) => d.dispose());
    renderer.dispose();
    renderer.forceContextLoss?.();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  };
}

/** Canvas-texture label so nodes stay readable without a font atlas. */
function makeLabel(
  THREE: typeof import("three"),
  text: string,
  fontSize: number,
  color: string,
  background: string,
  worldWidth: number,
): Sprite {
  const pad = 14;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = `700 ${fontSize}px "Space Grotesk", Inter, sans-serif`;
  const metrics = ctx.measureText(text.toUpperCase());
  canvas.width = Math.ceil(metrics.width + pad * 2);
  canvas.height = fontSize + pad * 2;

  const c = canvas.getContext("2d")!;
  c.fillStyle = background;
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.strokeStyle = "#0f172a";
  c.lineWidth = 3;
  c.strokeRect(1.5, 1.5, canvas.width - 3, canvas.height - 3);
  c.font = `700 ${fontSize}px "Space Grotesk", Inter, sans-serif`;
  c.fillStyle = color;
  c.textBaseline = "middle";
  c.fillText(text.toUpperCase(), pad, canvas.height / 2 + 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(material);
  const aspect = canvas.height / canvas.width;
  sprite.scale.set(worldWidth, worldWidth * aspect, 1);
  sprite.renderOrder = 2;
  return sprite;
}

/**
 * Low-power / mobile presentation: same information architecture, no WebGL.
 * IntersectionObserver and CSS keep this cheap on mid-range Android devices.
 */
function FutureNetwork2D({
  onHoverChange,
  onHover,
}: {
  onHoverChange: (hover: HoverState | null) => void;
  onHover?: (node: NetworkNode | null) => void;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="relative">
      <motion.div
        className="relative mx-auto aspect-square w-full max-w-[420px]"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-6 border-2 border-dashed border-ink/25" />
        <div className="absolute inset-16 border-2 border-ink/15" />
        <div className="absolute left-1/2 top-1/2 flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center border-2 border-ink bg-ink text-center text-[10px] font-bold uppercase tracking-wider text-white">
          Dishayaan
        </div>
        {NETWORK_NODES.map((node, i) => {
          const angle = (i / NETWORK_NODES.length) * Math.PI * 2;
          const r = 43;
          const left = 50 + Math.cos(angle) * r * 0.98;
          const top = 50 + Math.sin(angle) * r * 0.98;
          return (
            <button
              key={node.id}
              type="button"
              onPointerEnter={() => {
                onHover?.(node);
                onHoverChange(null);
              }}
              onPointerLeave={() => {
                onHover?.(null);
                onHoverChange(null);
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 border-2 border-ink bg-white px-2 py-1 text-[10px] font-bold whitespace-nowrap"
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              {node.label}
            </button>
          );
        })}
      </motion.div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Lightweight view — the full interactive 3D network runs on larger screens.
      </p>
    </div>
  );
}
