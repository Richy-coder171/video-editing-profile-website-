import { useEffect, useRef } from 'react';
import {
  AmbientLight,
  BoxGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SRGBColorSpace,
  TorusGeometry,
  WebGLRenderer
} from 'three';

const palette = {
  ink: 0x07090b,
  graphite: 0x101722,
  deepBlue: 0x0b2c5c,
  electric: 0x68a7ff,
  ember: 0xff4d57,
  acid: 0xffb000,
  violet: 0x8d7cff,
  frost: 0xf2eee6
};

const variantSettings = {
  reels: { z: 7.6, scale: 0.96, mobileScale: 0.72, rotation: [-0.12, -0.36, 0.08] },
  videos: { z: 7.4, scale: 1.04, mobileScale: 0.76, rotation: [-0.1, -0.28, 0.02] },
  designs: { z: 7.6, scale: 1, mobileScale: 0.72, rotation: [-0.08, -0.4, 0.08] },
  about: { z: 7.8, scale: 0.98, mobileScale: 0.7, rotation: [-0.06, -0.32, 0.04] },
  contact: { z: 7.6, scale: 1.02, mobileScale: 0.74, rotation: [-0.04, -0.34, 0.04] },
  detail: { z: 7.8, scale: 1.02, mobileScale: 0.72, rotation: [-0.08, -0.26, 0.02] },
  admin: { z: 7.8, scale: 0.92, mobileScale: 0.66, rotation: [-0.06, -0.34, 0.04] },
  notFound: { z: 7.8, scale: 0.95, mobileScale: 0.7, rotation: [-0.08, -0.38, 0.08] }
};

const disposeObject = (object) => {
  object.traverse((child) => {
    if (child.geometry) {
      child.geometry.dispose();
    }

    if (child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => material.dispose());
    }
  });
};

const material = (color, options = {}) =>
  new MeshStandardMaterial({
    color,
    emissive: options.emissive ?? color,
    emissiveIntensity: options.emissiveIntensity ?? 0.08,
    roughness: options.roughness ?? 0.36,
    metalness: options.metalness ?? 0.42
  });

const glowMaterial = (color, opacity = 0.78) =>
  new MeshBasicMaterial({
    color,
    transparent: true,
    opacity
  });

const box = ({ size, color = palette.graphite, emissive, position = [0, 0, 0], rotation = [0, 0, 0], options = {} }) => {
  const mesh = new Mesh(
    new BoxGeometry(size[0], size[1], size[2]),
    material(color, { emissive, ...options })
  );
  mesh.position.set(position[0], position[1], position[2]);
  mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
  return mesh;
};

const glowPlane = ({ size, color, position = [0, 0, 0], rotation = [0, 0, 0], opacity = 0.7 }) => {
  const mesh = new Mesh(new PlaneGeometry(size[0], size[1]), glowMaterial(color, opacity));
  mesh.position.set(position[0], position[1], position[2]);
  mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
  return mesh;
};

const ring = ({ radius, tube, color, position = [0, 0, 0], rotation = [0, 0, 0], opacity = 0.9 }) => {
  const mesh = new Mesh(new TorusGeometry(radius, tube, 14, 72), glowMaterial(color, opacity));
  mesh.position.set(position[0], position[1], position[2]);
  mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
  return mesh;
};

const lens = ({ position = [0, 0, 0], scale = 1 }) => {
  const group = new Group();
  const outer = new Mesh(
    new CylinderGeometry(0.48 * scale, 0.48 * scale, 0.32 * scale, 48),
    material(palette.graphite, { emissive: palette.deepBlue, emissiveIntensity: 0.14, metalness: 0.68 })
  );
  const glass = new Mesh(
    new CylinderGeometry(0.34 * scale, 0.34 * scale, 0.045 * scale, 48),
    material(palette.deepBlue, { emissive: palette.electric, emissiveIntensity: 0.72, metalness: 0.16, roughness: 0.2 })
  );
  const rim = ring({ radius: 0.5 * scale, tube: 0.022 * scale, color: palette.acid, position: [0, 0.18 * scale, 0], rotation: [Math.PI / 2, 0, 0] });

  outer.rotation.x = Math.PI / 2;
  glass.rotation.x = Math.PI / 2;
  glass.position.y = 0.18 * scale;
  group.add(outer, glass, rim);
  group.position.set(position[0], position[1], position[2]);
  return group;
};

const timelineClips = (widths = [0.8, 1.1, 0.65, 1.2]) => {
  const group = new Group();
  const colors = [palette.ember, palette.electric, palette.acid, palette.violet];

  widths.forEach((width, index) => {
    group.add(
      box({
        size: [width, 0.12, 0.14],
        color: colors[index % colors.length],
        emissive: colors[index % colors.length],
        position: [-1.45 + index * 0.78, index % 2 ? -0.1 : 0.12, index * 0.035],
        options: { emissiveIntensity: 0.28, roughness: 0.4, metalness: 0.16 }
      })
    );
  });

  group.rotation.x = -0.55;
  return group;
};

const createReelsModel = () => {
  const model = new Group();
  const phone = new Group();

  phone.add(
    box({ size: [1.08, 2.22, 0.15], color: palette.ink, emissive: palette.deepBlue, options: { metalness: 0.65 } }),
    box({ size: [0.88, 1.86, 0.08], color: palette.deepBlue, emissive: palette.electric, position: [0, -0.03, 0.08], options: { emissiveIntensity: 0.52 } }),
    box({ size: [0.34, 0.04, 0.03], color: palette.frost, position: [0, 0.98, 0.14], options: { emissiveIntensity: 0.04 } }),
    glowPlane({ size: [0.32, 0.98], color: palette.acid, position: [-0.22, -0.05, 0.13], opacity: 0.74 }),
    glowPlane({ size: [0.32, 1.24], color: palette.electric, position: [0.24, -0.12, 0.13], opacity: 0.72 }),
    ring({ radius: 0.95, tube: 0.028, color: palette.electric, position: [0.18, -0.08, -0.12], rotation: [0.1, 0.18, 0.28], opacity: 0.46 }),
    ring({ radius: 1.22, tube: 0.018, color: palette.acid, position: [0.18, -0.08, -0.18], rotation: [0.08, -0.1, 0.28], opacity: 0.36 })
  );

  phone.rotation.set(0.06, -0.18, -0.08);
  model.add(phone);

  const clips = timelineClips([0.64, 0.84, 0.54, 0.92]);
  clips.position.set(0.08, -1.58, 0.4);
  model.add(clips);

  return model;
};

const createVideosModel = () => {
  const model = new Group();
  const monitor = new Group();

  monitor.add(
    box({ size: [2.75, 1.48, 0.16], color: palette.graphite, emissive: palette.deepBlue, options: { metalness: 0.7 } }),
    box({ size: [2.38, 1.16, 0.08], color: palette.deepBlue, emissive: palette.electric, position: [0, 0.03, 0.1], options: { emissiveIntensity: 0.58 } }),
    box({ size: [2.1, 0.08, 0.04], color: palette.ink, position: [0, 0.52, 0.15] }),
    box({ size: [2.1, 0.08, 0.04], color: palette.ink, position: [0, -0.46, 0.15] }),
    glowPlane({ size: [0.98, 0.04], color: palette.electric, position: [-0.48, 0.05, 0.16], opacity: 0.82 }),
    glowPlane({ size: [0.64, 0.04], color: palette.acid, position: [0.58, -0.16, 0.16], opacity: 0.82 })
  );

  const stand = box({ size: [0.24, 0.65, 0.16], color: palette.graphite, position: [0, -1.02, -0.02] });
  const base = box({ size: [1.12, 0.12, 0.44], color: palette.graphite, position: [0, -1.36, 0] });
  const cameraLens = lens({ position: [1.42, 0.62, 0.46], scale: 0.7 });
  const clips = timelineClips();

  clips.position.set(0.05, -1.58, 0.36);
  model.add(monitor, stand, base, cameraLens, clips);
  return model;
};

const createDesignsModel = () => {
  const model = new Group();
  const colors = [palette.electric, palette.ember, palette.acid, palette.violet];

  for (let index = 0; index < 4; index += 1) {
    model.add(
      box({
        size: [1.62, 2.05, 0.08],
        color: index % 2 ? 0x16131c : 0x101822,
        emissive: colors[index],
        position: [-0.58 + index * 0.32, 0.2 - index * 0.12, index * 0.1],
        rotation: [0.02, -0.18 + index * 0.04, -0.18 + index * 0.12],
        options: { emissiveIntensity: 0.14, metalness: 0.35 }
      })
    );
    model.add(
      glowPlane({
        size: [0.9, 0.08],
        color: colors[index],
        position: [-0.58 + index * 0.32, 0.58 - index * 0.12, 0.08 + index * 0.1],
        rotation: [0, 0, -0.18 + index * 0.12],
        opacity: 0.8
      })
    );
  }

  colors.forEach((color, index) => {
    model.add(
      box({
        size: [0.26, 0.26, 0.2],
        color,
        emissive: color,
        position: [-1.05 + index * 0.46, -1.24, 0.46],
        options: { emissiveIntensity: 0.35, metalness: 0.2 }
      })
    );
  });

  return model;
};

const createAboutModel = () => {
  const model = new Group();
  const core = new Group();

  core.add(
    box({ size: [1.42, 0.78, 0.16], color: palette.ink, emissive: palette.ember, options: { metalness: 0.56 } }),
    box({ size: [0.26, 0.2, 0.18], color: palette.frost, position: [-0.48, 0.52, 0.02] }),
    box({ size: [0.26, 0.2, 0.18], color: palette.graphite, position: [-0.18, 0.52, 0.02] }),
    box({ size: [0.26, 0.2, 0.18], color: palette.frost, position: [0.12, 0.52, 0.02] }),
    box({ size: [0.26, 0.2, 0.18], color: palette.graphite, position: [0.42, 0.52, 0.02] })
  );
  core.rotation.set(-0.08, 0.18, -0.12);

  const panels = [
    [-1.45, -0.65, 0.08, palette.electric],
    [1.36, -0.5, 0.12, palette.violet],
    [1.1, 1.08, -0.06, palette.acid]
  ];

  panels.forEach(([x, y, z, color], index) => {
    model.add(
      box({
        size: [0.92, 0.58, 0.08],
        color: palette.graphite,
        emissive: color,
        position: [x, y, z],
        rotation: [0.04, index % 2 ? -0.38 : 0.32, index % 2 ? 0.16 : -0.14],
        options: { emissiveIntensity: 0.2 }
      })
    );
  });

  model.add(core, ring({ radius: 1.75, tube: 0.02, color: palette.electric, rotation: [0.28, 0.12, 0.4], opacity: 0.34 }));
  return model;
};

const createContactModel = () => {
  const model = new Group();
  const message = new Group();

  message.add(
    box({ size: [2.05, 1.16, 0.1], color: palette.graphite, emissive: palette.electric, options: { emissiveIntensity: 0.18 } }),
    glowPlane({ size: [1.12, 0.06], color: palette.electric, position: [-0.2, 0.18, 0.07], opacity: 0.82 }),
    glowPlane({ size: [0.8, 0.06], color: palette.acid, position: [0.22, -0.14, 0.07], opacity: 0.78 }),
    box({ size: [0.92, 0.04, 0.04], color: palette.frost, position: [-0.34, 0.46, 0.08], rotation: [0, 0, -0.42] }),
    box({ size: [0.92, 0.04, 0.04], color: palette.frost, position: [0.34, 0.46, 0.08], rotation: [0, 0, 0.42] })
  );
  message.rotation.set(-0.04, -0.28, 0.08);

  model.add(
    message,
    ring({ radius: 1.4, tube: 0.024, color: palette.acid, position: [0.18, 0, -0.18], rotation: [0.22, 0.2, -0.26], opacity: 0.42 }),
    box({ size: [0.24, 0.24, 0.24], color: palette.ember, emissive: palette.ember, position: [-1.26, -0.82, 0.36], options: { emissiveIntensity: 0.35 } }),
    box({ size: [0.18, 0.18, 0.18], color: palette.electric, emissive: palette.electric, position: [1.34, 0.82, 0.28], options: { emissiveIntensity: 0.35 } })
  );
  return model;
};

const createDetailModel = () => {
  const model = createVideosModel();
  model.add(ring({ radius: 1.82, tube: 0.018, color: palette.violet, position: [0.2, 0.1, -0.22], rotation: [0.16, 0.3, 0.18], opacity: 0.3 }));
  return model;
};

const createAdminModel = () => {
  const model = new Group();

  model.add(
    box({ size: [1.42, 1.68, 0.92], color: palette.graphite, emissive: palette.electric, options: { emissiveIntensity: 0.12, metalness: 0.62 } }),
    box({ size: [1.08, 0.08, 0.08], color: palette.electric, emissive: palette.electric, position: [0, 0.45, 0.5], options: { emissiveIntensity: 0.42 } }),
    box({ size: [0.74, 0.08, 0.08], color: palette.acid, emissive: palette.acid, position: [-0.16, 0.12, 0.5], options: { emissiveIntensity: 0.42 } }),
    box({ size: [0.96, 0.08, 0.08], color: palette.violet, emissive: palette.violet, position: [0.1, -0.22, 0.5], options: { emissiveIntensity: 0.42 } }),
    box({ size: [0.28, 0.76, 0.16], color: palette.frost, position: [0, 1.28, 0.18] }),
    box({ size: [0.72, 0.18, 0.16], color: palette.frost, position: [0, 1.06, 0.18] }),
    ring({ radius: 1.12, tube: 0.026, color: palette.electric, position: [0, 0, -0.26], rotation: [0.22, -0.12, 0.22], opacity: 0.38 })
  );

  return model;
};

const createNotFoundModel = () => {
  const model = new Group();
  const pieces = [
    [-0.8, 0.48, 0, 0.34, palette.electric],
    [0.72, 0.35, 0.1, -0.28, palette.ember],
    [-0.2, -0.38, 0.2, 0.14, palette.acid],
    [0.98, -0.58, 0.16, 0.42, palette.violet]
  ];

  pieces.forEach(([x, y, z, rotation, color]) => {
    model.add(
      box({
        size: [1.05, 0.68, 0.08],
        color: palette.graphite,
        emissive: color,
        position: [x, y, z],
        rotation: [0.06, -0.26, rotation],
        options: { emissiveIntensity: 0.24 }
      })
    );
  });

  model.add(ring({ radius: 1.5, tube: 0.022, color: palette.ember, rotation: [0.24, 0.1, 0.32], opacity: 0.34 }));
  return model;
};

const modelFactories = {
  reels: createReelsModel,
  videos: createVideosModel,
  designs: createDesignsModel,
  about: createAboutModel,
  contact: createContactModel,
  detail: createDetailModel,
  admin: createAdminModel,
  notFound: createNotFoundModel
};

const Page3DAccent = ({ variant = 'videos', className = '' }) => {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return undefined;
    }

    const settings = variantSettings[variant] || variantSettings.videos;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new Scene();
    const camera = new PerspectiveCamera(34, 1, 0.1, 100);
    const renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    });
    const model = (modelFactories[variant] || createVideosModel)();
    const pointer = { x: 0, y: 0 };
    const startTime = performance.now();

    renderer.outputColorSpace = SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
    renderer.domElement.className = 'h-full w-full';
    renderer.domElement.dataset.page3d = variant;
    host.appendChild(renderer.domElement);

    camera.position.set(0, 0.42, settings.z);
    camera.lookAt(0, 0, 0);

    const [baseX, baseY, baseZ] = settings.rotation;
    model.rotation.set(baseX, baseY, baseZ);
    scene.add(model);
    scene.add(new AmbientLight(0xa9bbff, 1.1));

    const keyLight = new DirectionalLight(palette.frost, 2.1);
    keyLight.position.set(3.2, 4.8, 4.2);
    scene.add(keyLight);

    const blueLight = new PointLight(palette.electric, 4.8, 10);
    blueLight.position.set(-2.4, 1.5, 2.4);
    scene.add(blueLight);

    const amberLight = new PointLight(palette.acid, 3.2, 9);
    amberLight.position.set(2.3, -1.2, 2.1);
    scene.add(amberLight);

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      const safeWidth = Math.max(width, 1);
      const safeHeight = Math.max(height, 1);
      const compact = safeWidth < 520;

      renderer.setSize(safeWidth, safeHeight, false);
      camera.aspect = safeWidth / safeHeight;
      camera.position.z = compact ? settings.z + 1 : settings.z;
      model.scale.setScalar(compact ? settings.mobileScale : settings.scale);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const handlePointerMove = (event) => {
      const rect = host.getBoundingClientRect();

      if (!rect.width || !rect.height) {
        return;
      }

      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let animationFrame = 0;
    const render = () => {
      const elapsed = (performance.now() - startTime) / 1000;

      if (!prefersReducedMotion) {
        model.rotation.y += (baseY + pointer.x * 0.08 - model.rotation.y) * 0.035;
        model.rotation.x += (baseX - pointer.y * 0.04 - model.rotation.x) * 0.035;
        model.position.y = Math.sin(elapsed * 1.05) * 0.06;
        model.children.forEach((child, index) => {
          if (index % 3 === 0) {
            child.rotation.z += Math.sin(elapsed * 0.8 + index) * 0.0008;
          }
        });
      }

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('pointermove', handlePointerMove);
      resizeObserver.disconnect();
      disposeObject(scene);
      renderer.dispose();
      renderer.forceContextLoss();

      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [variant]);

  return (
    <div
      ref={hostRef}
      className={`pointer-events-none absolute z-0 ${className}`}
      aria-hidden="true"
    />
  );
};

export default Page3DAccent;
