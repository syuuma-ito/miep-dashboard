"use client";

import SpotCard from "@/components/SpotCard";
import { useAuth } from "@/contexts/AuthContext";
import { getAllSpotsByLang } from "@/lib/supabase/getAllSpots";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home({ params }) {
    const { supabase, user, loading } = useAuth();
    const [touristSpots, setTouristSpots] = useState([]);

    console.log("user:", user);

    useEffect(() => {
        const fetchTouristSpots = async () => {
            const spots = await getAllSpotsByLang("ja");
            setTouristSpots(spots);
        };

        fetchTouristSpots();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        redirect("/login");
    }

    return (
        <>
            {touristSpots.map((spot) => (
                <Link key={spot.id} href={`/tourist-spots?id=${spot.id}`}>
                    <SpotCard spot={spot} />
                </Link>
            ))}
        </>
    );
}
