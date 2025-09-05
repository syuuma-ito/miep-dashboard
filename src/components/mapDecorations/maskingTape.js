import { useEffect, useRef } from "react";
import style from "./maskingTape.module.css";

export default function MaskingTape({ text, onClick, preview, size = 1 }) {
    const containerRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        function scheduleShake() {
            const delay = 2000 + Math.random() * 5000;
            timeoutRef.current = setTimeout(() => {
                const el = containerRef.current;
                if (!el) return;
                el.classList.add(style.shake);
                setTimeout(() => el.classList.remove(style.shake), 800);
                scheduleShake();
            }, delay);
        }

        scheduleShake();

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    if (!text) return null;

    return (
        <div style={{ transform: `scale(${size})` }}>
            <div className={style.container} ref={containerRef}>
                <div className={`${style.maskingTape} ${preview ? style.preview : ""}`} onClick={onClick}>
                    <div className={style.text}>{text}</div>
                    <span className={style.ornament}></span>
                </div>
            </div>
        </div>
    );
}
