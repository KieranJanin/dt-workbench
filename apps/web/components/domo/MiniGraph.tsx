import React from 'react';

export interface GraphNode {
  id: string;
  label: string;
  type: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

interface MiniGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  className?: string;
  onNodeClick?: (nodeId: string) => void;
}

export const MiniGraph: React.FC<MiniGraphProps> = ({ nodes, edges, className = '', onNodeClick }) => {
  // Simple fixed layout for MVP since real force-directed graph is too heavy for inline chat.
  // Assuming max 4-5 nodes for a mini-graph.
  const positions = [
    { x: 50, y: 50 },
    { x: 150, y: 50 },
    { x: 100, y: 120 },
    { x: 50, y: 150 },
    { x: 150, y: 150 }
  ];

  return (
    <div className={`relative w-full h-48 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 200 200">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
          </marker>
        </defs>
        
        {/* Render Edges */}
        {edges.map((edge, i) => {
          const sourceIdx = nodes.findIndex(n => n.id === edge.source);
          const targetIdx = nodes.findIndex(n => n.id === edge.target);
          if (sourceIdx === -1 || targetIdx === -1) return null;
          
          const p1 = positions[sourceIdx % positions.length];
          const p2 = positions[targetIdx % positions.length];
          
          return (
            <g key={`edge-${i}`}>
              <line 
                x1={p1.x} y1={p1.y} 
                x2={p2.x} y2={p2.y} 
                stroke="#d1d5db" 
                strokeWidth="2" 
                markerEnd="url(#arrowhead)" 
              />
              <text 
                x={(p1.x + p2.x) / 2} 
                y={(p1.y + p2.y) / 2 - 5}
                fill="#6b7280"
                fontSize="8"
                textAnchor="middle"
              >
                {edge.label}
              </text>
            </g>
          );
        })}

        {/* Render Nodes */}
        {nodes.map((node, i) => {
          const pos = positions[i % positions.length];
          const isObservation = node.type === 'Observation';
          const isInsight = node.type === 'Insight';
          const fillColor = isObservation ? '#fef08a' : (isInsight ? '#86efac' : '#93c5fd'); // Canary Yellow, Lime Green, Electric Blue
          const strokeColor = isObservation ? '#eab308' : (isInsight ? '#22c55e' : '#3b82f6');
          
          return (
            <g 
              key={`node-${node.id}`} 
              transform={`translate(${pos.x}, ${pos.y})`}
              className="cursor-pointer"
              onClick={() => onNodeClick && onNodeClick(node.id)}
            >
              <circle r="16" fill={fillColor} stroke={strokeColor} strokeWidth="2" />
              <text y="2" fill="#1f2937" fontSize="8" textAnchor="middle" fontWeight="bold">
                {node.label.length > 8 ? node.label.substring(0, 8) + '...' : node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
