declare interface Window {
  convertPointFromNodeToPage: () => number;
  convertPointFromPageToNode: (
    element,
    pageX,
    pageY,
  ) => {
    x: string;
    y: string;
    z: string;
  };
}
