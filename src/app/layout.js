import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { Gaegu, Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";
import style from "./layout.module.css";

const zenMaruGothic = Zen_Maru_Gothic({
    variable: "--font-zen-maru-gothic",
    subsets: ["latin"],
    weight: ["400"],
    display: "swap",
});

const gaegu = Gaegu({
    variable: "--font-gaegu",
    subsets: ["latin"],
    weight: ["400"],
    display: "swap",
});

export const metadata = {
    title: "みえっぷ 管理ページ | “三重がみえる” デジタル観光マップ",
    description: "みえっぷ 管理ページ | 三重大生が作った!! “三重がみえる” デジタル観光マップ",
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL),
    openGraph: {
        title: "みえっぷ 管理ページ | “三重がみえる” デジタル観光マップ",
        description: "みえっぷ 管理ページ | 三重大生が作った!! “三重がみえる” デジタル観光マップ",
        images: "/ogp.png",
        type: "website",
        locale: "ja",
        site_name: "みえっぷ 管理ページ | “三重がみえる” デジタル観光マップ",
    },
    robots: {
        index: false,
        follow: false,
        nocache: false,
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="ja">
            <head>
                <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            </head>
            <body className={`${zenMaruGothic.variable} ${gaegu.variable} antialiased ${style.body}`}>
                <AuthProvider>
                    <Header className={style.header} />
                    <main className={style.main}>{children}</main>
                </AuthProvider>
                <Toaster />
            </body>
        </html>
    );
}
