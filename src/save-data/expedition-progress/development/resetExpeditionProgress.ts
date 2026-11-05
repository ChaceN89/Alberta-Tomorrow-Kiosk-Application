/**
  File: resetExpeditionProgress.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Clear persisted expedition progress and reset its in-memory state.

  Usage:
  - Called by the expedition progress provider's developer-only reset action.

  Notes:
  - Reset state is updated even if the repository cannot clear persisted data.
 */
// Clear persisted progress before resetting the provider's in-memory state.
export async function resetExpeditionProgress(
  clearStorage: () => Promise<boolean>,
  resetState: (storageAvailable: boolean) => void,
): Promise<void> {
  resetState(await clearStorage())
}
