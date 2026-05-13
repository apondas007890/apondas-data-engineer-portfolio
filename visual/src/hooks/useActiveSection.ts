import { useEffect, useState } from 'react';

export function useActiveSection(sectionIds: string[], offset = 140) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!elements.length) return;

    let ticking = false;

    const computeActive = () => {
      ticking = false;

      const firstSection = elements[0];
      if (firstSection) {
        const firstTop = firstSection.getBoundingClientRect().top;
        if (firstTop - offset > 0) {
          setActiveSection(null);
          return;
        }
      }

      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      if (nearBottom) {
        setActiveSection(sectionIds[sectionIds.length - 1]);
        return;
      }

      let current = sectionIds[0];
      let bestDistance = Number.POSITIVE_INFINITY;

      for (const element of elements) {
        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top - offset);

        if (rect.top - offset <= 0) {
          current = element.id;
          bestDistance = distance;
        } else if (bestDistance === Number.POSITIVE_INFINITY && distance < bestDistance) {
          current = element.id;
          bestDistance = distance;
        }
      }

      setActiveSection(current);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(computeActive);
      }
    };

    const observer = new IntersectionObserver(
      () => {
        computeActive();
      },
      {
        root: null,
        rootMargin: `-${offset}px 0px -45% 0px`,
        threshold: [0, 0.12, 0.25, 0.4, 0.6],
      },
    );

    elements.forEach((element) => observer.observe(element));
    computeActive();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', computeActive);
    window.addEventListener('hashchange', computeActive);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', computeActive);
      window.removeEventListener('hashchange', computeActive);
    };
  }, [sectionIds, offset]);

  return activeSection;
}
