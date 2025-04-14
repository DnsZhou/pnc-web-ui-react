import { AxiosRequestConfig } from 'axios';

import { ArtifactPage, DeliverableAnalyzerReport } from 'pnc-api-types-ts';

import { pncClient } from 'services/pncClient';

interface IDeliverableAnalysisReportApiData {
  id: string;
}

/**
 * Gets a Deliverable Analysis report.
 *
 * @param serviceData - object containing:
 *  - id - Deliverable Analysis ID
 * @param requestConfig - Axios based request config
 */
export const getDeliverableAnalysisReport = (
  { id }: IDeliverableAnalysisReportApiData,
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().get<DeliverableAnalyzerReport>(`/deliverable-analyses/${id}`, requestConfig);
};

/**
 * Gets analyzed artifacts of a Deliverable Analysis report.
 *
 * @param serviceData - object containing:
 *  - id - Deliverable Analysis ID
 * @param requestConfig - Axios based request config
 */
export const getAnalyzedArtifacts = ({ id }: IDeliverableAnalysisReportApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<ArtifactPage>(`/deliverable-analyses/${id}/analyzed-artifacts`, requestConfig);
};
