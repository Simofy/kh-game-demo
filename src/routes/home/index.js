import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import { ApiRoutes, handleGetAPI } from '../../apis';
import Grid from './components/Grid';

const GlobalStyle = createGlobalStyle`
  html, body {
    padding: 0;
    width: 100vw;
    height: 100vh;
    margin: 0;
    position: fixed;
  }
`;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const Home = () => {
  const [data, setData] = useState([]);
  const savedState = useMemo(
    () => ({
      updated: 0,
    }),
    [],
  );
  const handleUpdate = useCallback(() => {
    handleGetAPI(ApiRoutes.getBoard, {
      x: 0,
      y: 0,
      w: 10000,
      h: 10000,
    }).then((newData) => setData(newData));
  }, []);
  const updateTable = useCallback(() => {
    handleGetAPI(ApiRoutes.getStatus)
      .then(([{ update }]) => {
        if (savedState.updated !== update) {
          savedState.updated = update;
          handleUpdate();
        }
      })
      .catch(() => null);
  }, []);
  useEffect(() => {
    setInterval(updateTable, 100);
  }, []);

  return (
    <>
      <Grid data={data} />
      <GlobalStyle />
    </>
  );
};

Home.displayName = 'Home';
