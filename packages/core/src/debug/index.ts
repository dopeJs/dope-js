import debug from 'debug';

export type DopeDebugNamespace = `dope:${string}`;

export type DopeDebugger = debug.Debugger['log'];

export function createDebugger(namespace: DopeDebugNamespace): DopeDebugger {
  const log = debug(namespace);

  // const { onlyWhenFocused } = options
  // const focus = typeof onlyWhenFocused === 'string' ? onlyWhenFocused : namespace

  return (msg: string, ...args: unknown[]) => {
    // if (filter && !msg.includes(filter)) {
    //   return
    // }
    // if (onlyWhenFocused && !DEBUG?.includes(focus)) {
    //   return
    // }
    log(msg, ...args);
  };
}
