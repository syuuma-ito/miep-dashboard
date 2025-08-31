"use client";

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
                <div key={spot.id}>
                    <h2>{spot.name}</h2>
                    <p>{spot.description}</p>
                    <Link href={`/tourist-spots/${spot.id}`}>Edit</Link>
                </div>
            ))}
        </>
    );
}
