"use client";

import SpotCard from "@/components/SpotCard";
import Tag from "@/components/Tag";
import { useAuth } from "@/contexts/AuthContext";
import { getAllSpotsByLang } from "@/lib/supabase/getAllSpots";
import { getAllTagsByLang } from "@/lib/supabase/getAllTags";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home({ params }) {
    const { supabase, user, loading } = useAuth();
    const [touristSpots, setTouristSpots] = useState([]);
    const [tags, setTags] = useState([]);

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

    if (loading) {
        return <div>ロード中...</div>;
    }

    if (!user) {
        redirect("/login");
    }

    return (
        <>
            <div className="w-1/2">
                <h1>観光地一覧</h1>
                {touristSpots.map((spot) => (
                    <Link key={spot.id} href={`/tourist-spots?id=${spot.id}`}>
                        <SpotCard spot={spot} />
                    </Link>
                ))}
            </div>
            <div className="w-1/2">
                <h1>タグ一覧</h1>
                {tags.map((tag) => (
                    <Tag key={tag.id} name={tag.name} color={tag.color} />
                ))}
            </div>
        </>
    );
}
