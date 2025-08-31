"use client";

import ImageSlider from "@/components/ImageSlider";
import SpotCard from "@/components/SpotCard";
import Tag from "@/components/Tag";
import { getStaticTranslations } from "@/i18n";
import Link from "next/link";
import { memo } from "react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { TbWorld } from "react-icons/tb";
import style from "./spotDetail.module.css";

const SpotDetail = ({ spot, lang }) => {
    const { t } = getStaticTranslations(lang);

    return (
        <div className={style.spot_detail}>
            {spot.images && <ImageSlider images={spot.images} alt={spot.name || ""} />}
            <div className={style.spot_info_container}>
                <h2 className={style.spot_name}>{spot.name}</h2>

                {spot.tags && spot.tags.length > 0 && (
                    <div className={style.tags}>
                        {spot.tags.map((tag, index) => (
                            <Tag key={index} name={tag.name} color={tag.color} />
                        ))}
                    </div>
                )}

                {spot.description && <p className={style.spot_description}>{spot.description}</p>}

                {spot.recommended_for && (
                    <div className={style.recommended_for}>
                        <div className={style.recommended_for_label}>{t("spotDetail.recommendedFor")}</div>
                        <p className={style.recommended_for_description}>{spot.recommended_for}</p>
                    </div>
                )}

                {Array.isArray(spot.info) && spot.info.length > 0 && (
                    <div className={style.info}>
                        {spot.info
                            .slice()
                            .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
                            .map((item, index) => (
                                <div key={index} className={style.info_item}>
                                    <p className={style.info_label}>▸ {item.key} :</p>
                                    <p className={style.info_value}>{item.value}</p>
                                </div>
                            ))}
                    </div>
                )}

                {spot.nearby_recommendations && spot.nearby_recommendations.length > 0 && (
                    <div className={style.nearby_recommendations}>
                        <h3 className={style.nearby_recommendations_title}>{t("spotDetail.nearbyRecommendations")}</h3>
                        <ul>
                            {spot.nearby_recommendations.map((spot, index) => (
                                <li key={index} className={style.nearby_recommendation_item} onClick={() => setActiveSpotById(spot.id)}>
                                    <SpotCard spot={spot} />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {spot.sns_links && Object.keys(spot.sns_links).length > 0 && (
                    <div className={style.links}>
                        <h3 className={style.links_title}>{t("spotDetail.links")}</h3>
                        {spot.sns_links && (
                            <div className={style.sns_links}>
                                {spot.sns_links.website && (
                                    <Link href={spot.sns_links.website} target="_blank" rel="noopener noreferrer" className={style.sns_link}>
                                        <TbWorld className={style.sns_icon} />
                                        {t("spotDetail.officialSite")}
                                    </Link>
                                )}
                                {spot.sns_links.twitter && (
                                    <Link href={spot.sns_links.twitter} target="_blank" rel="noopener noreferrer" className={style.sns_link}>
                                        <FaXTwitter className={style.sns_icon} />
                                        {t("spotDetail.twitter")}
                                    </Link>
                                )}
                                {spot.sns_links.x && (
                                    <Link href={spot.sns_links.x} target="_blank" rel="noopener noreferrer" className={style.sns_link}>
                                        <FaXTwitter className={style.sns_icon} />
                                        {t("spotDetail.x")}
                                    </Link>
                                )}
                                {spot.sns_links.instagram && (
                                    <Link href={spot.sns_links.instagram} target="_blank" rel="noopener noreferrer" className={style.sns_link}>
                                        <FaInstagram className={style.sns_icon} />
                                        {t("spotDetail.instagram")}
                                    </Link>
                                )}
                                {spot.sns_links.youtube && (
                                    <Link href={spot.sns_links.youtube} target="_blank" rel="noopener noreferrer" className={style.sns_link}>
                                        <FaYoutube className={style.sns_icon} />
                                        {t("spotDetail.youtube")}
                                    </Link>
                                )}
                                {spot.sns_links.facebook && (
                                    <Link href={spot.sns_links.facebook} target="_blank" rel="noopener noreferrer" className={style.sns_link}>
                                        <FaFacebook className={style.sns_icon} />
                                        {t("spotDetail.facebook")}
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(SpotDetail);
