import { z } from "zod";

// --- エラーメッセージのテンプレートを定義 ---
const requiredError = (fieldName) => `${fieldName}は必須項目です。`;
const nonEmptyError = (fieldName) => `${fieldName}を入力してください。`;
const invalidTypeError = (fieldName, type) => `${fieldName}は${type}である必要があります。`;
const invalidFormatError = (fieldName, format) => `${fieldName}は有効な${format}形式で入力してください。`;
const minLengthError = (fieldName, min) => `${fieldName}は最低${min}つ以上必要です。`;

const createMultilingualSchema = (fieldName) =>
    z.object({
        ja: z.string({ required_error: requiredError(`${fieldName}(日本語)`) }).nonempty({ message: nonEmptyError(`${fieldName}(日本語)`) }),
        en: z.string({ required_error: requiredError(`${fieldName}(英語)`) }).nonempty({ message: nonEmptyError(`${fieldName}(英語)`) }),
        ko: z.string({ required_error: requiredError(`${fieldName}(韓国語)`) }).nonempty({ message: nonEmptyError(`${fieldName}(韓国語)`) }),
    });

// info配列内の各オブジェクトのスキーマ
const infoItemSchema = z.object({
    key: createMultilingualSchema("ラベル"),
    value: createMultilingualSchema("内容"),
    display_order: z.number({
        required_error: requiredError("表示順"),
        invalid_type_error: invalidTypeError("表示順", "数値"),
    }),
});

// SNSリンクのスキーマ（配列形式: { platform, url } の配列）
const snsLinksSchema = z
    .array(
        z.object({
            platform: z.enum(["website", "x", "instagram", "facebook", "youtube", "twitter"]),
            url: z.url({ message: invalidFormatError("SNSリンク", "URL") }),
        })
    )
    .optional();

export const placeSchema = z.object({
    name: createMultilingualSchema("観光地名"),
    icon: z.url({
        message: invalidFormatError("アイコンURL", "URL"),
    }),
    images: z
        .array(
            z.url({
                message: invalidFormatError("画像URL", "URL"),
            })
        )
        .min(1, { message: minLengthError("画像", 1) }),
    latitude: z.coerce.number({
        required_error: requiredError("緯度"),
        invalid_type_error: invalidTypeError("緯度", "数値"),
    }),
    longitude: z.coerce.number({
        required_error: requiredError("経度"),
        invalid_type_error: invalidTypeError("経度", "数値"),
    }),
    description: createMultilingualSchema("詳細"),
    recommended_for: createMultilingualSchema("こんな人におすすめ！！"),
    tags: z
        .array(
            z.uuid({
                message: invalidFormatError("タグID", "UUID"),
            })
        )
        .optional(),
    info: z.array(infoItemSchema).optional(),
    nearby_recommendations: z
        .array(
            z.uuid({
                message: invalidFormatError("近くのおすすめスポット", "UUID"),
            })
        )
        .optional(),
    sns_links: snsLinksSchema.optional(),
});
