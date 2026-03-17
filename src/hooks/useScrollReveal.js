import { useEffect, useRef, useState } from 'react';

const useScrollReveal = (threshold = 0.1) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // ছোট delay দিয়ে check করো — element already viewport এ থাকলেও কাজ করবে
        const timer = setTimeout(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        observer.disconnect();
                    }
                },
                { threshold, rootMargin: '0px 0px -50px 0px' }
            );
            if (ref.current) observer.observe(ref.current);
        }, 100);

        return () => clearTimeout(timer);
    }, [threshold]);

    return [ref, visible];
};

export default useScrollReveal;