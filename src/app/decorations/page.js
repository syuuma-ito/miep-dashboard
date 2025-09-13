"use client";

import EditDecorations from "@/components/EditDecorations";
import LangSelect from "@/components/LangSelect/LangSelect";
import MapPreview from "@/components/Map";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useAuth } from "@/contexts/AuthContext";
import { displayError } from "@/lib/error";
import { extractDecorationsByLanguage } from "@/utils/decorationUtils";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function Page() {
    const { user, loading, supabase } = useAuth();
    const router = useRouter();
    const [allMapDecorations, setAllMapDecorations] = useState([]);
    const [displayMapDecorations, setDisplayMapDecorations] = useState([]);
    const [editingDecoration, setEditingDecoration] = useState(null);
    const [previewLang, setPreviewLang] = useState("ja");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [navConfirmOpen, setNavConfirmOpen] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState(null); // { type: 'push'|'back'|'select', href?: string, decoration?: any }

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [loading, user, router]);

    const fetchMapDecorations = useCallback(async () => {
        const { data, error } = await supabase.rpc("get_map_decorations_all_langs");

        if (error) {
            displayError("装飾マーカーの取得に失敗しました");
        } else {
            setAllMapDecorations(data);
            setDisplayMapDecorations(data);
        }
    }, [supabase]);

    useEffect(() => {
        fetchMapDecorations();
    }, [fetchMapDecorations]);

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

    const handleDecorationSelect = useCallback(
        (id) => {
            const decoration = allMapDecorations.find((d) => d.id === id);
            // 同じアイテムを選択する場合は何もしない
            if (editingDecoration?.id === id) return;

            if (hasUnsavedChanges) {
                // 未保存なら確認してから切り替え
                setPendingNavigation({ type: "select", decoration });
                setNavConfirmOpen(true);
                return;
            }

            setEditingDecoration(decoration);
            setDisplayMapDecorations(allMapDecorations);
        },
        [allMapDecorations, hasUnsavedChanges, editingDecoration]
    );

    const onDecorationSave = useCallback(
        async (data) => {
            const isNewDecoration = !data.id;

            if (isNewDecoration) {
                const { error } = await supabase.rpc("create_map_decoration", { p_map_decoration_data: data });
                if (error) {
                    displayError("装飾マーカーの新規作成に失敗しました");
                    return;
                } else {
                    toast.success("装飾マーカーを新規作成しました");
                }
            } else {
                const { error } = await supabase.rpc("update_map_decoration", { p_map_decoration_data: data });
                if (error) {
                    displayError("装飾マーカーの保存に失敗しました");
                    return;
                } else {
                    toast.success("装飾マーカーを保存しました");
                }
            }

            fetchMapDecorations();
            setEditingDecoration(null);
            setHasUnsavedChanges(false);
        },
        [fetchMapDecorations, supabase]
    );

    const onDecorationDelete = useCallback(
        async (data) => {
            const { error, data: isDeleted } = await supabase.rpc("delete_map_decoration", { p_map_decoration_id: data.id });
            if (error || !isDeleted) {
                displayError("装飾マーカーの削除に失敗しました");
                return;
            } else {
                toast.success("装飾マーカーを削除しました");
            }

            fetchMapDecorations();
            setEditingDecoration(null);
            setHasUnsavedChanges(false);
        },
        [fetchMapDecorations, supabase]
    );

    const onDecorationPreview = useCallback((data) => {
        const isNewDecoration = !data.id;
        data.isPreview = true;

        if (isNewDecoration) {
            data.id = "preview";
            setDisplayMapDecorations((prev) => {
                const withoutPreview = prev.filter((decoration) => decoration.id !== "preview");
                return [...withoutPreview, data];
            });
        } else {
            setDisplayMapDecorations((prev) => prev.map((decoration) => (decoration.id === data.id ? data : decoration)));
        }

        toast.success("プレビューを表示しています。保存するまでデータベースには反映されません。");
    }, []);

    const onNewDecoration = useCallback(() => {
        setEditingDecoration({
            latitude: 35,
            longitude: 135,
            type: "",
            options: {
                size: 1,
            },
        });
    }, []);

    const handleCancel = useCallback(() => {
        setEditingDecoration(null);
        setDisplayMapDecorations(allMapDecorations);
        setHasUnsavedChanges(false);
    }, [allMapDecorations]);

    const filteredMapDecorations = useMemo(() => {
        return extractDecorationsByLanguage(displayMapDecorations, previewLang);
    }, [displayMapDecorations, previewLang]);

    return (
        <>
            <div className="h-full">
                <ResizablePanelGroup direction="horizontal" className="h-full">
                    <ResizablePanel defaultSize={70} className="relative">
                        <MapPreview mapDecorations={filteredMapDecorations} onDecorationClick={handleDecorationSelect} />
                        <LangSelect lang={previewLang} setLang={setPreviewLang} className="absolute top-4 left-4" />
                        <Button onClick={() => onNewDecoration()} className="absolute top-4 right-4">
                            新規作成
                        </Button>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={30}>
                        {editingDecoration ? (
                            <EditDecorations
                                mapDecoration={editingDecoration}
                                onSave={onDecorationSave}
                                onDelete={onDecorationDelete}
                                onPreview={onDecorationPreview}
                                isEdit={editingDecoration?.id !== undefined}
                                onCancel={() => handleCancel()}
                                onDirtyChange={setHasUnsavedChanges}
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-500 p-4">左の地図から編集する装飾マーカーを選択するか、新規作成ボタンを押してください。</div>
                        )}
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
            {/* 離脱確認ダイアログ */}
            <AlertDialog open={navConfirmOpen} onOpenChange={setNavConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>保存していない変更があります</AlertDialogTitle>
                        <AlertDialogDescription>このページから離れたり、別のアイテムを選択すると変更は失われます。 移動してもよろしいですか？</AlertDialogDescription>
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
                                } else if (nav?.type === "select" && nav.decoration) {
                                    setEditingDecoration(nav.decoration);
                                    setDisplayMapDecorations(allMapDecorations);
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
