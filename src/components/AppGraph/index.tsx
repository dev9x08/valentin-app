import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  NodeChange,
  EdgeChange,
  OnConnect,
  Node,
  Edge,
} from "reactflow";
import { Button, TextField, Box, IconButton } from "@mui/material";
import {toast} from 'react-toastify';
import CustomNode from "./CustomNode";
import CustomEdge from "./CustomEdge";
import { replaceNodeName } from "../../utils/helper";
import { Cancel as CancelIcon, Save as SaveIcon } from "@mui/icons-material";
import { supabase } from "../../api/supabaseClient";
import { useCurrentUser } from "../../hooks/authSupabase";
import "reactflow/dist/style.css";

const AppGraph = (props:any) => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const ref = useRef<HTMLInputElement | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  const edgeTypes = useMemo(() => ({ custom_edge: CustomEdge }), []);
  const [graphId, setGraphId] = useState(undefined);


  useEffect(() => {
    const nodeData = props.graphData?.nodes;
    const edgeData = props.graphData?.edges;
    const id = props.graphData?.id;
    if (nodeData){
      setNodes(nodeData);
      setEdges(edgeData);
      setGraphId(id);
    } else {
      setNodes([
        {
          id: "1",
          position: { x: 0, y: 0 },
          data: { label: "Node 1" },
          type: "custom",
        },
      ]);
      setEdges([]);
      setGraphId(undefined);
    }
  }, [props])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach((change) => {
        if (change.type === "select" && change.selected === true) {
          const matchedNode = nodes.find((node) => node.id === change.id);
          setSelectedNode(matchedNode || null);
        }
        if (change.type === "add") {
        }
        if (change.type === "remove") {
        }
        if (change.type === "position") {
        }
      });

      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [nodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (params) => {
      const edge = { ...params, type: "custom_edge" };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const handleCreateNode = () => {
    if (nodes.length === 0) {
      setNodes([
        {
          id: "1",
          position: { x: 0, y: 0 },
          data: { label: "Node 1" },
          type: "custom",
        },
      ]);
      return;
    }

    const lastNode = nodes[nodes.length - 1];
    const id = String(parseInt(lastNode.id) + 1);
    let largestY = 0;
    nodes.forEach((node) => {
      largestY = Math.max(largestY, node.position.y);
    });

    setNodes([
      ...nodes,
      {
        id,
        position: { x: 0, y: largestY + 100 },
        data: { label: "Node " + id },
        type: "custom",
      },
    ]);
  };


  const handleSave = () => {
    if (!ref.current?.value) return;
    const latestNodes = replaceNodeName(
      nodes,
      selectedNode!.id,
      ref.current.value
    );
    setNodes(latestNodes);
    setSelectedNode(null);
  };

  const handleCancel = () => {
    setSelectedNode(null);
  };

  const isSelectedNodeExists =
    nodes && nodes.find((node) => selectedNode && selectedNode.id === node.id);

  const handleGraphSave = async () => {
    console.log(edges,"edges");
    const user = await useCurrentUser();

    if (graphId){
      try {
        const { data: existingGraph, error: selectError } = await supabase
          .from('graphs')
          .select('*')
          .eq('id', graphId)
          .single();
        if (selectError && selectError.code !== 'PGRST116') {
          throw selectError;
        }
        if (existingGraph) {
          const { data, error } = await supabase
            .from('graphs')
            .update({
              user_id: user.id,
              title: "Test Graph",
              nodes: nodes,
              edges: edges,
            })
            .eq('id', graphId);
    
          if (error) {
            throw error;
          }
    
          toast.success('Graph updated successfully!');
        }
      } catch (error) {
        toast.error('Error saving graph data.');
      }
    }
    else {
      const { data, error } = await supabase
        .from('graphs')
        .insert([
          {
            user_id: user.id,
            title: "New Graph",
            nodes: nodes,
            edges: edges,
          },
        ]);

      if (error) {
        throw error;
      }

      toast.success('Graph saved successfully!');
    } 
  }

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative"}}>
      <Button
        onClick={handleCreateNode}
        variant="contained"
        color="primary"
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 50,
        }}
      >
        Create Node
      </Button>
      <Button 
          sx={{
            position: "absolute",
            top: 20,
            left: 160,
            zIndex: 50
          }}
          variant="contained"
          onClick={handleGraphSave}
        >
          Save Graph
      </Button>


      {isSelectedNodeExists && selectedNode && (
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 40,
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            padding: "10px",
            border: "2px solid #ccc",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              label="Node Name"
              variant="outlined"
              size="small"
              value={selectedNode?.data?.label}
              onChange={(e) => {
                setSelectedNode({
                  ...selectedNode,
                  data: { label: e.target.value },
                });
              }}
              inputRef={ref}
              sx={{ marginBottom: "4px" }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton
                color="primary"
                onClick={handleSave}
                sx={{ marginRight: "8px" }}
              >
                <SaveIcon />
              </IconButton>
              <IconButton color="secondary" onClick={handleCancel}>
                <CancelIcon />
              </IconButton>
            </Box>
          </Box>
      </Box>
      )}
      <Box sx={{height:{xs:'70vh', sm:'70vh', md:'90vh'}}}>
        <ReactFlow
          className="absolute z-0 bg-slate-100 text-black"
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </Box>
    </Box>
  );
};

export default AppGraph;
