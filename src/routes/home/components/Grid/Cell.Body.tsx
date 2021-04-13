/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react';
import { ApiRoutes, handleGetAPI } from '../../../../apis';
import CellComponent from '../../../../styledComponents/CellComponent';

const Cell = ({
  x,
  y,
  color,
  id,
  data,
}: {
  x: number;
  y: number;
  id: string;
  color: string;
  data?: {
    from: string;
    color: string;
  };
}): JSX.Element => {
  const [lineSVG, setLineSVG] = useState<JSX.Element | null>(null);
  useEffect(() => {
    if (data) {
      const { color: lineColor, from: fromId } = data;
      handleGetAPI(ApiRoutes.getCell, {
        id: fromId,
      }).then(([data]) => {
        if (data) {
          const { x: lineOriginX, y: lineOriginY } = data;
          setLineSVG(
            <svg
              style={{
                overflow: 'visible',
                position: 'fixed',
                top: 0,
                left: 0,
              }}
            >
              <line
                x1={lineOriginX}
                y1={lineOriginY}
                x2={x}
                y2={y}
                //@ts-ignore
                style={{ stroke: lineColor, 'stroke-width': 10 }}
              />
            </svg>,
          );
        }
      });
    }
  }, []);
  return (
    <>
      {lineSVG}
      <CellComponent
        id={id}
        style={{
          left: `${x}px`,
          top: `${y}px`,
          background: color,
        }}
      />
    </>
  );
};

export default Cell;
