import { Input } from "@/components/ui/input";
import style from "./index.module.css";

export default function Location({ location, setLocation }) {
    const handleLatChange = (e) => {
        setLocation({ ...location, latitude: e.target.value });
    };

    const handleLngChange = (e) => {
        setLocation({ ...location, longitude: e.target.value });
    };

    return (
        <div className={style.container}>
            <h2>緯度・経度</h2>
            <div className={style.inputContainer}>
                <p>緯度</p>
                <Input type="number" value={location.latitude} onChange={handleLatChange} />
            </div>
            <div className={style.inputContainer}>
                <p>経度</p>
                <Input type="number" value={location.longitude} onChange={handleLngChange} />
            </div>
        </div>
    );
}
