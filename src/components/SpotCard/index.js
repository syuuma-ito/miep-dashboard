import Tag from "@/components/Tag";
import { memo } from "react";
import style from "./SpotCard.module.css";

const SpotCard = ({ spot }) => {
    return (
        <div className={style.spot_card}>
            <img src={spot.icon} alt={spot.name} className={style.icon} />
            <div className={style.spot_info}>
                <h3 className={style.spot_name}>{spot.name}</h3>
                {spot.tags && spot.tags.length > 0 && (
                    <div className={style.tags}>
                        {spot.tags.map((tag, index) => (
                            <Tag key={index} name={tag.name} color={tag.color} className={style.tag} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(SpotCard);
