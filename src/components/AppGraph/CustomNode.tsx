import { useState, useCallback } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import {useMediaQuery, useTheme } from '@mui/material'

interface CustomNodeProps {
  data: { label: string };  
  isConnectable: boolean; 
  id: string; 
}

const CustomNode = ({ data, isConnectable, id }: CustomNodeProps) => {
  const { setNodes, setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  }, [id, setNodes, setEdges]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: isSmallScreen? "2px":"10px",
        fontSize: "12px",
        border: "1px solid black",
        borderRadius: "3px",
        width: isSmallScreen? "100px" : "150px",
        textAlign: "center",
        cursor: "pointer",
        position: "relative",
        color: 'black'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable} 
      />
      <span>{data.label}</span> 
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
      {isHovered && (
        <img
          src="https://cdn-icons-png.flaticon.com/128/1828/1828843.png" 
          alt="delete"
          style={{
            position: "absolute",
            width: "20px",
            top: "-8px",
            right: "-8px",
            cursor: "pointer", 
          }}
          onClick={deleteNode}
        />
      )}
    </div>
  );
};

export default CustomNode;
