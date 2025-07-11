
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CollegeBranchSelector = () => {
  return (
    <div className="mb-6">
      <Select defaultValue="main-campus">
        <SelectTrigger className="w-full h-12 border-border bg-background">
          <SelectValue placeholder="Select College/Branch" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="main-campus">Main Campus</SelectItem>
          <SelectItem value="north-branch">North Branch</SelectItem>
          <SelectItem value="south-branch">South Branch</SelectItem>
          <SelectItem value="online">Online Campus</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CollegeBranchSelector;
