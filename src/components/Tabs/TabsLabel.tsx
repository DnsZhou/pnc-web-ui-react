import { Label, Tooltip } from '@patternfly/react-core';
import { PropsWithChildren } from 'react';

import { IServiceContainer } from 'hooks/useServiceContainer';

import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

interface ITabsLabelProps {
  serviceContainer: IServiceContainer;
  title: string;
  tooltip: string;
}

export const TabsLabel = ({ serviceContainer, title, tooltip, children }: PropsWithChildren<ITabsLabelProps>) => {
  return (
    <Tooltip content={tooltip}>
      <Label>
        <ServiceContainerLoading loadingDelayMilliseconds={0} {...serviceContainer} variant="inline" title={title}>
          {children}
        </ServiceContainerLoading>
      </Label>
    </Tooltip>
  );
};
