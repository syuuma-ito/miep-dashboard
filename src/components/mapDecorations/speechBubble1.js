import { getTextColor } from "@/utils/colorUtils";
import { useEffect, useRef } from "react";
import style from "./speechBubble1.module.css";

export default function SpeechBubble1({ text, bgColor = "#fff", arrowPosition = "right", onClick, preview, size = 1 }) {
    const textColor = getTextColor(bgColor);
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
            <div ref={containerRef} className={style.container}>
                <div
                    className={`${style.speech_bubble} ${style[arrowPosition]} ${preview ? style.preview : ""}`}
                    style={{ "--SpeechBubble1-background": bgColor, "--SpeechBubble1-color": textColor }}
                    onClick={onClick}
                >
                    <span>{text}</span>
                </div>
            </div>
        </div>
    );
}
