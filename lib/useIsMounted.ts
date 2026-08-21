// Claude assisted
import { useSyncExternalStore } from "react";

export default function useIsMounted() {
   return useSyncExternalStore(
      () => () => {}, // subscribe: no-op, "mounted" never changes after first client render
      () => true, // getSnapshot: client always returns true
      () => false, // getServerSnapshot: server always returns false
   );
}
