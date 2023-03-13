import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { leftPadPixelMap, messageToPixelMap, rightPadPixelMapToWidth, scalePixelMap, verticallyCenterPixelMap } from './letter';

const PIXEL_SIZE = 8;

const SCROLL_DELAY_MS = 60;

const GRID_WIDTH = 62;
const GRID_HEIGHT = 27;

function slicePixelMap(pixelMap, offset) {
  return rightPadPixelMapToWidth(pixelMap.map(row => row.slice(offset, offset + GRID_WIDTH)), GRID_WIDTH);
}

export const TrainCrawl: React.FC = () => {
  const scrollOffset = useRef(0);
  const [messageOffset, setMessageOffset] = useState(0);
  const pendingSongInfo = useRef(null);

  const messageList = useMemo(() => {
    const params = (new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop as string),
    }) as unknown) as Record<string, string>; 

    
    const baseList = [...(params.messages?.split(/\|/g) ?? ['Please stand by.'])];

    return baseList.reduce((acc, item) => [...acc, 'Please stand by.', item], [] as string[]);
  }, [window.location.search]);
  
  const activeMessageMap = useMemo(() => {    

    return leftPadPixelMap(verticallyCenterPixelMap(rightPadPixelMapToWidth(scalePixelMap(messageToPixelMap(messageList[messageOffset]), 1), GRID_WIDTH), GRID_HEIGHT), GRID_WIDTH);
  }, [messageList, messageOffset]);

  const [activeMessageSubsection, setActiveMessageSubsection] = useState(slicePixelMap(activeMessageMap, scrollOffset.current));

  useEffect(() => {
    const updateFrame = () => {
      scrollOffset.current = scrollOffset.current + 1;

      if (scrollOffset.current > activeMessageMap[0].length) {
        scrollOffset.current = 0;
        setMessageOffset((messageOffset + 1) % messageList.length);

        if (pendingSongInfo.current !== null) {
          setMessageOffset(0);

          pendingSongInfo.current = null;
        }
      }

      setActiveMessageSubsection(slicePixelMap(activeMessageMap, scrollOffset.current))
    };

    const intervalId = setInterval(updateFrame, SCROLL_DELAY_MS);

    updateFrame();

    return () => {
      clearTimeout(intervalId);
    };
  }, [activeMessageMap, messageList]);
  
  return (
    <div>
      <MatrixContainer>
        <Matrix>
          {activeMessageSubsection.map((rowMap, y) => (
            rowMap.map((active, x) => (
              <Pixel key={`(${x}, ${y})`} active={active} />
            ))
          ))}
        </Matrix>
      </MatrixContainer>
    </div>
  );
};

const MatrixContainer = styled.div`
  position: absolute;
  display: flex;
  top: 16px;
  left: 16px;
  width: 623px;
  height: 273px;
  justify-content: center;
  align-items: center;
`;

const Matrix = styled.div`
  display: grid;
  grid-template-columns: repeat(${GRID_WIDTH}, ${PIXEL_SIZE}px);
  grid-template-rows: repeat(${GRID_HEIGHT}, ${PIXEL_SIZE}px);
  grid-gap: 2px;

`;

const Pixel = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${props => props.active ? '#e18039' : '#1a1a1a'};
`;