import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { CheckCircle2 } from 'lucide-react';

export default function Cube3DCard({ feature }) {
  const cardRef = useRef(null);
  const cubeRef = useRef(null);
  const rotationRef = useRef({ flip: 0, tiltX: 0, tiltY: 0 });
  const isFlippedRef = useRef(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== 'undefined' && (window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const cardDepth = 220; // 3D depth of the cube in pixels
  const PARALLAX_STRENGTH = 35;

  const render = () => {
    if (!cubeRef.current) return;
    const { flip, tiltX, tiltY } = rotationRef.current;
    gsap.set(cubeRef.current, {
      rotationX: flip + tiltX,
      rotationY: tiltY,
      z: -cardDepth / 2,
    });
  };

  const handleMouseEnter = () => {
    isFlippedRef.current = false;
    gsap.to(rotationRef.current, {
      flip: 180,
      duration: 0.55,
      ease: 'power2.inOut',
      overwrite: 'flip',
      onUpdate: render,
      onComplete: () => {
        isFlippedRef.current = true;
      },
    });
  };

  const handleMouseLeave = () => {
    isFlippedRef.current = false;
    gsap.to(rotationRef.current, {
      flip: 0,
      tiltX: 0,
      tiltY: 0,
      duration: 0.6,
      ease: 'power3.out',
      overwrite: true,
      onUpdate: render,
    });
  };

  const handleMouseMove = (e) => {
    if (!isFlippedRef.current || !cubeRef.current) return;
    const bounds = cubeRef.current.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;

    const offsetX = (e.clientX - centerX) / bounds.width;
    const offsetY = (e.clientY - centerY) / bounds.height;

    gsap.to(rotationRef.current, {
      tiltY: offsetX * PARALLAX_STRENGTH,
      tiltX: -offsetY * PARALLAX_STRENGTH,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'tilt',
      onUpdate: render,
    });
  };

  const handleTouchToggle = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return; // Static on mobile view for easy swiping
    }
    const targetFlip = rotationRef.current.flip === 0 ? 180 : 0;
    gsap.to(rotationRef.current, {
      flip: targetFlip,
      tiltX: 0,
      tiltY: 0,
      duration: 0.55,
      ease: 'power2.inOut',
      overwrite: true,
      onUpdate: render,
      onComplete: () => {
        isFlippedRef.current = targetFlip === 180;
      },
    });
  };

  if (isMobile) {
    return (
      <div 
        className="w-full h-[340px] bg-[#fdfbf7] dark:bg-stone-900/95 rounded-3xl p-7 flex flex-col justify-between border border-[#e6ccb2] dark:border-stone-800 shadow-md overflow-hidden"
        style={{ touchAction: 'pan-y' }}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className={`w-14 h-14 rounded-2xl ${feature.iconBg} border flex items-center justify-center shadow-sm`}>
              {feature.icon}
            </div>

            {feature.badge && (
              <span className="text-[11px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider bg-[#f5ebe0] dark:bg-stone-800 text-stone-900 dark:text-pink-300 border border-[#e6ccb2] dark:border-stone-700 shadow-sm">
                {feature.badge}
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mb-3 tracking-tight">
            {feature.title}
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className="card-3d-perspective w-full h-[370px] select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={handleTouchToggle}
    >
      <div
        ref={cubeRef}
        className="cube-3d relative w-full h-full cursor-pointer transition-shadow"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRONT FACE */}
        <div
          className={`face-3d face-3d-front absolute inset-0 bg-[#fdfbf7] dark:bg-stone-900/95 rounded-3xl p-7 flex flex-col justify-between border border-[#e6ccb2] dark:border-stone-800 shadow-md dark:shadow-stone-950/50 overflow-hidden group`}
          style={{
            transform: `translateZ(${cardDepth / 2}px)`,
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Ambient Glow */}
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-40 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none`} />

          <div className="relative z-10">
            {/* Header Icon + Badge */}
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl ${feature.iconBg} border flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              {feature.badge && (
                <span className="text-[11px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider bg-[#f5ebe0] dark:bg-stone-800 text-stone-900 dark:text-pink-300 border border-[#e6ccb2] dark:border-stone-700 shadow-sm">
                  {feature.badge}
                </span>
              )}
            </div>

            {/* Title & Description */}
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mb-3 tracking-tight group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors">
              {feature.title}
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>

        {/* BACK FACE */}
        <div
          className={`face-3d face-3d-back absolute inset-0 bg-[#1c1917] text-stone-100 rounded-3xl p-7 flex flex-col justify-between border ${feature.borderColor} shadow-2xl overflow-hidden`}
          style={{
            transform: `rotateX(180deg) translateZ(${cardDepth / 2}px)`,
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Ambient Glow Back */}
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-50 pointer-events-none`} />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${feature.iconBg} border flex items-center justify-center`}>
                {feature.icon}
              </div>
              <span className="text-[11px] font-mono text-pink-300 bg-stone-900 px-3 py-1 rounded-full border border-pink-500/30">
                3D INSPECTOR
              </span>
            </div>

            <h4 className="text-lg font-extrabold text-white mb-1">
              {feature.title}
            </h4>
            <p className="text-xs text-pink-300 mb-4 font-medium">
              {feature.backTagline || 'Feature Highlights'}
            </p>

            <ul className="space-y-2.5">
              {feature.backDetails?.map((detail, idx) => (
                <li key={idx} className="flex items-start text-xs text-stone-300 leading-snug">
                  <CheckCircle2 className="w-4 h-4 text-pink-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3D SIDE FACES FOR SOLID CUBE EFFECT - hidden on small mobile to prevent layout overflow */}
        {/* Right Face */}
        <div
          className={`face-3d face-3d-right hidden sm:block absolute top-0 rounded-2xl ${feature.sideColor || 'bg-[#f472b6] dark:bg-pink-600'} border border-pink-400/60 backdrop-blur-md`}
          style={{
            width: `${cardDepth}px`,
            height: '100%',
            left: `calc((100% - ${cardDepth}px) / 2)`,
            transform: `rotateY(90deg) translateZ(180px)`,
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Left Face */}
        <div
          className={`face-3d face-3d-left hidden sm:block absolute top-0 rounded-2xl ${feature.sideColor || 'bg-[#f472b6] dark:bg-pink-600'} border border-pink-400/60 backdrop-blur-md`}
          style={{
            width: `${cardDepth}px`,
            height: '100%',
            left: `calc((100% - ${cardDepth}px) / 2)`,
            transform: `rotateY(-90deg) translateZ(180px)`,
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Top Face */}
        <div
          className={`face-3d face-3d-top hidden sm:block absolute left-0 rounded-2xl ${feature.topColor || 'bg-[#f472b6]/90 dark:bg-pink-500/90'} border border-pink-400/60 backdrop-blur-md`}
          style={{
            width: '100%',
            height: `${cardDepth}px`,
            top: `calc((370px - ${cardDepth}px) / 2)`,
            transform: `rotateX(90deg) translateZ(185px)`,
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Bottom Face */}
        <div
          className={`face-3d face-3d-bottom hidden sm:block absolute left-0 rounded-2xl ${feature.topColor || 'bg-[#f472b6]/90 dark:bg-pink-500/90'} border border-pink-400/60 backdrop-blur-md`}
          style={{
            width: '100%',
            height: `${cardDepth}px`,
            top: `calc((370px - ${cardDepth}px) / 2)`,
            transform: `rotateX(-90deg) translateZ(185px)`,
            backfaceVisibility: 'hidden',
          }}
        />
      </div>
    </div>
  );
}
