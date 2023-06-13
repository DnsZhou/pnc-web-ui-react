import { Build } from 'pnc-api-types-ts';

import { IEntityAttributes } from 'common/entityAttributes';

const statusValues: Build['status'][] = [
  'SUCCESS',
  'FAILED',
  'NO_REBUILD_REQUIRED',
  'ENQUEUED',
  'WAITING_FOR_DEPENDENCIES',
  'BUILDING',
  'REJECTED',
  'REJECTED_FAILED_DEPENDENCIES',
  'CANCELLED',
  'SYSTEM_ERROR',
  'NEW',
];

interface IExtendedBuild extends Build {
  buildConfigName: any; // filtering only
  name: any; // derived from build and buildConfig
  'user.username': any;
}

export const buildEntityAttributes = {
  id: {
    id: 'id',
    title: 'ID',
  },
  buildConfigName: {
    id: 'buildConfigName',
    title: 'Build Config Name',
    filter: {
      operator: '=like=',
      isCustomParam: true,
    },
  },
  status: {
    id: 'status',
    title: 'Status',
    values: statusValues,
    filter: {
      operator: '==',
    },
  },
  temporaryBuild: {
    id: 'temporaryBuild',
    title: 'Temporary Build',
    values: ['TRUE', 'FALSE'],
    filter: {
      operator: '==',
    },
  },
  'user.username': {
    id: 'user.username',
    title: 'User',
    filter: {
      operator: '=like=',
    },
  },
  name: {
    id: 'name',
    title: 'Name',
  },
  submitTime: {
    id: 'submitTime',
    title: 'Submitted',
  },
  startTime: {
    id: 'startTime',
    title: 'Started',
  },
  endTime: {
    id: 'endTime',
    title: 'Ended',
  },
} as const satisfies IEntityAttributes<IExtendedBuild>;