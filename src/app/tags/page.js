"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import EditTag from "@/components/EditTag";
import { useSearchParams } from "next/navigation";

export default function Page() {
    const { supabase, user, loading } = useAuth();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const router = useRouter();

    const [tag, setTag] = useState(null);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [loading, user, router]);

    useEffect(() => {
        const fetchTag = async () => {
            const { data, error } = await supabase.rpc("get_tag_by_id", { p_tag_id: id });

            if (error) {
                setIsError(true);
                setErrorMessage("タグの取得に失敗しました");
            } else {
                setTag(data);
            }
        };

        if (id) {
            fetchTag();
        }
    }, [id, supabase]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!id) {
        return <div>タグが見つかりません</div>;
    }

    if (isError) {
        return <div>{errorMessage}</div>;
    }

    return (
        <div>
            <EditTag tag={tag} />
        </div>
    );
}
