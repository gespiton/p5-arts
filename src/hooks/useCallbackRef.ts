import { useCallback, useState } from 'react';
import { useCallbackRef } from 'use-callback-ref';

export function useRefWithUpdate<T>() {
  const [, forceUpdate] = useState<number>();
  const forceUpdateFn = useCallback(() => {
    forceUpdate(Math.random());
  }, [forceUpdate]);
  const ref = useCallbackRef<T>(null, forceUpdateFn);
  return ref;
}
