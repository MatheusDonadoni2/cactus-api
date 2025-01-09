interface IStatusDependenciesDatabase {
  version: number;
  max_connections: number;
  opened_connections: number;
}

interface IStatusDependencies {
  database: IStatusDependenciesDatabase;
}

interface IStatus {
  updated_at: string;
  dependencies: IStatusDependencies;
}

export class Status {
  protected props: IStatus;

  constructor(props: IStatus) {
    this.props = props;
  }

  getUpdatedAt() {
    return this.props.updated_at;
  }

  getDependencies() {
    return this.props.dependencies;
  }
}
