import { getTextColor } from "@/utils/colorUtils";
import style from "./tag.module.css";

export default function Tag({ name, color, className }) {
    const textColor = getTextColor(color);

    return (
        <span className={`${style.tag} ${className}`} style={{ backgroundColor: color, color: textColor }}>
            {name}
        </span>
    );
}
