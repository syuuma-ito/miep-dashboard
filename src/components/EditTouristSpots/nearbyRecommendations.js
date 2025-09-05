"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getAllSpotsByLang } from "@/lib/supabase/getAllSpots";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import style from "./forms.module.css";

import ErrorMessage from "./error";

const NearbyRecommendations = ({ control, errors, name = "nearby_recommendations", myId }) => {
    const [openIndex, setOpenIndex] = useState(null);
    const [allTouristSpots, setAllTouristSpots] = useState([]);

    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    const currentValues = useWatch({ control, name }) || [];

    useEffect(() => {
        const fetchAllSpots = async () => {
            const spots = await getAllSpotsByLang("ja");
            setAllTouristSpots(spots);
        };
        fetchAllSpots();
    }, []);

    const addRecommendation = () => {
        append(null);
    };

    return (
        <div className={style.section}>
            <h2>近くのおすすめスポット</h2>

            {fields.map((field, index) => {
                const availableSpots = allTouristSpots.filter((spot) => !currentValues.includes(spot.id) || currentValues[index] === spot.id).filter((spot) => spot.id !== myId);

                return (
                    <div className={style.inputContainer} key={field.id}>
                        <div className={style.inputWithLabel}>
                            <label>スポット {index + 1}</label>

                            <Controller
                                control={control}
                                name={`${name}.${index}`}
                                render={({ field: controllerField }) => {
                                    const selectedSpot = allTouristSpots.find((s) => s.id === controllerField.value);
                                    return (
                                        <Popover open={openIndex === index} onOpenChange={(open) => setOpenIndex(open ? index : null)}>
                                            <PopoverTrigger asChild>
                                                <Button type="button" variant="outline" className="w-[240px] justify-start">
                                                    {selectedSpot ? selectedSpot.name : "+ 観光地を選択"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0" side="right" align="start">
                                                <Command>
                                                    <CommandList>
                                                        <CommandEmpty>No results found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {availableSpots.map((spot) => (
                                                                <CommandItem
                                                                    key={spot.id}
                                                                    value={spot.id}
                                                                    onSelect={(currentValue) => {
                                                                        controllerField.onChange(currentValue);
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
                                    );
                                }}
                            />

                            <Button type="button" onClick={() => remove(index)} variant="destructive">
                                削除
                            </Button>
                        </div>
                        <ErrorMessage message={errors?.[name]?.[index]?.message} />
                    </div>
                );
            })}

            <div className={style.addButton}>
                <Button type="button" onClick={addRecommendation}>
                    観光地を追加
                </Button>
            </div>
            <ErrorMessage message={errors?.[name]?.root?.message || errors?.[name]?.message} />
        </div>
    );
};

export default NearbyRecommendations;
