import React, { useCallback, useEffect, useMemo } from 'react';
import GridComponent from '../../../../styledComponents/GridComponent';
import { ApiRoutes, handlePostAPI } from '../../../../apis';
import Cell from './Cell';
import { boardDataType } from '../../../../types/boardTypes';

const Grid = ({ data }: { data: boardDataType }): JSX.Element => {
  const savedLastCell = useMemo<{
    lastId?: string | null;
  }>(
    () => ({
      lastId: null,
    }),
    [],
  );
  const storage = useMemo<{
    keyCode: string | null;
  }>(
    () => ({
      keyCode: null,
    }),
    [],
  );
  const updateBoard = useCallback((x, y) => {
    handlePostAPI(ApiRoutes.getBoard, {
      x,
      y,
      name: 'Alio valio',
      color: `#${(((1 << 24) * Math.random()) | 0).toString(16)}`,
      data: savedLastCell.lastId
        ? {
            from: savedLastCell.lastId,
            color: `#${(((1 << 24) * Math.random()) | 0).toString(16)}`,
          }
        : null,
    }).then(({ id }) => {
      savedLastCell.lastId = id;
      console.log(id);
    });
  }, []);
  useEffect(() => {
    /*
     * An infinite grid for any type of editor requiring some kind of visual aid by grid.
     * Hold down mouse to drag the grid.
     * Use scrolling for zooming in and out.
     */
    document.addEventListener('keydown', (e) => {
      storage.keyCode = e.key;
    });
    document.addEventListener('keyup', () => {
      storage.keyCode = null;
    });
    const translate = {
      scale: 1,
      translateX: 0,
      translateY: 0,
    } as { [key: string]: number };
    let panning = false;
    const pinnedMousePosition = { x: 0, y: 0 };
    const pinnedGridPosition = { x: 0, y: 0 };

    const doGrid = () => {
      document.addEventListener('wheel', (event) => {
        translate.scale += event.deltaY * (translate.scale / 5000);
        if (translate.scale > 3) {
          translate.scale = 3;
        }
        if (translate.scale < 0.4) {
          translate.scale = 0.4;
        }
        update();
      });

      document.addEventListener('mousedown', (event) => {
        if (storage.keyCode === ' ') {
          panning = false;
          const { x, y } = window.convertPointFromPageToNode(
            document.body,
            event.clientX,
            event.clientY,
          );
          console.log(x, y);
          updateBoard(x, y);
        } else {
          pinnedGridPosition.x = translate.translateX;
          pinnedGridPosition.y = translate.translateY;
          pinnedMousePosition.x = event.clientX;
          pinnedMousePosition.y = event.clientY;
          panning = true;
        }
      });

      document.addEventListener('mouseup', () => {
        panning = false;
      });

      document.addEventListener('mousemove', (event) => {
        if (panning) {
          const diffX = (event.clientX - pinnedMousePosition.x) / translate.scale;
          const diffY = (event.clientY - pinnedMousePosition.y) / translate.scale;
          translate.translateX = pinnedGridPosition.x + diffX;
          translate.translateY = pinnedGridPosition.y + diffY;
          update();
        }
      });

      const update = () => {
        let transform = '';
        Object.keys(translate).forEach((property) => {
          transform +=
            property +
            '(' +
            translate[property] +
            (property !== 'scale' ? 'px' : '') +
            ') ';
        });
        // document.body.style.transform = transform.trim();

        const vars = {
          a: 9 * translate.scale,
          b: 10 * translate.scale,
          c: -0.5 * translate.scale,
          d: translate.scale,
          e: 99.5 * translate.scale,
          f: 100 * translate.scale,
        };
        const backgroundPosition = document.body.getBoundingClientRect();
        const colors = { a: 57, b: 75, c: 80 };

        const background = `
        transform: ${transform.trim()};
        background: repeating-linear-gradient(
0deg,
transparent 0,
transparent ${vars.a}px,
rgb(${colors.b}, ${colors.b}, ${colors.b}) ${vars.a}px,
rgb(${colors.b}, ${colors.b}, ${colors.b}) ${vars.b}px
) 
${backgroundPosition.x}px ${backgroundPosition.y}px / ${vars.f}px ${vars.f}px repeat,
repeating-linear-gradient(
90deg,
transparent 0,
transparent ${vars.a}px,
rgb(${colors.b}, ${colors.b}, ${colors.b}) ${vars.a}px,
rgb(${colors.b}, ${colors.b}, ${colors.b}) ${vars.b}px
) 
${backgroundPosition.x}px ${backgroundPosition.y}px / ${vars.f}px ${vars.f}px repeat,
repeating-linear-gradient(
0deg,
rgb(${colors.c}, ${colors.c}, ${colors.c}) ${vars.c}px,
rgb(${colors.c}, ${colors.c}, ${colors.c}) ${vars.d}px,
transparent ${vars.d}px,
transparent ${vars.e}px
) 
${backgroundPosition.x}px ${backgroundPosition.y}px /  ${vars.f}px ${vars.f}px repeat,
repeating-linear-gradient(
90deg,
rgb(${colors.c}, ${colors.c}, ${colors.c}) ${vars.c}px,
rgb(${colors.c}, ${colors.c}, ${colors.c}) ${vars.d}px,
transparent ${vars.d}px,
transparent ${vars.e}px
) 
${backgroundPosition.x}px ${backgroundPosition.y}px /  ${vars.f}px ${vars.f}px repeat,
rgb(${colors.a}, ${colors.a}, ${colors.a});
`;
        document.body.setAttribute('style', background);
      };

      update();
    };

    doGrid();
  }, []);
  return (
    <GridComponent>
      {data.map(({ x, y, _id: id, data: { color, data } }) => (
        <Cell key={`pos_${x}_${y}`} color={color} x={x} y={y} data={data} id={id} />
      ))}
    </GridComponent>
  );
};

export default Grid;
