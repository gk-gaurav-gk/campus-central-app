
import React from 'react';
import AssignmentCard from './AssignmentCard';
import AssignmentListItem from './AssignmentListItem';

const AssignmentGrid = ({ assignments, viewMode = 'grid' }) => {
  if (assignments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <span className="text-2xl">📚</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">No assignments found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {assignments.map((assignment) => (
          <AssignmentListItem key={assignment.id} assignment={assignment} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assignments.map((assignment) => (
        <AssignmentCard key={assignment.id} assignment={assignment} />
      ))}
    </div>
  );
};

export default AssignmentGrid;
