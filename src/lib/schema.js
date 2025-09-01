import { z } from "zod";

// 16進数カラーコード
const hexColorCodeSchema = z.string().regex(/^#(?:[A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/);

const multilingualSchema = z.object({
    ja: z.string().nonempty(),
    en: z.string().nonempty(),
    ko: z.string().nonempty(),
});

const infoItemSpotMultilingualSchema = z.object({
    key: multilingualSchema,
    value: multilingualSchema,
    display_order: z.number().int().min(0),
});

const infoItemSchema = z.object({
    key: z.string().nonempty(),
    value: z.string().nonempty(),
    display_order: z.number().int().min(0),
});

const snsLinksSchema = z.array(
    z.object({
        platform: z.enum(["website", "x", "instagram", "facebook", "youtube"]),
        url: z.url(),
    })
);

// タグ(多言語)スキーマ
const tagMultilingualSchema = z.object({
    id: z.uuid(),
    color: hexColorCodeSchema,
    name: multilingualSchema,
});

// タグ(特定の言語)スキーマ
const tagSchema = z.object({
    id: z.uuid(),
    color: hexColorCodeSchema,
    name: z.string().nonempty(),
});

// 観光地(多言語)スキーマ
const TouristSpotMultilingualSchema = z.object({
    id: z.uuid(),
    name: multilingualSchema,
    icon: z.url(),
    images: z.array(z.url()).min(1),
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    description: multilingualSchema,
    recommended_for: multilingualSchema,
    tags: z.array(tagMultilingualSchema).default([]),
    info: z.array(infoItemSpotMultilingualSchema).default([]),
    nearby_recommendations: z.array(z.uuid()).default([]),
    sns_links: snsLinksSchema.default([]),
});

// 観光地(特定の言語)スキーマ
const TouristSpotSchema = z.object({
    id: z.uuid(),
    name: z.string().nonempty(),
    icon: z.url(),
    images: z.array(z.url()).min(1),
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    description: z.string().nonempty(),
    recommended_for: z.string().nonempty(),
    tags: z.array(tagSchema).default([]),
    info: z.array(infoItemSchema).default([]),
    nearby_recommendations: z.array(z.uuid()).default([]),
    sns_links: snsLinksSchema.default([]),
});

// マップ装飾(多言語)スキーマ
const mapDecorationMultilingualSchema = z.object({
    id: z.uuid(),
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    type: z.enum(["MaskingTape", "SpeechBubble1", "SpeechBubble2", "Image"]),
    options: z.object({
        url: z.url().optional(),
        text: multilingualSchema.optional(),
        arrowPosition: z.enum(["left", "right", "center"]).optional(),
        size: z.number().min(0).max(200).optional(),
    }),
});

// マップ装飾(特定の言語)スキーマ
const mapDecorationSchema = z.object({
    id: z.uuid(),
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    type: z.enum(["MaskingTape", "SpeechBubble1", "SpeechBubble2", "Image"]),
    options: z.object({
        url: z.url().optional(),
        text: z.string().nonempty().optional(),
        arrowPosition: z.enum(["left", "right", "center"]).optional(),
        size: z.number().min(0).max(200).optional(),
    }),
});
