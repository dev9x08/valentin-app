export const replaceNodeName = (nodes: any[], id: any, newNodeName: any) => {
  const updatedNodes: any[] = [];
  nodes.forEach((node: { id: any; }) => {
    if (node.id === id) {
      updatedNodes.push({ ...node, data: { label: newNodeName } });
    } else {
      updatedNodes.push(node);
    }
  });
  return updatedNodes;
};
