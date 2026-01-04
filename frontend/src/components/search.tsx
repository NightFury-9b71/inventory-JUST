"use client"

import { useState, useEffect } from "react";

export interface SearchConfig {
    placeholder?: string;
    searchKeys: string[];
    className?: string;
}

export function SearchGroup<T = any>({
    data,
    config,
    onSearchedData,
}: {
    data: T[];
    config: SearchConfig;
    onSearchedData: (searchedData: T[]) => void;
}) {
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Apply search to the data
        const searchedData = searchQuery 
            ? data.filter(item => {
                return config.searchKeys.some(key => {
                    const value = item[key as keyof T];
                    return String(value).toLowerCase().includes(searchQuery.toLowerCase());
                });
              })
            : data;
        
        onSearchedData(searchedData);
    }, [searchQuery, data, config.searchKeys, onSearchedData]);

    return (
        <input 
            type="text" 
            placeholder={config.placeholder || "Search..."}
            className={config.className || "border rounded px-3 py-2 w-full sm:w-64 text-sm sm:text-base placeholder:text-xs sm:placeholder:text-sm"}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
    );
}
