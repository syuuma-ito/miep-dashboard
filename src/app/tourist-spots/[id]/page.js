"use client";

import EditTouristSpots from "@/components/EditTouristSpots";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

export default function Page({ params }) {
    const { supabase, user, loading } = useAuth();
    const { id } = React.use(params);
    const router = useRouter();
    const [touristSpot, setTouristSpot] = useState(null);

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [loading, user, router]);

    useEffect(() => {
        if (!supabase || !id) return;
        const fetchTouristSpot = async () => {
            const { data, error } = await supabase.rpc("get_spot_by_id", { p_spot_id: id });

            if (error) {
                console.error("Error fetching tourist spot:", error);
            } else {
                console.log("Fetched tourist spot:", data);
                setTouristSpot(data);
            }
        };

        fetchTouristSpot();
    }, [supabase, id]);

    const handleSave = useCallback((data) => {
        // Save the edited tourist spot data
        console.log("Saving data:", data);
    }, []);

    const handlePreview = useCallback((data) => {
        // Preview the edited tourist spot data
        console.log("Previewing data:", data);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <EditTouristSpots touristSpot={touristSpot} onSave={handleSave} onPreview={handlePreview} />
        </>
    );
}
