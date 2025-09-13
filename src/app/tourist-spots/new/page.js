"use client";

import EditTouristSpots from "@/components/EditTouristSpots";
import LangSelect from "@/components/LangSelect/LangSelect";
import MapPreview from "@/components/Map";
import SpotDetail from "@/components/SpotDetail";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useAuth } from "@/contexts/AuthContext";
import { displayError } from "@/lib/error";
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
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [navConfirmOpen, setNavConfirmOpen] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState(null); // { type: 'push'|'back', href?: string }

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

    // ブラウザの閉じる/リロード時の確認
    useEffect(() => {
        if (!hasUnsavedChanges) return;
        const handler = (e) => {
            e.preventDefault();
            e.returnValue = "未保存の変更があります。本当に移動しますか？";
            return e.returnValue;
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [hasUnsavedChanges]);

    // 内部リンククリックの抑止と確認
    useEffect(() => {
        if (!hasUnsavedChanges) return;
        const onClick = (e) => {
            if (e.defaultPrevented) return;
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            const anchor = e.target.closest?.("a");
            if (!anchor) return;
            if (anchor.target === "_blank" || anchor.hasAttribute("download") || anchor.getAttribute("rel") === "external") return;
            const href = anchor.getAttribute("href");
            if (!href) return;
            const url = new URL(href, window.location.href);
            if (url.origin !== window.location.origin) return;
            e.preventDefault();
            setPendingNavigation({ type: "push", href: url.pathname + url.search + url.hash });
            setNavConfirmOpen(true);
        };
        document.addEventListener("click", onClick, true);
        return () => document.removeEventListener("click", onClick, true);
    }, [hasUnsavedChanges]);

    // 戻る/進むの抑止
    useEffect(() => {
        if (!hasUnsavedChanges) return;
        const state = { __unsaved_guard__: true, t: Date.now() };
        try {
            history.pushState(state, "");
        } catch {}
        const onPopState = () => {
            try {
                history.pushState(state, "");
            } catch {}
            if (!navConfirmOpen) {
                setPendingNavigation({ type: "back" });
                setNavConfirmOpen(true);
            }
        };
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, [hasUnsavedChanges, navConfirmOpen]);

    const handleSave = useCallback((data) => {
        setPendingSaveData(data);
        setConfirmOpen(true);
    }, []);

    const performSave = useCallback(async () => {
        if (!pendingSaveData) return;
        setConfirmOpen(false);
        const data = pendingSaveData;
        setPendingSaveData(null);

        const { error, data: newId } = await supabase.rpc("create_spot", { p_spot_data: data });

        if (error) {
            displayError("新規作成に失敗しました");
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
        return <div>ロード中...</div>;
    }

    return (
        <>
            <ResizablePanelGroup direction="horizontal" className={style.container}>
                <ResizablePanel defaultSize={30} className="flex-1 h-full ">
                    <EditTouristSpots onSave={handleSave} onPreview={handlePreview} onDirtyChange={setHasUnsavedChanges} />
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
                        <AlertDialogTitle>観光地を新規作成しますか？</AlertDialogTitle>
                        <AlertDialogDescription>保存されるとすぐに反映されます。</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction onClick={performSave}>新規作成</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/* 離脱確認ダイアログ */}
            <AlertDialog open={navConfirmOpen} onOpenChange={setNavConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>保存していない変更があります</AlertDialogTitle>
                        <AlertDialogDescription>このページから離れると変更は失われます。移動してもよろしいですか？</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPendingNavigation(null)}>キャンセル</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                const nav = pendingNavigation;
                                setNavConfirmOpen(false);
                                setPendingNavigation(null);
                                setHasUnsavedChanges(false);
                                if (nav?.type === "push" && nav.href) {
                                    router.push(nav.href);
                                } else if (nav?.type === "back") {
                                    setTimeout(() => router.back(), 0);
                                }
                            }}
                        >
                            移動する
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
