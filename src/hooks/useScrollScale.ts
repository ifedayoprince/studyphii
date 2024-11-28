import { useEffect, useState } from 'react';

export function useScrollScale(initialScale: number = 0.8, maxScale: number = 1) {
    const [scale, setScale] = useState(initialScale);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            
            // Calculate scale based on scroll position
            const newScale = Math.min(
                maxScale,
                initialScale + (scrollPosition / windowHeight) * (maxScale - initialScale)
            );
            
            setScale(newScale);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [initialScale, maxScale]);

    return scale;
} 