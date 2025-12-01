import { EolCycle } from './endoflifeApi';

export enum Status {
  OK = 'OK',
  WARN = 'WARN',
  ERR = 'ERR',
}

export interface EvaluationResult {
  component: string;
  version: string;
  status: Status;
  message: string;
}

export const evaluateVersion = (
  component: string,
  currentVersion: string,
  eolData: EolCycle[],
): EvaluationResult => {
  const version = currentVersion.replace(/^v/, '');
  const majorVersion = version.split('.')[0];

  // Try to find exact match (e.g. for Ubuntu 22.04) or major version match (e.g. Node 18)
  const cycleData = eolData.find((c) => c.cycle === version || c.cycle === majorVersion);

  if (!cycleData) {
    return {
      component,
      version: currentVersion,
      status: Status.WARN,
      message: `Could not find EOL data for version ${majorVersion}`,
    };
  }

  const now = new Date();
  const eolDate = cycleData.eol === true ? null : new Date(cycleData.eol as string);

  if (typeof cycleData.eol === 'boolean' && cycleData.eol) {
     return {
      component,
      version: currentVersion,
      status: Status.ERR,
      message: `Version ${majorVersion} is EOL`,
    };
  }

  if (eolDate && now > eolDate) {
    return {
      component,
      version: currentVersion,
      status: Status.ERR,
      message: `Version ${majorVersion} is EOL (ended ${cycleData.eol})`,
    };
  }

  if (eolDate) {
    const monthsUntilEol =
      (eolDate.getFullYear() - now.getFullYear()) * 12 +
      (eolDate.getMonth() - now.getMonth());

    if (monthsUntilEol <= 6) {
      return {
        component,
        version: currentVersion,
        status: Status.WARN,
        message: `Version ${majorVersion} is approaching EOL (ends ${cycleData.eol})`,
      };
    }
  }

  return {
    component,
    version: currentVersion,
    status: Status.OK,
    message: `Version ${majorVersion} is supported (ends ${cycleData.eol || 'unknown'})`,
  };
};
