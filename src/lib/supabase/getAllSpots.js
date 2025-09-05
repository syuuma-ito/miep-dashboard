"use client";

import { toast } from "sonner";
import { supabase } from "./client";

async function getAllSpotsByLang(lang) {
    try {
        const { data, error } = await supabase.rpc("get_spot_list", {
            p_lang: lang,
        });

        if (error) {
            toast.error("データの取得中にエラーが発生しました...時間をおいて再度お試しください。");
            throw error;
        }

        return data || [];
    } catch (err) {
        toast.error("データの取得中にエラーが発生しました...時間をおいて再度お試しください。");
        return [];
    }
}

export { getAllSpotsByLang };
