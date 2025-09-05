"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiUser } from "react-icons/fi";
import { toast } from "sonner";

export function Header({ className }) {
    const { user, supabase } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            console.log("User logged out");
            toast.success("ログアウトしました");
            setIsDropdownOpen(false);
        } catch (error) {
            console.log("Error logging out:", error);
            toast.error("ログアウトに失敗しました");
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className={`border-b border-gray-200 ${className}`}>
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl flex items-center">
                        <img src="/image/logo.png" alt="ロゴ" className="h-8" />
                        <span className="ml-2 align-middle">みえっぷ 管理ページ</span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-4">
                        <Link href="/">
                            <Button variant="ghost" size="sm">
                                ホーム
                            </Button>
                        </Link>

                        <Link href="/tags">
                            <Button variant="ghost" size="sm">
                                タグ
                            </Button>
                        </Link>

                        {user ? (
                            <>
                                <div className="relative" ref={dropdownRef}>
                                    <Button variant="ghost" size="sm" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-1">
                                        <FiUser />
                                    </Button>

                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                            <div className="py-1">
                                                <div className="px-4 py-3 text-sm text-gray-600">
                                                    <div className="text-xs text-gray-500 mb-1">ログイン中</div>
                                                    <div className="font-medium">{user.email}</div>
                                                </div>
                                                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700  flex items-center">
                                                    ログアウト
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Link href="/login">
                                <Button variant="outline" size="sm">
                                    ログイン
                                </Button>
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
