
import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './App.css';

import { Environment, useGLTF } from '@react-three/drei';

export default function AnimationCanvas() {
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const prevScrollY = useRef(window.scrollY);
  const scrollTimeout = useRef<any | null>(null);

  useEffect(() => {
      const handleScroll = () => {
          const currentScrollY = window.scrollY;
          const scrollDelta = currentScrollY - prevScrollY.current;

          // 스크롤 속도 설정 (스크롤 멈추면 0으로 설정)
          const speed = THREE.MathUtils.clamp(Math.abs(scrollDelta) / 50, 0, 2);
          setScrollSpeed(scrollDelta > 0 ? speed : -speed);

          prevScrollY.current = currentScrollY;

          // 스크롤이 멈추면 애니메이션 속도를 0으로 설정
          if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
          scrollTimeout.current = setTimeout(() => {
              setScrollSpeed(0);
          }, 100); // 100ms 후 스크롤 멈추면 속도 0
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
      <>
          {/* ✅ 스크롤 가능하도록 부모 컨테이너 설정 */}
          <div style={{ height: '2000vh', overflowY: 'scroll', position: 'relative' }}>
              <Canvas
                  style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
                  dpr={[1, 2]}
                  camera={{ position: [0, 0, 300], fov: 50 }}
              >
                  <color attach={'background'} args={['white']} />
                  <OrbitControls enableZoom={false} />
                  <Scene scrollSpeed={scrollSpeed} />
              </Canvas>
          </div>
      </>
  );
}

function Scene({ scrollSpeed }: { scrollSpeed: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
      if (ref.current) {
          // ✅ 중앙 정렬: 스크롤 진행도에 따라 Y축 이동
          const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
          ref.current.position.y = (1 - scrollProgress) * 50 - 25;

          // ✅ 애니메이션 속도 반영
          if (ref.current.userData.action) {
              ref.current.userData.action.setEffectiveTimeScale(scrollSpeed);
          }
      }
  });

  return (
      <group ref={ref} position={[0, 0, 0]}>
          <Animation />
      </group>
  );
}

function Animation() {
  const { scene, animations } = useGLTF('/all.glb');
  // const { scene, animations } = useGLTF('/Bell_motion.glb');
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const prevScrollY = useRef(window.scrollY);

  useEffect(() => {
    console.log('hazel animations', animations);
      if (animations.length > 0) {
          mixerRef.current = new THREE.AnimationMixer(scene);

          // ✅ 첫 번째 애니메이션만 실행
          actionRef.current = mixerRef.current.clipAction(animations[2]); // 2, 3 사용 가능함다
          actionRef.current.play();
          actionRef.current.setEffectiveTimeScale(0); // 처음에는 정지
      }

      // ✅ 스크롤 이벤트 감지
      const handleScroll = () => {
          const currentScrollY = window.scrollY;
          const scrollDelta = currentScrollY - prevScrollY.current;

          // 스크롤 속도를 설정 (0 ~ 2 범위 내에서 조정)
          const speed = THREE.MathUtils.clamp(Math.abs(scrollDelta) / 50, 0, 2);

          // 스크롤 방향에 따라 애니메이션 방향 설정
          setScrollSpeed(scrollDelta > 0 ? speed : -speed);

          prevScrollY.current = currentScrollY;
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, [animations, scene]);

  // ✅ 애니메이션 속도를 실시간 업데이트
  useFrame((_, delta) => {
      if (mixerRef.current && actionRef.current) {
          actionRef.current.setEffectiveTimeScale(scrollSpeed); // 스크롤 속도 반영
          mixerRef.current.update(delta);
      }
  });

  return (
      <>
          <primitive object={scene} />
          <Environment background files="/old_depot_2k.hdr" blur={0.3} backgroundIntensity={1.5} resolution={256}  />
      </>
  );
}

