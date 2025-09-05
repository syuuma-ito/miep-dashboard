"use client";

import SpotCard from "@/components/SpotCard";
import Tag from "@/components/Tag";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getAllMapDecorations } from "@/lib/supabase/getAllMapDecorations";
import { getAllSpotsByLang } from "@/lib/supabase/getAllSpots";
import { getAllTagsByLang } from "@/lib/supabase/getAllTags";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import style from "./page.module.css";

export default function Home({ params }) {
    const router = useRouter();

    const { user, loading } = useAuth();
    const [touristSpots, setTouristSpots] = useState([]);
    const [tags, setTags] = useState([]);
    const [mapDecorations, setMapDecorations] = useState([]);

    useEffect(() => {
        const fetchTags = async () => {
            const tags = await getAllTagsByLang("ja");
            setTags(tags);
        };

        fetchTags();
    }, []);

    useEffect(() => {
        const fetchTouristSpots = async () => {
            const spots = await getAllSpotsByLang("ja");
            setTouristSpots(spots);
        };

        fetchTouristSpots();
    }, []);

    useEffect(() => {
        const fetchMapDecorations = async () => {
            const decorations = await getAllMapDecorations("ja");
            setMapDecorations(decorations);
        };

        fetchMapDecorations();
    }, []);

    if (loading) {
        return <div>ロード中...</div>;
    }

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="container mx-auto p-4 flex">
            <div className={style.spotContainer}>
                <div className={style.header}>
                    <h1>観光地一覧</h1>
                    <Button onClick={() => router.push("/tourist-spots/new")} className="cursor-pointer">
                        新規作成
                    </Button>
                </div>
                <p>観光地の総数: {touristSpots.length}件</p>
                <p>クリックして詳細ページへ</p>
                <div className="overflow-y-auto space-y-2" style={{ maxHeight: "80vh" }}>
                    {touristSpots.map((spot) => (
                        <Link key={spot.id} href={`/tourist-spots?id=${spot.id}`}>
                            <SpotCard spot={spot} />
                        </Link>
                    ))}
                </div>
            </div>
            <div className={style.tagContainer}>
                <div className={style.header}>
                    <h1>タグ一覧</h1>
                    <Button onClick={() => router.push("/tags/")} className="cursor-pointer">
                        タグ管理へ
                    </Button>
                </div>
                <p>タグの総数: {tags.length}件</p>
                <div className={style.tags}>
                    {tags.map((tag) => (
                        <Tag key={tag.id} name={tag.name} color={tag.color} />
                    ))}
                </div>
                <div className={style.spacer} />

                <div className={style.header}>
                    <h1>装飾マーカー</h1>
                    <Button onClick={() => router.push("/decorations/")} className="cursor-pointer">
                        管理へ
                    </Button>
                </div>
                <p>装飾マーカーの総数: {mapDecorations.length}件</p>
            </div>
        </div>
    );
}
