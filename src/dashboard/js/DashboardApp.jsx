import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useReplicant } from '../../utils/hooks';

const NODECG_BUNDLE = 'nodecg-bonus-time-viewer';

const DEFAULT_RUNNER_BLOCK = {
  name: '',
  bonusSeconds: 0,
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds - (minutes * 60);

  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

const RunnerBlock = ({ replicantName }) => {
  const [data, setData] = useReplicant(replicantName, { ...DEFAULT_RUNNER_BLOCK }, { namespace: NODECG_BUNDLE });
  const [otherTimeValue, setOtherTimeValue] = useState(0);

  const handleNameChange = useCallback(event => {
    setData({
      ...data,
      name: event.target.value,
    });
  }, [data, setData]);

  const addTime = useCallback(amount => {
    setData({
      ...data,
      bonusSeconds: data.bonusSeconds + amount,
    });
  }, [data, setData]);

  const handleAddOtherTime = useCallback(() => {
    addTime(otherTimeValue);
    setOtherTimeValue(0);
  }, [addTime, setOtherTimeValue, otherTimeValue]);

  const handleSetOtherTimeValue = useCallback(event => {
    setOtherTimeValue(Number(event.target.value));
  }, [setOtherTimeValue]);

  const handleReset = useCallback(() => {
    setData({ ...DEFAULT_RUNNER_BLOCK });
  }, [setData]);

  return (
    <RunnerBlockContainer>
      <RunnerName defaultValue={data.name} onChange={handleNameChange} placeholder="Runner" />
      <RunnerTime>{formatTime(data.bonusSeconds)}</RunnerTime>
      <TimeControls>
        <TimeControlsRow>
          <TimeControlButton onClick={() => addTime(1)}>+1</TimeControlButton>
          <TimeControlButton onClick={() => addTime(5)}>+5</TimeControlButton>
          <TimeControlButton onClick={() => addTime(10)}>+10</TimeControlButton>
        </TimeControlsRow>
        <TimeControlsRow>
          <TimeControlButton onClick={() => addTime(20)}>+20</TimeControlButton>
          <TimeControlButton onClick={() => addTime(30)}>+30</TimeControlButton>
          <TimeControlButton onClick={() => addTime(40)}>+40</TimeControlButton>
        </TimeControlsRow>
        <OtherTimeControl>
          <OtherTimeInput type="number" defaultValue={otherTimeValue} onChange={handleSetOtherTimeValue}/>
          <TimeControlButton onClick={handleAddOtherTime}>Add</TimeControlButton>
        </OtherTimeControl>
      </TimeControls>
      <GlobalControls>
        <GlobalControlButton onClick={handleReset}>Reset</GlobalControlButton>
      </GlobalControls>
    </RunnerBlockContainer>
  );
}

export const DashboardApp = () => {
 
  return (
    <Container>
      <RunnerBlock replicantName="runner1" />
      <RunnerBlock replicantName="runner2" />
    </Container>
  )
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 50%);
  grid-gap: 0.5rem;
`;

const RunnerBlockContainer = styled.div`
  display: flex;
  flex-direction: column;  
`;

const RunnerName = styled.input`
  background-color: transparent;
  border: none;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.5);
  font-size: 1.5rem;
  color: #fff;
`;

const RunnerTime = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
  color: #0f0;
  font-size: 1.5rem;
`;

const TimeControls = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  padding-top: 0.5rem;
`;

const TimeControlsRow = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  & + & {
    margin-top: 0.25rem;
  }
`;

const TimeControlButton = styled.button`
  border: none;
  font-family: inherit;
  border-radius: 0.25rem;
  background-color: #006700;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  color: #fff;
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,.2),0px 4px 5px 0px rgba(0,0,0,.14),0px 1px 10px 0px rgba(0,0,0,.12);
  transition: 150ms ease-in-out background-color;
  cursor: pointer;

  & + & {
    margin-left: 0.25rem;
  }

  &:hover {
    background-color: #00aa00;
  }
`;

const OtherTimeControl = styled.div`
  display: grid;
  padding: 0 0.25rem;
  grid-template-columns: 1fr max-content;
  grid-gap: 0.25rem;
  margin-top: 0.25rem;
`

const OtherTimeInput = styled.input`
  font-family: inherit;
  min-width: 0;
  max-width: 100%;
`;

const GlobalControls = styled(TimeControls)`
  grid-column: 1 / -1;
`;

const GlobalControlButton = styled(TimeControlButton)`
  background-color: #444;

  &:hover {
    background-color: #666;
  }
`;