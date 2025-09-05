"use client";

import EditTouristSpots from "@/components/EditTouristSpots";
import LangSelect from "@/components/LangSelect/LangSelect";
import MapPreview from "@/components/Map";
import SpotDetail from "@/components/SpotDetail";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useAuth } from "@/contexts/AuthContext";
import { displayError } from "@/lib/error";
import { getAllSpotsByLang } from "@/lib/supabase/getAllSpots";
import { getAllTagsByLang } from "@/lib/supabase/getAllTags";
import { filterTextByLang, resolveSpotRefs } from "@/utils/spot";
import { useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useSearchParams } from "next/navigation";

import style from "./page.module.css";

const TouristSpotsPage = () => {
    const { supabase, user, loading } = useAuth();

    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const router = useRouter();

    const [touristSpot, setTouristSpot] = useState(null);

    const [previewData, setPreviewData] = useState(null);
    const [previewLang, setPreviewLang] = useState("ja");

    const [allTags, setAllTags] = useState([]);
    const [allTouristSpots, setAllTouristSpots] = useState([]);

    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingSaveData, setPendingSaveData] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

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
            const { data, error } = await supabase.rpc("get_spot_detail_all_langs", { p_spot_id: id });

            if (error) {
                setIsError(true);
                setErrorMessage("観光スポットの取得に失敗しました");
            } else {
                setTouristSpot(data);
                setPreviewData(data);
            }
        };

        fetchTouristSpot();
    }, [supabase, id]);

    const handleSave = useCallback(
        (data) => {
            data.id = id;
            setPendingSaveData(data);
            setConfirmOpen(true);
        },
        [id]
    );

    const performSave = useCallback(async () => {
        if (!pendingSaveData) return;
        setConfirmOpen(false);
        const data = pendingSaveData;
        setPendingSaveData(null);

        const { error } = await supabase.rpc("update_spot", { p_spot_data: data });

        if (error) {
            displayError("保存に失敗しました");
        } else {
            toast.success("保存しました");
        }
    }, [pendingSaveData, supabase]);

    const handleDelete = useCallback(() => {
        setDeleteConfirmOpen(true);
    }, []);

    const performDelete = useCallback(async () => {
        setDeleteConfirmOpen(false);
        if (!id || !supabase) return;
        const { error, data: isDeleted } = await supabase.rpc("delete_spot", { p_spot_id: id });

        if (error || !isDeleted) {
            displayError("削除に失敗しました");
        } else {
            toast.success("削除しました");
            router.push("/");
        }
    }, [id, supabase, router]);

    const handlePreview = useCallback((data) => {
        toast.info("プレビューを更新しました");
        setPreviewData(data);
    }, []);

    const previewSpot = resolveSpotRefs(filterTextByLang(previewData, previewLang), allTags, allTouristSpots);

    if (loading) {
        return <div>ロード中...</div>;
    }
    if (!touristSpot) {
        return <div>ロード中...</div>;
    }

    if (!id) {
        return <div>観光スポットが見つかりません</div>;
    }

    if (isError) {
        return <div>{errorMessage}</div>;
    }

    return (
        <>
            <ResizablePanelGroup direction="horizontal" className={style.container}>
                <ResizablePanel defaultSize={30} className="flex-1 h-full ">
                    <EditTouristSpots touristSpot={touristSpot} onSave={handleSave} onPreview={handlePreview} onDelete={handleDelete} isEdit />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={70}>
                    <div className={style.preview}>
                        <div className={style.header}>
                            プレビュー
                            <LangSelect lang={previewLang} setLang={setPreviewLang} />
                        </div>

                        <ResizablePanelGroup direction="horizontal">
                            <ResizablePanel defaultSize={70}>{previewData && <MapPreview touristSpot={filterTextByLang(previewData, previewLang)} />}</ResizablePanel>
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
                        <AlertDialogTitle>変更を保存してもいいですか？</AlertDialogTitle>
                        <AlertDialogDescription>保存されるとすぐに反映されます。</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction onClick={performSave}>保存</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                        <AlertDialogDescription>削除すると元に戻せません。</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <Button variant="destructive" onClick={performDelete}>
                            削除
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default function Page() {
    return (
        <Suspense>
            <TouristSpotsPage />
        </Suspense>
    );
}
