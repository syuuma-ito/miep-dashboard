"use client";

import EditTag from "@/components/EditTag";
import TagCard from "@/components/TagCard";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useAuth } from "@/contexts/AuthContext";
import { displayError } from "@/lib/error";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import style from "./page.module.css";

export default function Page() {
    const { supabase, user, loading } = useAuth();
    const router = useRouter();

    const [allTags, setAllTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState(null);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [navConfirmOpen, setNavConfirmOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // { type: 'push'|'back'|'select'|'new', href?: string, tag?: any }

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [loading, user, router]);

    const fetchTags = useCallback(async () => {
        const { data, error } = await supabase.rpc("get_all_tags_all_langs");

        if (error) {
            setIsError(true);
            setErrorMessage("タグの取得に失敗しました");
        } else {
            setAllTags(data);
        }
    }, [supabase]);

    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

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
            setPendingAction({ type: "push", href: url.pathname + url.search + url.hash });
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
                setPendingAction({ type: "back" });
                setNavConfirmOpen(true);
            }
        };
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, [hasUnsavedChanges, navConfirmOpen]);

    const handleSave = async (updatedTag) => {
        const isNewTag = !updatedTag.id;

        if (isNewTag) {
            const { data: newTagId, error } = await supabase.rpc("create_tag", {
                p_tag_data: updatedTag,
            });

            if (error) {
                displayError("タグの作成に失敗しました");
                return;
            }
            toast.success("タグを作成しました");
            setSelectedTag(null);
            setHasUnsavedChanges(false);
            await fetchTags();
        } else {
            const { error } = await supabase.rpc("update_tag", {
                p_tag_data: updatedTag,
            });

            if (error) {
                displayError("タグの更新に失敗しました");
                return;
            }
            toast.success("タグを更新しました");
            setSelectedTag(null);
            setHasUnsavedChanges(false);
            await fetchTags();
        }
    };

    const handleDelete = async (deletedTag) => {
        if (!deletedTag.id) {
            displayError("削除するタグが見つかりません");
            return;
        }

        const { error, data: isDeleted } = await supabase.rpc("delete_tag", { p_tag_id: deletedTag.id });

        if (error || !isDeleted) {
            displayError("削除に失敗しました");
        } else {
            toast.success("削除しました");
            setSelectedTag(null);
            setHasUnsavedChanges(false);
            await fetchTags();
        }
    };

    const handleCreateNew = () => {
        const newTag = {
            name: {
                ja: "",
                en: "",
                ko: "",
            },
            color: "#3b82f6",
        };
        setSelectedTag(newTag);
    };

    if (loading) {
        return <div>ロード中...</div>;
    }

    if (!allTags) {
        return <div>ロード中...</div>;
    }

    if (isError) {
        return <div>{errorMessage}</div>;
    }

    return (
        <>
            <div className="h-full container mx-auto p-4">
                <ResizablePanelGroup direction="horizontal" className="h-full">
                    <ResizablePanel defaultSize={50} className="h-full">
                        <div className={style.tagListContainer}>
                            <div className={style.header}>
                                <h2>タグ一覧</h2>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        if (hasUnsavedChanges) {
                                            setPendingAction({ type: "new" });
                                            setNavConfirmOpen(true);
                                            return;
                                        }
                                        handleCreateNew();
                                    }}
                                >
                                    タグを新規作成
                                </Button>
                            </div>
                            <div className={style.tagList}>
                                {allTags.map((tag) => (
                                    <div
                                        key={tag.id}
                                        onClick={() => {
                                            if (selectedTag?.id === tag.id) return;
                                            if (hasUnsavedChanges) {
                                                setPendingAction({ type: "select", tag });
                                                setNavConfirmOpen(true);
                                                return;
                                            }
                                            setSelectedTag(tag);
                                        }}
                                    >
                                        <TagCard tag={tag} className={style.tagCard} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={50}>
                        {selectedTag ? (
                            <EditTag //
                                tag={selectedTag}
                                onSave={handleSave}
                                onDelete={handleDelete}
                                onCancel={() => {
                                    setSelectedTag(null);
                                    setHasUnsavedChanges(false);
                                }}
                                className={style.editTag}
                                isEditing={!!selectedTag.id}
                                onDirtyChange={setHasUnsavedChanges}
                            />
                        ) : (
                            <div className="flex h-full  justify-center text-gray-500 p-4">左のリストから編集するタグを選択するか、新規作成ボタンを押してください。</div>
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
                        <AlertDialogCancel onClick={() => setPendingAction(null)}>キャンセル</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                const act = pendingAction;
                                setNavConfirmOpen(false);
                                setPendingAction(null);
                                setHasUnsavedChanges(false);
                                if (act?.type === "push" && act.href) {
                                    router.push(act.href);
                                } else if (act?.type === "back") {
                                    setTimeout(() => router.back(), 0);
                                } else if (act?.type === "select" && act.tag) {
                                    setSelectedTag(act.tag);
                                } else if (act?.type === "new") {
                                    handleCreateNew();
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
