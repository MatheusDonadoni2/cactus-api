interface IStatusDependenciesDatabase {
  version: number;
  max_connections: number;
  opened_connections: number;
}

interface IStatusDependencies {
  database: IStatusDependenciesDatabase;
}

export interface IStatus {
  updated_at: string;
  dependencies: IStatusDependencies;
}

export class Status {
  protected props: IStatus;

  constructor(props: IStatus) {
    this.props = props;
  }

  setUpdatedAt(value: string) {
    this.props.updated_at = value;
  }

  getUpdatedAt() {
    return this.props.updated_at;
  }

  getDependencies() {
    return this.props.dependencies;
  }
}
