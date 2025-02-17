import { useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSimpleBezierPath,
  useReactFlow,
} from "reactflow";

interface CustomEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: CustomEdgeProps) => {
  const { setEdges } = useReactFlow();
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const [edgePath, labelX, labelY] = getSimpleBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const handleClick = () => setEdges((es) => es.filter((e) => e.id !== id));

  return (
    <>
      <g
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <BaseEdge id={id} path={edgePath} />
        <EdgeLabelRenderer>
          {isHovered && (
            <img
              src="https://cdn-icons-png.flaticon.com/128/1828/1828843.png" 
              className="w-[12px] absolute z-50"
              onClick={handleClick} 
              style={{
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                pointerEvents: "all",
                width: '20px',
                height:'20px'
              }}
            />
          )}
        </EdgeLabelRenderer>
      </g>
    </>
  );
};

export default CustomEdge;
