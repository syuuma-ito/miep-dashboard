"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const { supabase, user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const validateInput = (data) => {
        const errors = [];

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email.trim()) {
            errors.push("メールアドレスを入力してください");
        } else if (!emailRegex.test(data.email.trim())) {
            errors.push("有効なメールアドレスを入力してください");
        }

        if (!data.password) {
            errors.push("パスワードを入力してください");
        } else if (data.password.length < 6) {
            errors.push("パスワードは6文字以上で入力してください");
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateInput(formData);
        if (errors.length > 0) {
            errors.forEach((error) => toast.error(error));
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            });

            if (error) {
                if (error.message.includes("Invalid login credentials")) {
                    toast.error("メールアドレスまたはパスワードが正しくありません");
                } else if (error.message.includes("Email not confirmed")) {
                    toast.error("メールアドレスの確認が必要です");
                } else {
                    toast.error("ログインに失敗しました。しばらく時間をおいて再度お試しください");
                }
                return;
            }

            toast.success("ログインしました");
            router.push("/");
        } catch (error) {
            toast.error("ログインに失敗しました。しばらく時間をおいて再度お試しください");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                toast.error("ログアウトに失敗しました");
                return;
            }
            toast.success("ログアウトしました");
        } catch (err) {
            toast.error("ログアウトに失敗しました");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-md mx-auto">
                        <p>ロード中...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">ログイン</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {user ? (
                                <div className="space-y-4 text-center">
                                    <p>すでにログインしています</p>
                                    <Button onClick={handleLogout} className="w-full" disabled={loading}>
                                        {loading ? "ログアウト中..." : "ログアウト"}
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="email">メールアドレス</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="mt-1"
                                            placeholder="example@example.com"
                                            maxLength={254}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="password">パスワード</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="mt-1"
                                            minLength={6}
                                            maxLength={128}
                                        />
                                    </div>

                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? "ログイン中..." : "ログイン"}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
