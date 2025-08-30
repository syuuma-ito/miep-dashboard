"use client";

import EditTouristSpots from "@/components/EditTouristSpots";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
    const { supabase, user, loading } = useAuth();

    return (
        <>
            <EditTouristSpots />
        </>
    );
}
