import { Button, Switch, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import { LongArrowAltDownIcon, LongArrowAltUpIcon, OutlinedPlayCircleIcon } from '@patternfly/react-icons';
import { LogViewer as LogViewerPF } from '@patternfly/react-log-viewer';
import { ReactNode, useEffect, useRef, useState } from 'react';

import { StorageKeys } from 'common/constants';

interface ILogViewerProps {
  isStatic?: boolean;
  data: string | string[];
  customActions?: ReactNode[];
}

interface IOnScrollProps {
  scrollOffsetToBottom: number;
  scrollUpdateWasRequested: boolean;
}

/**
 * Log viewer component to display logs.
 * Log viewer is considered to be paused when it is not scrolled to the bottom.
 * Whe log viewer is paused, data are not rendered (but still stored). When paused, 'resume' button will appear so user can scroll to the bottom.
 * Resume button also displays number of lines not rendered (if any).
 * After scrolling to the bottom, all data not rendered yet will be rendered.
 *
 * User can use 'Top' button to scroll to the top and 'Bottom' button to scroll to the bottom.
 * There is also a switch, which can be used to change default 'follow' value.
 * When log viewer is following and new data are inputted, log viewer will automatically scroll to the bottom.
 *
 * See an example use {@link DemoPage}
 *
 * @example
 * ```tsx
 * <LogViewer data={logData} follow={false} />
 * ```
 *
 * @param isStatic - true for static variant if whole log is available at once, false for live variant for dynamically loaded log lines
 * @param data - data log viewer will render
 */
export const LogViewer = ({ isStatic = false, data, customActions }: ILogViewerProps) => {
  const logViewerRef = useRef<any>();

  // data that are actually rendered
  const [renderedData, setRenderedData] = useState(data);
  // is log viewer currently following new data input?
  const [isFollowing, setIsFollowing] = useState<boolean>();
  // are lines wrapped?
  const [areLinesWrapped, setAreLinesWrapped] = useState<boolean>();
  // is log viewer paused? (data are still stored, but not rendered)
  const [isPaused, setIsPaused] = useState(true);
  // count of rendered lines
  // is assigned to 'scrollToRow' only if log viewer is paused (so no automatic scrolling happens when paused)
  const [lineCount, setLineCount] = useState(0);
  // if paused, how many lines were not rendered?
  const [linesBehind, setLinesBehind] = useState(0);

  useEffect(() => {
    const shouldFollow = window.localStorage.getItem(StorageKeys.isLogViewerFollowingNewContent) === 'true';
    const shouldWrap = window.localStorage.getItem(StorageKeys.isLogViewerContentWrapped) === 'true';
    setIsFollowing(shouldFollow);
    setAreLinesWrapped(shouldWrap);
  }, []);

  useEffect(() => {
    if ((!isPaused || isStatic) && data.length > 0) {
      setLineCount(data.length);
      setRenderedData(data);
      if (!isStatic) {
        logViewerRef?.current?.scrollToBottom();
      }
    }
  }, [isPaused, data, isStatic]);

  useEffect(() => {
    setLinesBehind(data.length - lineCount);
  }, [data.length, lineCount]);

  useEffect(() => {
    if (isFollowing) {
      setIsPaused(false);
    }
  }, [isFollowing, data]);

  const onScroll = ({ scrollOffsetToBottom, scrollUpdateWasRequested }: IOnScrollProps) => {
    if (!scrollUpdateWasRequested) {
      if (scrollOffsetToBottom > 0) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    }
  };

  const HeaderToolbar = () => (
    <Toolbar>
      <ToolbarContent>
        <ToolbarItem>
          <Button
            onClick={() => {
              if (logViewerRef.current?.state.scrollOffset) {
                setIsPaused(true);
                logViewerRef.current.scrollTo(0, 0);
              }
            }}
            variant="control"
            icon={<LongArrowAltUpIcon />}
          >
            Top
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button
            onClick={() => {
              setIsPaused(false);
              logViewerRef.current?.scrollToItem(lineCount);
            }}
            variant="control"
            icon={<LongArrowAltDownIcon />}
          >
            Bottom
          </Button>
        </ToolbarItem>
        {!!customActions?.length && customActions.map((node, index) => <ToolbarItem key={index}>{node}</ToolbarItem>)}
        {!isStatic && (
          <ToolbarItem>
            <Switch
              label="Force Following"
              isChecked={isFollowing}
              onChange={(_, checked) => {
                setIsFollowing(checked);
                window.localStorage.setItem(StorageKeys.isLogViewerFollowingNewContent, `${checked}`);
              }}
            />
          </ToolbarItem>
        )}
        <ToolbarItem>
          <Switch
            label="Wrap Lines"
            isChecked={areLinesWrapped}
            onChange={(_, checked) => {
              setIsPaused(true);
              setAreLinesWrapped(checked);
              window.localStorage.setItem(StorageKeys.isLogViewerContentWrapped, `${checked}`);
            }}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );

  const FooterButton = () => (
    <Button onClick={() => setIsPaused(false)} isBlock icon={<OutlinedPlayCircleIcon />}>
      resume {linesBehind === 0 ? null : `and show ${linesBehind} lines`}
    </Button>
  );

  return (
    <LogViewerPF
      innerRef={logViewerRef}
      data={renderedData}
      scrollToRow={(!isPaused || isFollowing) && !isStatic ? lineCount : 0}
      onScroll={onScroll}
      toolbar={<HeaderToolbar />}
      footer={isPaused && !!linesBehind && <FooterButton />}
      isTextWrapped={areLinesWrapped}
    />
  );
};
