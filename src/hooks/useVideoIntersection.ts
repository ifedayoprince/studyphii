import { useEffect, useRef, useState } from 'react';

export function useVideoIntersection(threshold: number = 0.7) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsInView(entry.isIntersecting);
                    if (entry.isIntersecting && videoRef.current) {
                        videoRef.current.play().catch(() => {
                            // Handle any autoplay restrictions
                            console.log('Autoplay prevented');
                        });
                    } else if (videoRef.current) {
                        videoRef.current.pause();
                    }
                });
            },
            {
                threshold: threshold
            }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, [threshold]);

    return { videoRef, isInView };
} 