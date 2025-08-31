/**
 * 観光地リストのnearby_recommendationsにあるIDを、対応する観光地オブジェクトに置き換える関数
 * @param {Array<Object>} attractions - 観光地オブジェクトのリスト
 * @returns {Array<Object>} IDがオブジェクトに置き換えられた新しいリスト
 */
const replaceNearbyIdsWithAttractions = (attractions) => {
    const attractionsMap = attractions.reduce((acc, attraction) => {
        acc[attraction.id] = attraction;
        return acc;
    }, {});

    return attractions.map((attraction) => {
        const newAttraction = { ...attraction };
        newAttraction.nearby_recommendations = newAttraction.nearby_recommendations.map((id) => {
            return attractionsMap[id];
        });

        return newAttraction;
    });
};

const filterTextByLang = (obj, lang) => {
    if (Array.isArray(obj)) {
        return obj.map((item) => filterTextByLang(item, lang));
    }
    if (obj && typeof obj === "object") {
        // 多言語オブジェクトかどうか判定
        const langKeys = ["en", "ja", "ko"];
        const keys = Object.keys(obj);
        // すべてのキーが言語コードなら多言語フィールドとみなす
        if (keys.length > 0 && keys.every((k) => langKeys.includes(k))) {
            return obj[lang] ?? obj["ja"] ?? obj["en"] ?? Object.values(obj)[0];
        }
        const newObj = {};
        for (const key in obj) {
            newObj[key] = filterTextByLang(obj[key], lang);
        }
        return newObj;
    }
    return obj;
};

const resolveSpotRefs = (spot, allTags = [], allSpot = []) => {
    if (!spot || typeof spot !== "object") return spot;

    const newSpot = { ...spot };

    newSpot.tags = (spot.tags || [])
        .map((t) => {
            if (!t) return null;
            if (typeof t === "string") {
                return allTags.find((tag) => tag.id === t) || { id: t };
            }
            if (typeof t === "object") {
                if (t.id) {
                    return allTags.find((tag) => tag.id === t.id) || t;
                }
                return t;
            }
            return null;
        })
        .filter(Boolean);

    newSpot.nearby_recommendations = (spot.nearby_recommendations || [])
        .map((r) => {
            if (!r) return null;
            if (typeof r === "string") {
                const found = allSpot.find((s) => s.id === r);
                return found ? { ...found } : null;
            }
            if (typeof r === "object") {
                if (r.id) {
                    const found = allSpot.find((s) => s.id === r.id);
                    return found ? { ...found } : r;
                }
                return r;
            }
            return null;
        })
        .filter(Boolean);

    return newSpot;
};

export { filterTextByLang, replaceNearbyIdsWithAttractions, resolveSpotRefs };
