"use client";

import EditTag from "@/components/EditTag";
import TagCard from "@/components/TagCard";
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
        <div className="h-full">
            <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel defaultSize={50} className="h-full">
                    <div className={style.tagListContainer}>
                        <div className={style.header}>
                            <h2>タグ一覧</h2>
                            <Button variant="outline" onClick={handleCreateNew}>
                                タグを新規作成
                            </Button>
                        </div>
                        <div className={style.tagList}>
                            {allTags.map((tag) => (
                                <div key={tag.id} onClick={() => setSelectedTag(tag)}>
                                    <TagCard tag={tag} className={style.tagCard} />
                                </div>
                            ))}
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50}>
                    {selectedTag && (
                        <EditTag //
                            tag={selectedTag}
                            onSave={handleSave}
                            onDelete={handleDelete}
                            onCancel={() => setSelectedTag(null)}
                            className={style.editTag}
                            isEditing={!!selectedTag.id}
                        />
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
