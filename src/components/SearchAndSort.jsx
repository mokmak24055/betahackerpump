
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SearchAndSort = ({ 
  searchTerm, 
  onSearchChange, 
  sortBy, 
  onSortChange,
  selectedCrypto,
  onCryptoChange,
  cryptocurrencies 
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <Input
        type="text"
        placeholder="Search news..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="md:flex-1 bg-input text-primary border-primary"
      />
      <Select value={selectedCrypto} onValueChange={onCryptoChange}>
        <SelectTrigger className="w-full md:w-[200px] border-primary">
          <SelectValue placeholder="Filter by crypto" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cryptocurrencies</SelectItem>
          {cryptocurrencies.map((crypto) => (
            <SelectItem key={crypto.id} value={crypto.id}>
              {crypto.id.charAt(0).toUpperCase() + crypto.id.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-full md:w-[200px] border-primary">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="points">Points</SelectItem>
          <SelectItem value="date">Date</SelectItem>
          <SelectItem value="comments">Comments</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchAndSort;

