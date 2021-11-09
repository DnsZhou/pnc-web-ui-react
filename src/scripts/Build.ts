export enum BuildStatusType {
  ABORTED,
  BUILDING,
  CANCELLED,
  ENQUEUED,
  FAILED,
  NEW,
  NO_REBUILD_REQUIRED,
  REJECTED,
  REJECTED_FAILED_DEPENDENCIES,
  SUCCESS,
  SYSTEM_ERROR,
  UNKNOWN,
  UNSTABLE,
  WAITING_FOR_DEPENDENCIES,
}

export interface Build {
  identifier: string;
  status: BuildStatusType;
  user: string;
  date: Date;
}