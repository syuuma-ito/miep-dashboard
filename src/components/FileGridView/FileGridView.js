"use client";

import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, File, FileCode, FileImage, FileText, Folder } from "lucide-react";
import React, { useEffect, useState } from "react";
import styles from "./FileGridView.module.css";

const FileGridView = ({ onFileSelect, isOpen, setOpen }) => {
    // 表示上のルートパスを /contents に固定
    const BASE_PATH = "/contents";
    const [contents, setContents] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPath, setCurrentPath] = useState(BASE_PATH);
    const [navigationHistory, setNavigationHistory] = useState([BASE_PATH]);
    const [selectedFileState, setSelectedFileState] = useState(null);

    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        const fetchContents = async () => {
            try {
                setLoading(true);
                const miepUrl = process.env.NEXT_PUBLIC_MIEP_URL;
                const response = await fetch(`${miepUrl}/contents/contents.json`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setContents(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContents();
    }, []);

    useEffect(() => {
        setCurrentPath(BASE_PATH);
        setSelectedFileState(null);
        setNavigationHistory([BASE_PATH]);
    }, [isOpen]);

    // 画像かどうかを判定する関数
    const isImageFile = (fileName) => {
        const extension = fileName.split(".").pop()?.toLowerCase();
        return ["png", "jpg", "jpeg", "gif", "webp", "svg", "ico"].includes(extension);
    };

    // ファイルアイコンまたは画像を返すコンポーネント
    const FileIcon = ({ fileName, filePath, className = "" }) => {
        const miepUrl = process.env.NEXT_PUBLIC_MIEP_URL;
        const [imageError, setImageError] = useState(false);

        if (isImageFile(fileName) && !imageError) {
            const absoluteUrl = `${miepUrl.replace(/\/$/, "")}${filePath.startsWith("/") ? filePath : "/" + filePath}`;

            return <img src={absoluteUrl} alt={fileName} className={`${styles.imageIcon} ${className} select-none pointer-events-none`} onError={() => setImageError(true)} draggable={false} />;
        }

        const extension = fileName.split(".").pop()?.toLowerCase();
        const iconProps = {
            size: 32,
            className: `${styles.fileIcon} ${className} select-none pointer-events-none`,
        };

        switch (extension) {
            case "png":
            case "jpg":
            case "jpeg":
            case "gif":
            case "webp":
            case "svg":
            case "ico":
                return <FileImage {...iconProps} className={`${iconProps.className} text-blue-500`} />;
            case "pdf":
                return <File {...iconProps} className={`${iconProps.className} text-red-500`} />;
            case "txt":
            case "md":
                return <FileText {...iconProps} className={`${iconProps.className} text-gray-600`} />;
            case "json":
            case "js":
            case "jsx":
            case "ts":
            case "tsx":
                return <FileCode {...iconProps} className={`${iconProps.className} text-green-600`} />;
            default:
                return <File {...iconProps} className={`${iconProps.className} text-gray-400`} />;
        }
    };

    const getFileName = (path) => {
        return path.split("/").pop();
    };

    // 階層構造を作成する関数
    const buildFileTree = (images) => {
        const tree = {
            name: "root",
            path: "/",
            isFolder: true,
            children: {},
            files: [],
        };

        images.forEach((imagePath) => {
            const parts = imagePath.split("/").filter((part) => part !== "");
            let currentNode = tree;

            // パスの各部分を辿ってフォルダ構造を構築
            for (let i = 0; i < parts.length - 1; i++) {
                const folderName = parts[i];
                const folderPath = "/" + parts.slice(0, i + 1).join("/");

                if (!currentNode.children[folderName]) {
                    currentNode.children[folderName] = {
                        name: folderName,
                        path: folderPath,
                        isFolder: true,
                        children: {},
                        files: [],
                    };
                }
                currentNode = currentNode.children[folderName];
            }

            // ファイルを追加
            const fileName = parts[parts.length - 1];
            currentNode.files.push({
                name: fileName,
                path: imagePath,
                isFolder: false,
            });
        });

        return tree;
    };

    // 現在のパスの内容を取得
    const getCurrentFolderContents = (tree, path) => {
        if (path === "/") {
            return tree;
        }

        const parts = path.split("/").filter((part) => part !== "");
        let currentNode = tree;

        for (const part of parts) {
            if (currentNode.children[part]) {
                currentNode = currentNode.children[part];
            } else {
                return null;
            }
        }

        return currentNode;
    };

    // パンくずリストの生成
    const getBreadcrumbs = (path) => {
        // 表示上のホームを /contents に固定し、/contents より上は表示させない
        const trimTrailingSlash = (p) => (p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p);
        const base = trimTrailingSlash(BASE_PATH);
        const current = trimTrailingSlash(path);

        const breadcrumbs = [{ name: "ホーム", path: base }];
        if (current === base) return breadcrumbs;

        // /contents より下位のパスのみをパンくずに含める
        const rest = current.startsWith(base) ? current.slice(base.length) : "";
        const parts = rest.split("/").filter(Boolean);

        let acc = base;
        parts.forEach((part) => {
            acc += "/" + part;
            breadcrumbs.push({ name: part, path: acc });
        });

        return breadcrumbs;
    };

    // フォルダダブルクリック処理
    const handleFolderDoubleClick = (folder) => {
        setCurrentPath(folder.path);
        setNavigationHistory((prev) => [...prev, folder.path]);
    };

    // ファイル/フォルダクリック処理
    const handleItemClick = (item) => {
        // フォルダの場合は選択しない
        if (item.isFolder) {
            return;
        }
        setSelectedFileState(item);
    };

    // パンくずリストクリック処理
    const handleBreadcrumbClick = (path) => {
        // /contents より上へは移動させない
        if (!path.startsWith(BASE_PATH)) return;
        setCurrentPath(path);
        setNavigationHistory((prev) => [...prev, path]);
    };

    // 戻るボタン処理
    const handleGoBack = () => {
        if (navigationHistory.length > 1) {
            const newHistory = [...navigationHistory];
            newHistory.pop();
            const previousPath = newHistory[newHistory.length - 1] || BASE_PATH;
            // /contents より上へ戻らないよう安全策
            const safePrev = previousPath.startsWith(BASE_PATH) ? previousPath : BASE_PATH;
            setCurrentPath(safePrev);
            setNavigationHistory(newHistory.length ? newHistory : [BASE_PATH]);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-32" />
                    </CardHeader>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="grid grid-flow-col grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="flex flex-col items-center space-y-2">
                                    <Skeleton className="h-16 w-16 rounded-lg" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                        <CardTitle className="text-red-800">エラーが発生しました</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-600">エラー: {error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!contents || !contents.images) {
        return (
            <div className="container mx-auto p-6">
                <Card className="border-yellow-200 bg-yellow-50">
                    <CardHeader>
                        <CardTitle className="text-yellow-800">データが見つかりません</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-yellow-600">ファイルデータが見つかりません</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const fileTree = buildFileTree(contents.images);
    const currentFolder = getCurrentFolderContents(fileTree, currentPath);
    const breadcrumbs = getBreadcrumbs(currentPath);

    if (!currentFolder) {
        return (
            <div className="container mx-auto p-6">
                <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                        <CardTitle className="text-red-800">フォルダが見つかりません</CardTitle>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    // 現在のフォルダの内容を取得
    const folders = Object.values(currentFolder.children || {});
    const files = currentFolder.files || [];

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="w-[80vw] h-[80vh] flex flex-col p-0">
                <DialogDescription className="sr-only">ファイル選択ダイアログ</DialogDescription>
                <div className="p-6 pb-2 border-b">
                    <DialogTitle className="mb-6">ファイルを選択してください</DialogTitle>
                    <div className="flex items-center gap-8">
                        <Button variant="outline" size="sm" onClick={handleGoBack} disabled={navigationHistory.length <= 1} className="flex items-center gap-2">
                            <ChevronLeft size={16} />
                            戻る
                        </Button>

                        <Breadcrumb className="bg-gray-100 rounded-md px-6 py-2">
                            <BreadcrumbList>
                                {breadcrumbs.map((crumb, index) => (
                                    <React.Fragment key={index}>
                                        <BreadcrumbItem>
                                            {index === breadcrumbs.length - 1 ? (
                                                <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink className="cursor-pointer hover:text-primary" onClick={() => handleBreadcrumbClick(crumb.path)}>
                                                    {crumb.name}
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                        {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                                    </React.Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
                <div className="flex-1 overflow-auto p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4">
                        {/* フォルダを先に表示 */}
                        {folders.map((folder, index) => (
                            <div
                                key={`folder-${index}`}
                                className={`
                                    flex flex-col items-center p-2 rounded-lg border-1 cursor-pointer select-none
                                    transition-all duration-200 hover:border-primary/50 aspect-ratio-1/1
                                    ${selectedFileState?.path === folder.path ? "bg-primary/10 border-primary" : "border-transparent hover:border-border"}
                                `}
                                onClick={() => handleItemClick(folder)}
                                onDoubleClick={() => handleFolderDoubleClick(folder)}
                            >
                                <Folder size={48} className="mb-2 pointer-events-none" />
                                <span className="text-xs text-center font-medium truncate pointer-events-none" title={folder.name}>
                                    {folder.name}
                                </span>
                                <Badge variant="outline" className="text-xs mt-1 pointer-events-none">
                                    {Object.keys(folder.children).length + folder.files.length} アイテム
                                </Badge>
                            </div>
                        ))}

                        {/* ファイルを表示 */}
                        {files.map((file, index) => (
                            <div
                                key={`file-${index}`}
                                className={`
                                    flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer select-none
                                    transition-all duration-200 hover:bg-accent hover:border-primary/50
                                    ${selectedFileState?.path === file.path ? "bg-primary/10 border-primary" : "border-transparent hover:border-border"}
                                `}
                                onClick={() => handleItemClick(file)}
                                onDoubleClick={() => setPreviewUrl(`${process.env.NEXT_PUBLIC_MIEP_URL}${file.path}`)}
                            >
                                <div className="mb-2 pointer-events-none">
                                    <FileIcon fileName={file.name} filePath={file.path} />
                                </div>
                                <span className="text-xs text-center font-medium truncate w-full pointer-events-none" title={file.name}>
                                    {file.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t p-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">データ更新: {new Date(contents.generatedAt).toLocaleString("ja-JP")}</p>
                    {selectedFileState && (
                        <div className="flex items-center gap-8">
                            <div>
                                <p className="">ファイル名 : {selectedFileState.name}</p>
                            </div>
                            <div>
                                <FileIcon fileName={selectedFileState.name} filePath={selectedFileState.path} className="h-8 w-8" />
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    const miepUrl = process.env.NEXT_PUBLIC_MIEP_URL;
                                    const absoluteUrl = `${miepUrl.replace(/\/$/, "")}${selectedFileState.path.startsWith("/") ? selectedFileState.path : "/" + selectedFileState.path}`;
                                    setPreviewUrl(absoluteUrl);
                                }}
                                disabled={!isImageFile(selectedFileState.name)}
                            >
                                プレビュー
                            </Button>
                            <Button
                                onClick={() => {
                                    const miepUrl = process.env.NEXT_PUBLIC_MIEP_URL;
                                    const absoluteUrl = `${miepUrl.replace(/\/$/, "")}${selectedFileState.path.startsWith("/") ? selectedFileState.path : "/" + selectedFileState.path}`;
                                    onFileSelect({
                                        ...selectedFileState,
                                        absoluteUrl,
                                    });
                                }}
                            >
                                このファイルを選択
                            </Button>
                        </div>
                    )}
                </div>
                <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
                    <DialogContent className="w-[60vw] h-[60vh] flex flex-col p-0">
                        <DialogTitle className="p-4 border-b">ファイルプレビュー</DialogTitle>
                        <div className="flex-1 flex items-center justify-center">
                            {selectedFileState && isImageFile(selectedFileState.name) ? (
                                <img src={previewUrl} alt={selectedFileState.name} className="max-w-full max-h-full object-contain" />
                            ) : (
                                <p className="text-white">プレビューは画像ファイルのみ対応しています。</p>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </DialogContent>
        </Dialog>
    );
};

export default FileGridView;
