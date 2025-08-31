import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import style from "./layout.module.css";

const zenKakuGothic = Zen_Kaku_Gothic_New({
    variable: "--font-zen-kaku-gothic",
    subsets: ["latin"],
    weight: ["400"],
});

export const metadata = {
    title: "みえっぷ 管理ページ | “三重がみえる” デジタル観光マップ",
    description: "みえっぷ 管理ページ | 三重大生が作った!! “三重がみえる” デジタル観光マップ",
};

export default function RootLayout({ children }) {
    return (
        <html lang="ja">
            <body className={`${zenKakuGothic.variable} antialiased ${style.body}`}>
                <AuthProvider>
                    <Header className={style.header} />
                    <main className={style.main}>{children}</main>
                </AuthProvider>
                <Toaster />
            </body>
        </html>
    );
}
