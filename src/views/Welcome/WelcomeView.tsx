import { Box, Divider, List, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material';
import {AppView } from '../../components';
import AppGraph from '../../components/AppGraph';
import { useEffect, useState,  } from 'react';
import { supabase } from '../../api/supabaseClient';
import CircularProgress from '@mui/material/CircularProgress';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import AddIcon from '@mui/icons-material/Add';

const WelcomeView = () => {
  const [graphs, setGraphs] = useState<any>([]);
  const [initalGraph, setInitalGraph] = useState<object>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchGraphs = async () => {
      const { data, error } = await supabase
        .from("graphs") 
        .select("*");

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setGraphs(data);
      setInitalGraph({});
      setLoading(false);
    };
    fetchGraphs();
    
  }, []);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (
    index: number,
    graph:any
  ) => {
    setSelectedIndex(index);
    setInitalGraph(graph);
  };

  const resetGraphs = (data:any) => {
    setGraphs(data);
  }

  return (
    <>
    <Stack sx={{display:'flex', flexDirection:{xs:'column', sm:'column', md:'row'}}}>
    <Box
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      sx={{
        width: { xs: '100%', sm: '100%', md: expanded ? 300 : 50 },
        bgcolor: 'background.paper',
        transition: 'width 0.01s ease',
        overflow: 'hidden',
      }}
    >
      <List component="nav" aria-label="main mailbox folders">
        <ListItemButton
          selected={selectedIndex === 0}
          onClick={(event) => handleListItemClick(0, [])}
          key="0"
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          {expanded && <ListItemText primary="CREATE GRAPH" />}
        </ListItemButton>
      </List>
      <Divider />
      <List component="nav" aria-label="secondary mailbox folder">
        {!loading &&
          graphs.map((graph: any, index: number) => (
            <ListItemButton
              selected={selectedIndex === index + 1}
              onClick={(event) => handleListItemClick(index + 1, graph)}
              key={index}
            >
              <ListItemIcon>
                <LabelImportantIcon />
              </ListItemIcon>
              {expanded && <ListItemText primary={graph.title} />}
            </ListItemButton>
          ))}
      </List>
    </Box>
    {
      loading ? <CircularProgress color="inherit" size={50} sx={{position:'absolute', left:'50%', top: '50%'}}/> : <AppGraph graphData = {initalGraph} resetGraphs = {resetGraphs}/>
    }
    </Stack>
    </>
  );
};

export default WelcomeView;
