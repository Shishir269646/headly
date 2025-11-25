"use client";
import React from "react";
import { Search } from "lucide-react";


const ContentSearchBar = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="flex justify-center mb-8">
            <div className="form-control w-full max-w-lg relative">
                <label className="input input-bordered flex items-center gap-2">
                    <Search className="h-4 w-4 opacity-70" />
                    <input
                        type="text"
                        className="grow"
                        placeholder="Search content by title or excerpt..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </label>
            </div>
        </div>
    );
};

export default ContentSearchBar;