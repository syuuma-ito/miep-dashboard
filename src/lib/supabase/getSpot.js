"use client";

import { displayError } from "../error";
import { supabase } from "./client";

async function getSpotDetail(id, lang) {
    try {
        const { data, error } = await supabase.rpc("get_spot_detail", {
            p_spot_id: id,
            p_lang: lang,
        });
        if (error) {
            displayError("データの取得中にエラーが発生しました...時間をおいて再度お試しください。");
            return null;
        }
        return data;
    } catch (error) {
        displayError("データの取得中にエラーが発生しました...時間をおいて再度お試しください。");
        return null;
    }
}

export default getSpotDetail;
