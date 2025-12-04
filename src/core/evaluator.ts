import { EolCycle } from './endoflifeApi';

export enum Status {
  OK = 'OK',
  WARN = 'WARN',
  ERR = 'ERR',
}

export enum Category {
  RUNTIME = 'Runtime Environment',
  OS = 'Operating System',
  SERVICE = 'System Services',
  DEPENDENCY = 'Project Dependencies',
}

export interface EvaluationResult {
  component: string;
  version: string;
  status: Status;
  message: string;
  category?: Category;
}

export function evaluateVersion(
  component: string,
  rawVersion: string,
  eolData: EolCycle[],
): EvaluationResult {
  const version = rawVersion.replace(/^v/, '');
  
  // Debug log
  // console.log(`Evaluating ${component} version ${version}`);

  // 1. Try exact match
  let cycle = eolData.find((c) => c.cycle === version);

  // 2. Try matching major.minor (e.g. "4.2.0" -> "4.2")
  if (!cycle) {
    const parts = version.split('.');
    if (parts.length >= 2) {
      const majorMinor = `${parts[0]}.${parts[1]}`;
      cycle = eolData.find((c) => c.cycle === majorMinor);
    }
  }

  // 3. Try matching major version (e.g. "18.14.0" -> "18")
  if (!cycle) {
    const major = version.split('.')[0];
    cycle = eolData.find((c) => c.cycle === major);
  }

  if (!cycle) {
    const availableVersions = eolData.slice(0, 5).map(c => c.cycle).join(', ');
    return {
      component,
      version,
      status: Status.WARN,
      message: `Version ${version} not found. Available versions include: ${availableVersions}${eolData.length > 5 ? ', ...' : ''}`,
    };
  }

  const now = new Date();
  const eolDate =
    typeof cycle.eol === 'string' ? new Date(cycle.eol) : null;
  const isEolBoolean = typeof cycle.eol === 'boolean' && cycle.eol === true;

  if (isEolBoolean) {
    return {
      component,
      version,
      status: Status.ERR,
      message: `Version ${cycle.cycle} is EOL`,
    };
  }

  if (eolDate && now > eolDate) {
    return {
      component,
      version,
      status: Status.ERR,
      message: `Version ${cycle.cycle} is EOL (ended ${cycle.eol})`,
    };
  }

  if (eolDate) {
    const monthsUntilEol =
      (eolDate.getFullYear() - now.getFullYear()) * 12 +
      (eolDate.getMonth() - now.getMonth());

    if (monthsUntilEol <= 6) {
      return {
        component,
        version,
        status: Status.WARN,
        message: `Version ${cycle.cycle} is approaching EOL (ends ${cycle.eol})`,
      };
    }
  }

  return {
    component,
    version,
    status: Status.OK,
    message: `Version ${cycle.cycle} is supported (ends ${cycle.eol || 'unknown'})`,
  };
}
