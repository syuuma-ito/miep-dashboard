import { Input } from "@/components/ui/input";
import style from "./index.module.css";

import { memo } from "react";

const Location = ({ latitude, setLatitude, longitude, setLongitude }) => {
    return (
        <div className={style.container}>
            <h2>緯度・経度</h2>
            <div className={style.inputContainer}>
                <p>緯度</p>
                <Input type="number" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
            </div>
            <div className={style.inputContainer}>
                <p>経度</p>
                <Input type="number" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
            </div>
        </div>
    );
};

export default memo(Location);
