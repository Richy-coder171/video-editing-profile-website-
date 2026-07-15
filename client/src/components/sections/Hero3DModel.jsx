import { useEffect, useRef } from 'react';
import {
  AmbientLight,
  BoxGeometry,
  CylinderGeometry,
  DirectionalLight,
  Euler,
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
  Vector3,
  WebGLRenderer
} from 'three';

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

const createClip = ({ width, color, x, y, z }) => {
  const geometry = new BoxGeometry(width, 0.12, 0.16);
  const material = new MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.28,
    roughness: 0.42,
    metalness: 0.18
  });
  const clip = new Mesh(geometry, material);
  clip.position.set(x, y, z);
  return clip;
};

const createPanel = ({ color, emissive, position, rotation, scale }) => {
  const panel = new Group();
  const body = new Mesh(
    new BoxGeometry(1.5, 0.92, 0.08),
    new MeshStandardMaterial({
      color,
      emissive,
      emissiveIntensity: 0.18,
      roughness: 0.34,
      metalness: 0.38
    })
  );
  const glow = new Mesh(
    new PlaneGeometry(1.22, 0.08),
    new MeshBasicMaterial({ color: emissive, transparent: true, opacity: 0.8 })
  );

  glow.position.set(0, -0.28, 0.052);
  panel.add(body, glow);
  panel.position.copy(position);
  panel.rotation.set(rotation.x, rotation.y, rotation.z);
  panel.scale.setScalar(scale);

  return panel;
};

const Hero3DModel = () => {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new Scene();
    const camera = new PerspectiveCamera(34, 1, 0.1, 100);
    const renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    });
    const model = new Group();
    const pointer = { x: 0, y: 0 };
    const startTime = performance.now();

    renderer.outputColorSpace = SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.domElement.className = 'h-full w-full';
    renderer.domElement.dataset.hero3d = 'true';
    host.appendChild(renderer.domElement);

    camera.position.set(0, 0.85, 7.6);
    camera.lookAt(0, 0, 0);

    scene.add(new AmbientLight(0x9fb8ff, 1.15));

    const keyLight = new DirectionalLight(0xf2eee6, 2.4);
    keyLight.position.set(3.4, 5.2, 4.5);
    scene.add(keyLight);

    const blueLight = new PointLight(0x68a7ff, 6.5, 12);
    blueLight.position.set(-2.8, 1.6, 2.5);
    scene.add(blueLight);

    const amberLight = new PointLight(0xffb000, 4.5, 10);
    amberLight.position.set(2.9, -1.2, 2.2);
    scene.add(amberLight);

    const darkMetal = new MeshStandardMaterial({
      color: 0x1b2635,
      emissive: 0x0a1f38,
      emissiveIntensity: 0.08,
      roughness: 0.28,
      metalness: 0.72
    });
    const screenMaterial = new MeshStandardMaterial({
      color: 0x08111f,
      emissive: 0x0b2c5c,
      emissiveIntensity: 0.95,
      roughness: 0.2,
      metalness: 0.4
    });
    const frostMaterial = new MeshStandardMaterial({
      color: 0xf2eee6,
      roughness: 0.32,
      metalness: 0.25
    });
    const blackMaterial = new MeshStandardMaterial({
      color: 0x020305,
      roughness: 0.36,
      metalness: 0.55
    });
    const blueGlow = new MeshBasicMaterial({ color: 0x68a7ff, transparent: true, opacity: 0.92 });
    const amberGlow = new MeshBasicMaterial({ color: 0xffb000, transparent: true, opacity: 0.92 });

    const blueBackplate = new Mesh(
      new PlaneGeometry(4.9, 3.25),
      new MeshBasicMaterial({ color: 0x68a7ff, transparent: true, opacity: 0.12 })
    );
    const amberBackplate = new Mesh(
      new PlaneGeometry(3.6, 2.4),
      new MeshBasicMaterial({ color: 0xff4d57, transparent: true, opacity: 0.08 })
    );

    blueBackplate.position.set(-0.2, 0.05, -0.42);
    amberBackplate.position.set(0.72, -0.32, -0.38);
    amberBackplate.rotation.z = -0.18;

    const monitor = new Group();
    const monitorFrame = new Mesh(new BoxGeometry(3.55, 2.08, 0.16), darkMetal);
    const monitorScreen = new Mesh(new BoxGeometry(3.18, 1.72, 0.09), screenMaterial);
    const monitorStand = new Mesh(new BoxGeometry(0.38, 0.72, 0.18), darkMetal);
    const monitorBase = new Mesh(new BoxGeometry(1.65, 0.14, 0.55), darkMetal);

    monitorScreen.position.z = 0.08;
    monitorStand.position.set(0, -1.34, -0.02);
    monitorBase.position.set(0, -1.74, 0.02);
    monitor.add(monitorFrame, monitorScreen, monitorStand, monitorBase);

    const screenLines = new Group();
    for (let index = 0; index < 7; index += 1) {
      const line = new Mesh(
        new BoxGeometry(index % 2 === 0 ? 1.35 : 0.85, 0.035, 0.025),
        index % 3 === 0 ? amberGlow : blueGlow
      );
      line.position.set(-1.24 + index * 0.42, -0.52 + (index % 3) * 0.36, 0.145);
      screenLines.add(line);
    }
    monitor.add(screenLines);

    const clapper = new Group();
    const clapBody = new Mesh(new BoxGeometry(1.64, 0.9, 0.16), blackMaterial);
    const clapTop = new Group();

    for (let index = 0; index < 5; index += 1) {
      const stripe = new Mesh(
        new BoxGeometry(0.34, 0.18, 0.19),
        index % 2 === 0 ? frostMaterial : blackMaterial
      );
      stripe.position.x = -0.68 + index * 0.34;
      stripe.rotation.z = -0.36;
      clapTop.add(stripe);
    }

    clapTop.position.set(0, 0.56, 0.02);
    clapper.add(clapBody, clapTop);
    clapper.position.set(-1.85, 0.9, 0.62);
    clapper.rotation.set(-0.16, 0.34, -0.16);

    const lens = new Group();
    const lensOuter = new Mesh(new CylinderGeometry(0.62, 0.62, 0.42, 64), darkMetal);
    const lensGlass = new Mesh(
      new CylinderGeometry(0.46, 0.46, 0.045, 64),
      new MeshStandardMaterial({
        color: 0x0a1f38,
        emissive: 0x68a7ff,
        emissiveIntensity: 0.55,
        roughness: 0.18,
        metalness: 0.1
      })
    );
    const lensRing = new Mesh(new TorusGeometry(0.64, 0.025, 12, 64), amberGlow);

    lensOuter.rotation.x = Math.PI / 2;
    lensGlass.rotation.x = Math.PI / 2;
    lensGlass.position.z = 0.24;
    lensRing.position.z = 0.265;
    lens.add(lensOuter, lensGlass, lensRing);
    lens.position.set(1.8, 0.88, 0.74);
    lens.rotation.set(0.12, -0.52, 0.14);

    const timeline = new Group();
    timeline.position.set(0, -2.16, 0.48);
    timeline.rotation.x = -0.55;
    timeline.add(
      createClip({ width: 1.1, color: 0xff4d57, x: -1.48, y: 0.16, z: 0 }),
      createClip({ width: 1.55, color: 0x68a7ff, x: -0.15, y: 0.16, z: 0 }),
      createClip({ width: 0.95, color: 0xffb000, x: 1.18, y: 0.16, z: 0 }),
      createClip({ width: 1.78, color: 0x8d7cff, x: 0.32, y: -0.12, z: 0.18 })
    );

    const floatingPanels = [
      createPanel({
        color: 0x111923,
        emissive: 0x68a7ff,
        position: new Vector3(-2.65, -0.75, -0.25),
        rotation: new Euler(0.04, 0.5, -0.12),
        scale: 0.82
      }),
      createPanel({
        color: 0x191018,
        emissive: 0xff4d57,
        position: new Vector3(2.68, -0.62, -0.18),
        rotation: new Euler(-0.05, -0.54, 0.1),
        scale: 0.74
      }),
      createPanel({
        color: 0x15140d,
        emissive: 0xffb000,
        position: new Vector3(2.15, 1.75, -0.35),
        rotation: new Euler(0.1, -0.36, 0.18),
        scale: 0.58
      })
    ];

    model.add(blueBackplate, amberBackplate, monitor, clapper, lens, timeline, ...floatingPanels);
    model.rotation.set(-0.05, -0.32, 0.02);
    scene.add(model);

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      const safeWidth = Math.max(width, 1);
      const safeHeight = Math.max(height, 1);

      renderer.setSize(safeWidth, safeHeight, false);
      camera.aspect = safeWidth / safeHeight;
      camera.position.z = safeWidth < 640 ? 9.2 : 8.25;
      model.position.x = safeWidth < 640 ? 0.72 : 0.28;
      model.scale.setScalar(safeWidth < 640 ? 0.56 : 0.82);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const handlePointerMove = (event) => {
      const rect = host.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let animationFrame = 0;
    const render = () => {
      const elapsed = (performance.now() - startTime) / 1000;

      if (!prefersReducedMotion) {
        model.rotation.y += (-0.32 + pointer.x * 0.1 - model.rotation.y) * 0.04;
        model.rotation.x += (-0.05 - pointer.y * 0.05 - model.rotation.x) * 0.04;
        clapper.rotation.z = -0.16 + Math.sin(elapsed * 1.4) * 0.055;
        lens.rotation.z = elapsed * 0.38;
        timeline.position.y = -2.16 + Math.sin(elapsed * 1.2) * 0.045;
        floatingPanels.forEach((panel, index) => {
          panel.position.y += Math.sin(elapsed * 1.1 + index) * 0.0009;
          panel.rotation.z += Math.sin(elapsed * 0.7 + index) * 0.0006;
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
  }, []);

  return (
    <div
      ref={hostRef}
      className="pointer-events-none absolute top-[27rem] bottom-[8rem] right-[-74%] z-0 w-[172%] opacity-30 sm:right-[-52%] sm:w-[142%] sm:opacity-40 lg:inset-y-24 lg:right-[-5%] lg:w-[50%] lg:opacity-90 xl:right-[-3%]"
      aria-hidden="true"
    />
  );
};

export default Hero3DModel;
