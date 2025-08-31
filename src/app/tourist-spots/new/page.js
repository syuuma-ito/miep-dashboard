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
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

import style from "./page.module.css";

export default function Page() {
    const { supabase, user, loading } = useAuth();

    const router = useRouter();

    const [previewData, setPreviewData] = useState(null);
    const [previewLang, setPreviewLang] = useState("ja");

    const [allTags, setAllTags] = useState([]);
    const [allTouristSpots, setAllTouristSpots] = useState([]);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingSaveData, setPendingSaveData] = useState(null);

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

    const handleSave = useCallback((data) => {
        setPendingSaveData(data);
        setConfirmOpen(true);
    }, []);

    const performSave = useCallback(async () => {
        if (!pendingSaveData) return;
        setConfirmOpen(false);
        const data = pendingSaveData;
        setPendingSaveData(null);

        const { error, data: newId } = await supabase.rpc("upsert_spot", { p_data: data });

        if (error) {
            toast.error("新規作成に失敗しました");
        } else {
            toast.success("新規作成しました");
            router.push(`/tourist-spots/?id=${newId}`);
        }
    }, [pendingSaveData, supabase, router]);

    const handlePreview = useCallback((data) => {
        toast.info("プレビューを更新しました");
        setPreviewData(data);
    }, []);

    const previewSpot = resolveSpotRefs(filterTextByLang(previewData, previewLang), allTags, allTouristSpots);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <ResizablePanelGroup direction="horizontal" className={style.container}>
                <ResizablePanel defaultSize={30} className="flex-1 h-full ">
                    <EditTouristSpots onSave={handleSave} onPreview={handlePreview} title="新規作成" />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={70}>
                    <div className={style.preview}>
                        <div className={style.header}>
                            プレビュー
                            <LangSelect lang={previewLang} setLang={setPreviewLang} />
                        </div>

                        <ResizablePanelGroup direction="horizontal">
                            <ResizablePanel defaultSize={70}>{previewData && <MapPreview touristSpots={[filterTextByLang(previewData, previewLang)]} />}</ResizablePanel>
                            <ResizableHandle withHandle />
                            <ResizablePanel defaultSize={30}>
                                <div className="flex-1 h-full ">{previewData && <SpotDetail spot={previewSpot} lang={previewLang} />}</div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>観光地を新規作成しますか？</AlertDialogTitle>
                        <AlertDialogDescription>保存されるとすぐに反映されます。</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction onClick={performSave}>新規作成</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
