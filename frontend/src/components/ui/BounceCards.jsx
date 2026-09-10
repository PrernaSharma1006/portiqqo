import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import './BounceCards.css';

export default function BounceCards({
  className = '',
  cards = [],
  containerWidth = 1000,
  containerHeight = 400,
  cardWidth = 260,
  cardHeight = 340,
  animationDelay = 0.2,
  animationStagger = 0.08,
  easeType = 'elastic.out(1, 0.75)',
  transformStyles = [
    'rotate(-10deg) translate(-270px, 15px)',
    'rotate(-5deg) translate(-135px, -5px)',
    'rotate(0deg) translate(0px, 0px)',
    'rotate(5deg) translate(135px, -5px)',
    'rotate(10deg) translate(270px, 15px)'
  ],
  enableHover = true,
  onCardClick = () => {}
}) {
  const containerRef = useRef(null);

  // Parse transform string into exact numeric { rotation, x, y } values for native GSAP transform performance
  const parsedTransforms = useMemo(() => {
    return cards.map((_, idx) => {
      const str = transformStyles[idx] || '';
      const rotMatch = str.match(/rotate\(([-0-9.]+)deg\)/);
      const transMatch = str.match(/translate\(([-0-9.]+)px(?:,\s*([-0-9.]+)px)?\)/);

      return {
        rotation: rotMatch ? parseFloat(rotMatch[1]) : 0,
        x: transMatch ? parseFloat(transMatch[1]) : 0,
        y: transMatch && transMatch[2] ? parseFloat(transMatch[2]) : 0
      };
    });
  }, [cards, transformStyles]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      cards.forEach((_, i) => {
        const target = `.bounce-card-${i}`;
        const base = parsedTransforms[i] || { rotation: 0, x: 0, y: 0 };

        gsap.set(target, {
          x: base.x,
          y: base.y,
          rotation: base.rotation,
          scale: 0,
          opacity: 0,
          transformOrigin: 'center center'
        });

        gsap.to(target, {
          scale: 1,
          opacity: 1,
          delay: animationDelay + i * animationStagger,
          duration: 1,
          ease: easeType
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [cards, parsedTransforms, animationDelay, animationStagger, easeType]);

  const pushSiblings = (hoveredIdx) => {
    if (!enableHover || !containerRef.current) return;

    const q = gsap.utils.selector(containerRef);

    cards.forEach((_, i) => {
      const target = q(`.bounce-card-${i}`);
      if (!target || !target[0]) return;
      
      gsap.killTweensOf(target);
      const base = parsedTransforms[i] || { rotation: 0, x: 0, y: 0 };

      if (i === hoveredIdx) {
        gsap.to(target, {
          x: base.x,
          y: base.y - 12,
          rotation: 0,
          scale: 1.05,
          opacity: 1,
          zIndex: 50,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      } else {
        const offsetX = i < hoveredIdx ? -130 : 130;
        gsap.to(target, {
          x: base.x + offsetX,
          y: base.y,
          rotation: base.rotation,
          scale: 0.94,
          opacity: 1,
          zIndex: 10 + i,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    });
  };

  const resetSiblings = () => {
    if (!enableHover || !containerRef.current) return;

    const q = gsap.utils.selector(containerRef);

    cards.forEach((_, i) => {
      const target = q(`.bounce-card-${i}`);
      if (!target || !target[0]) return;

      gsap.killTweensOf(target);
      const base = parsedTransforms[i] || { rotation: 0, x: 0, y: 0 };

      gsap.to(target, {
        x: base.x,
        y: base.y,
        rotation: base.rotation,
        scale: 1,
        opacity: 1,
        zIndex: i + 1,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });
  };

  return (
    <div
      className={`bounceCardsContainer relative flex justify-center items-center mx-auto ${className}`}
      ref={containerRef}
      style={{
        maxWidth: '100%',
        width: typeof containerWidth === 'number' ? `${containerWidth}px` : containerWidth,
        height: typeof containerHeight === 'number' ? `${containerHeight}px` : containerHeight
      }}
    >
      {cards.map((item, idx) => (
        <div
          key={idx}
          className={`bounce-card bounce-card-${idx} absolute rounded-3xl overflow-hidden cursor-pointer shadow-xl border border-[#e6ccb2] dark:border-stone-800 bg-[#fdfbf7] dark:bg-[#1a1816]`}
          style={{
            width: typeof cardWidth === 'number' ? `${cardWidth}px` : cardWidth,
            height: typeof cardHeight === 'number' ? `${cardHeight}px` : cardHeight,
            zIndex: idx + 1
          }}
          onMouseEnter={() => pushSiblings(idx)}
          onMouseLeave={resetSiblings}
          onClick={() => onCardClick(item, idx)}
        >
          {item.content ? (
            item.content
          ) : (
            <img className="w-full h-full object-cover" src={item.image || item} alt={`card-${idx}`} />
          )}
        </div>
      ))}
    </div>
  );
}
