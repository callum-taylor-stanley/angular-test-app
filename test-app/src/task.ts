export interface Task {
    id: number;
    description: string;
    status: Status;
}

export enum Status {
    TO_DO,
    IN_PROGRESS,
    DONE
  }