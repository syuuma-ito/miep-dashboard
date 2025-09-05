"use client";

import { toast } from "sonner";

export function displayError(message) {
    toast.error(message, {
        style: { background: "#ffdddd", color: "#900" },
    });
}
