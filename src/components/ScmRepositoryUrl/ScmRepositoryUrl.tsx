import { Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

import { CopyToClipboard } from 'components/CopyToClipboard/CopyToClipboard';
import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import { parseInternalRepositoryUrl } from 'utils/utils';

interface IGerritButtonProps {
  url: string;
  isInline?: boolean;
}

/**
 * The Gerrit button that redirect to specific Gerrit page.
 *
 * @param url - the internal/external url for the SCM Repository
 * @param isInline - whether to use inline style with external link action
 */
const GerritButton = ({ isInline, url }: IGerritButtonProps) => (
  <TooltipWrapper tooltip="View in Gerrit">
    <Button
      component="a"
      href={parseInternalRepositoryUrl({ internalUrl: url })}
      target="_blank"
      rel="noopener noreferrer"
      variant={isInline ? 'plain' : 'tertiary'}
      icon={<ExternalLinkAltIcon />}
    >
      {isInline ? <ExternalLinkAltIcon /> : 'Gerrit'}
    </Button>
  </TooltipWrapper>
);

interface IScmRepositoryUrlProps {
  url: string;
  showGerritButton?: boolean;
  isInline?: boolean;
}

/**
 * Represents the internal/external URL for the SCM Repository.
 *
 * @param url - the internal/external url for the SCM Repository
 * @param showGerritButton - whether to display the Gerrit button
 * @param isInline - whether to use inline style with external link action
 */
export const ScmRepositoryUrl = ({ url, showGerritButton, isInline }: IScmRepositoryUrlProps) => {
  return (
    <CopyToClipboard isInline={isInline} suffixComponent={showGerritButton && <GerritButton isInline={isInline} url={url} />}>
      {url}
    </CopyToClipboard>
  );
};