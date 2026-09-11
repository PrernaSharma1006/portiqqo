import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './StrokeText.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const DEFAULT_TEXT = 'Draw Attention';

const StrokeText = ({
  text = DEFAULT_TEXT,
  strokeColor = '#A78BFA',
  fillColor = '#F8FAFC',
  strokeWidth = 1.4,
  drawDuration = 1.6,
  fillDelay = 0.2,
  stagger = 0.05,
  ease = 'power2.out',
  trigger = 'mount',
  repeatDelay = 3,
  fillMode = 'wipe',
  fontSize = 128,
  fontWeight = 800,
  letterSpacing = -4,
  reverse = false,
  className = '',
  style = {}
}) => {
  const rootRef = useRef(null);
  const strokeTextRef = useRef(null);
  const wipeRectRef = useRef(null);

  const rawId = useId();
  const wipeId = `stroke-text-wipe-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const characters = useMemo(() => Array.from(String(text ?? '')), [text]);

  const defaultBox = useMemo(() => {
    const estimatedWidth = Math.max(characters.length * fontSize * 0.7, 350);
    return {
      x: -30,
      y: -fontSize * 0.95,
      width: estimatedWidth + 50,
      height: fontSize * 1.35
    };
  }, [characters, fontSize]);

  const [box, setBox] = useState(defaultBox);

  const dash = Math.max(fontSize * 7, 300);

  const fontStyle = useMemo(
    () => ({
      fontFamily: "'Plus Jakarta Sans', 'Outfit', 'Poppins', 'Inter', sans-serif",
      fontSize: `${fontSize}px`,
      fontWeight: fontWeight || 900,
      letterSpacing: letterSpacing !== undefined ? `${letterSpacing}px` : 'normal'
    }),
    [fontSize, fontWeight, letterSpacing]
  );

  useLayoutEffect(() => {
    const node = strokeTextRef.current;
    if (!node) return undefined;

    let cancelled = false;

    const measure = () => {
      if (cancelled || !strokeTextRef.current) return;
      let bbox;
      try {
        bbox = strokeTextRef.current.getBBox();
      } catch {
        return;
      }
      if (!bbox || !bbox.width) return;

      const padL = 30;
      const padR = 20;
      const padY = 15;
      const next = {
        x: bbox.x - padL,
        y: bbox.y - padY,
        width: bbox.width + padL + padR,
        height: bbox.height + padY * 2
      };

      setBox(prev =>
        prev &&
        Math.abs(prev.x - next.x) < 0.5 &&
        Math.abs(prev.width - next.width) < 0.5 &&
        Math.abs(prev.y - next.y) < 0.5
          ? prev
          : next
      );
    };

    measure();
    const timer = setTimeout(measure, 100);
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [characters, fontSize, fontWeight, letterSpacing, strokeWidth]);

  useEffect(() => {
    const root = rootRef.current;
    const currentBox = box || defaultBox;
    if (typeof window === 'undefined' || !root || !currentBox) return undefined;

    const strokes = gsap.utils.toArray(root.querySelectorAll('[data-stroke-char]'));
    const fills = gsap.utils.toArray(root.querySelectorAll('[data-fill-char]'));
    const wipe = wipeRectRef.current;
    if (!strokes.length) return undefined;

    const fillEnabled = fillMode !== 'none';
    const useWipe = fillEnabled && fillMode === 'wipe';
    const fillDuration = Math.max(0.5, drawDuration * 0.6);
    const staggerConfig = reverse ? { each: stagger, from: 'end' } : stagger;
    const targets = [...strokes, ...fills, wipe].filter(Boolean);

    const setStart = () => {
      gsap.killTweensOf(targets);
      gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: dash });
      gsap.set(fills, { opacity: useWipe ? 1 : 0 });
      if (wipe) {
        wipe.setAttribute('width', '0');
        gsap.set(wipe, { attr: { width: 0 } });
      }
    };

    const setEnd = () => {
      gsap.killTweensOf(targets);
      gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: 0 });
      gsap.set(fills, { opacity: fillEnabled ? 1 : 0 });
      if (wipe) {
        wipe.setAttribute('width', String(currentBox.width));
        gsap.set(wipe, { attr: { width: currentBox.width } });
      }
    };

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setEnd();
      return () => gsap.killTweensOf(targets);
    }

    const build = () => {
      setStart();
      const tl = gsap.timeline({
        paused: true,
        repeat: trigger === 'loop' ? -1 : 0,
        repeatDelay: repeatDelay,
        onRepeat: () => {
          setStart();
        },
        defaults: { overwrite: 'auto' }
      });

      tl.to(strokes, { strokeDashoffset: 0, duration: drawDuration, ease, stagger: staggerConfig }, 0);

      if (useWipe && wipe) {
        tl.to(
          wipe,
          {
            attr: { width: currentBox.width },
            duration: fillDuration,
            ease: 'power2.inOut',
            onUpdate: function () {
              const progress = this.progress();
              if (wipe) {
                wipe.setAttribute('width', String(currentBox.width * progress));
              }
            }
          },
          drawDuration + fillDelay
        );
        tl.to(
          fills,
          { opacity: 1, duration: fillDuration * 0.5, ease: 'power2.out' },
          drawDuration + fillDelay
        );
      } else if (fillEnabled) {
        tl.to(
          fills,
          { opacity: 1, duration: fillDuration, ease: 'power2.out', stagger: staggerConfig },
          drawDuration + fillDelay
        );
      }

      return tl;
    };

    let timeline = null;
    let scrollTrigger = null;
    let removeHover = null;

    if (trigger === 'hover') {
      setEnd();
      const play = () => {
        timeline?.kill();
        timeline = build();
        timeline.play(0);
      };
      root.addEventListener('pointerenter', play);
      removeHover = () => root.removeEventListener('pointerenter', play);
    } else {
      timeline = build();
      if (trigger === 'scroll') {
        scrollTrigger = ScrollTrigger.create({
          trigger: root,
          start: 'top 82%',
          once: true,
          onEnter: () => timeline?.play(0)
        });
      } else {
        timeline.play(0);
      }
    }

    return () => {
      removeHover?.();
      scrollTrigger?.kill();
      timeline?.kill();
      gsap.killTweensOf(targets);
    };
  }, [box, defaultBox, dash, drawDuration, fillDelay, stagger, ease, trigger, fillMode, reverse, repeatDelay]);

  const activeBox = box || defaultBox;
  const viewBox = `${activeBox.x} ${activeBox.y} ${activeBox.width} ${activeBox.height}`;
  const svgHeight = `${(activeBox.height / fontSize)}em`;

  return (
    <span
      ref={rootRef}
      className={`stroke-text ${trigger === 'hover' ? 'stroke-text--hover' : ''} ${className}`.trim()}
      style={{ display: 'inline-block', verticalAlign: 'baseline', lineHeight: 1, ...style }}
      role="img"
      aria-label={String(text ?? '')}
    >
      <svg 
        className="stroke-text__svg" 
        viewBox={viewBox} 
        style={{ height: svgHeight, width: 'auto', overflow: 'visible' }}
        preserveAspectRatio="xMinYMid meet" 
        aria-hidden="true"
      >
        {fillMode === 'wipe' && activeBox && (
          <defs>
            <clipPath id={wipeId} clipPathUnits="userSpaceOnUse">
              <rect ref={wipeRectRef} x={activeBox.x} y={activeBox.y} width="0" height={activeBox.height} />
            </clipPath>
          </defs>
        )}

        <text
          ref={strokeTextRef}
          className="stroke-text__stroke"
          x="0"
          y="0"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          style={fontStyle}
        >
          {characters.map((char, index) => (
            <tspan data-stroke-char key={`s-${index}`}>
              {char}
            </tspan>
          ))}
        </text>

        <text
          className="stroke-text__fill"
          x="0"
          y="0"
          fill={fillColor}
          stroke="none"
          style={fontStyle}
          clipPath={fillMode === 'wipe' && activeBox ? `url(#${wipeId})` : undefined}
        >
          {characters.map((char, index) => (
            <tspan data-fill-char key={`f-${index}`}>
              {char}
            </tspan>
          ))}
        </text>
      </svg>
    </span>
  );

};

export default StrokeText;
