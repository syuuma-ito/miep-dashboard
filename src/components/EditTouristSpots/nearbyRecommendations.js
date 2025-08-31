"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getAllSpotsByLang } from "@/lib/supabase/getAllSpots";
import { useEffect, useState } from "react";
import style from "./index.module.css";

import { memo } from "react";

const NearbyRecommendations = ({ nearbyRecommendations, setNearbyRecommendations }) => {
    const [openIndex, setOpenIndex] = useState(null);
    const [allTouristSpots, setAllTouristSpots] = useState([]);

    useEffect(() => {
        const fetchAllSpots = async () => {
            const spots = await getAllSpotsByLang("ja");
            setAllTouristSpots(spots);
        };
        fetchAllSpots();
    }, []);

    const addRecommendation = () => setNearbyRecommendations((prev) => [...prev, null]);

    const updateRecommendation = (index, value) => {
        const id = value == null || value === "" ? null : String(value);
        setNearbyRecommendations((prev) => prev.map((v, i) => (i === index ? id : v)));
    };

    const removeRecommendation = (index) => setNearbyRecommendations((prev) => prev.filter((_, i) => i !== index));

    return (
        <div className={style.container}>
            <h2>近くのおすすめスポット</h2>

            {nearbyRecommendations.map((spotId, idx) => {
                const selected = allTouristSpots.find((s) => s.id === spotId) || null;
                const availableSpots = allTouristSpots.filter((s) => !nearbyRecommendations.some((id, i) => id === s.id && i !== idx));
                return (
                    <div className={style.inputContainer} key={idx}>
                        <p>スポット {idx + 1}</p>
                        <div className={style.imageInputRow}>
                            <Popover open={openIndex === idx} onOpenChange={(open) => setOpenIndex(open ? idx : null)}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[240px] justify-start">
                                        {selected ? selected.name : "+ 観光地を選択"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0" side="right" align="start">
                                    <Command>
                                        {/* <CommandInput placeholder="観光地を検索..." /> */}
                                        <CommandList>
                                            <CommandEmpty>No results found.</CommandEmpty>
                                            <CommandGroup>
                                                {availableSpots.map((spot) => (
                                                    <CommandItem
                                                        key={spot.id}
                                                        value={String(spot.id)}
                                                        onSelect={(value) => {
                                                            updateRecommendation(idx, value);
                                                            setOpenIndex(null);
                                                        }}
                                                    >
                                                        {spot.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            <Button onClick={() => removeRecommendation(idx)}>削除</Button>
                        </div>
                    </div>
                );
            })}

            <div className={style.inputContainer}>
                <p />
                <div>
                    <Button onClick={addRecommendation}>観光地を追加</Button>
                </div>
            </div>
        </div>
    );
};

export default memo(NearbyRecommendations);
