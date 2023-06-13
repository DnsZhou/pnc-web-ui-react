import { AxiosRequestConfig } from 'axios';

import { pncClient } from './pncClient';

export interface IGroupBuildStartParams {
  id: string;
  temporaryBuild?: boolean;
  rebuildMode?: string;
  alignmentPreference?: string;
}

/**
 * Triggers a Group Build of a specific Group Config.
 *
 * @param groupBuildStartParams - Object containing parameters to start a Group Build
 * @param requestConfig - Axios based request config
 */
export const build = (
  { groupBuildStartParams }: { groupBuildStartParams: IGroupBuildStartParams },
  requestConfig: AxiosRequestConfig = {}
) => {
  requestConfig.params = groupBuildStartParams;
  return pncClient
    .getHttpClient()
    .post<IGroupBuildStartParams>(`/group-configs/${groupBuildStartParams.id}/build`, null, requestConfig);
};
