"use client";

import EditDecorations from "@/components/EditDecorations";
import LangSelect from "@/components/LangSelect/LangSelect";
import MapPreview from "@/components/Map";
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

    const handleDecorationSelect = useCallback(
        (id) => {
            const decoration = allMapDecorations.find((d) => d.id === id);
            setEditingDecoration(decoration);
            setDisplayMapDecorations(allMapDecorations);
        },
        [allMapDecorations]
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
    }, [allMapDecorations]);

    const filteredMapDecorations = useMemo(() => {
        return extractDecorationsByLanguage(displayMapDecorations, previewLang);
    }, [displayMapDecorations, previewLang]);

    return (
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
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-gray-500 p-4">左の地図から編集する装飾マーカーを選択するか、新規作成ボタンを押してください。</div>
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
