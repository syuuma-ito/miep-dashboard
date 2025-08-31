"use client";

import EditTouristSpots from "@/components/EditTouristSpots";
import LangSelect from "@/components/LangSelect/LangSelect";
import MapPreview from "@/components/Map";
import SpotDetail from "@/components/SpotDetail";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useAuth } from "@/contexts/AuthContext";
import { getAllSpotsByLang } from "@/lib/supabase/getAllSpots";
import { getAllTagsByLang } from "@/lib/supabase/getAllTags";
import { filterTextByLang, resolveSpotRefs } from "@/utils/spot";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import style from "./page.module.css";

export default function Page({ params }) {
    const { supabase, user, loading } = useAuth();
    const { id } = React.use(params);
    const router = useRouter();
    const [touristSpot, setTouristSpot] = useState(null);

    const [previewData, setPreviewData] = useState(null);
    const [previewLang, setPreviewLang] = useState("ja");

    const [allTags, setAllTags] = useState([]);
    const [allTouristSpots, setAllTouristSpots] = useState([]);

    useEffect(() => {
        const fetchAllSpots = async () => {
            const allTouristSpots = await getAllSpotsByLang(previewLang);
            setAllTouristSpots(allTouristSpots);
        };

        const fetchAllTags = async () => {
            const allTags = await getAllTagsByLang(previewLang);
            setAllTags(allTags);
        };

        fetchAllSpots();
        fetchAllTags();
    }, [previewLang]);

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
                setTouristSpot(data);
                setPreviewData(data);
            }
        };

        fetchTouristSpot();
    }, [supabase, id]);

    const handleSave = useCallback(
        async (data) => {
            data.id = id;
            console.log("Saving data:", data);

            const { error, data: savedData } = await supabase.rpc("upsert_spot", { p_data: data });

            if (error) {
                console.error("Error saving data:", error);
                toast.error("保存に失敗しました");
            } else {
                console.log("Data saved successfully");
                toast.success("保存しました");
            }
        },
        [id, supabase]
    );

    const handlePreview = useCallback((data) => {
        setPreviewData(data);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const previewSpot = resolveSpotRefs(filterTextByLang(previewData, previewLang), allTags, allTouristSpots);

    return (
        <ResizablePanelGroup direction="horizontal" className={style.container}>
            <ResizablePanel defaultSize={30} className="flex-1 h-full ">
                <EditTouristSpots touristSpot={touristSpot} onSave={handleSave} onPreview={handlePreview} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70}>
                <div className={style.preview}>
                    <div className={style.header}>
                        プレビュー
                        <LangSelect lang={previewLang} setLang={setPreviewLang} />
                    </div>

                    <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={70}>
                            <MapPreview touristSpots={[filterTextByLang(previewData, previewLang)]} />
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={30}>
                            <div className="flex-1 h-full ">{previewData && <SpotDetail spot={previewSpot} lang={previewLang} />}</div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
