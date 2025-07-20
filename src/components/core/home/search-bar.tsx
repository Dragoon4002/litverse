"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };
  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto mb-8 max-w-2xl relative flex"
    >
      <Input
        type="search"
        placeholder="Search for events"
        className="pr-20 bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-400 focus:ring-2 focus:ring-emerald-500 transition-all"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button type="submit" className="absolute right-0 top-0">
        <Search className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default SearchBar;
