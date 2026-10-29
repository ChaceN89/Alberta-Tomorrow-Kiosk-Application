/**
  File: resetExpeditionProgress.ts | Author: Chace Nielson
  Date Created: Oct 29, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Clear persisted expedition progress and reset its in-memory state.

  Usage:
  - Called by the expedition progress provider.

  Notes:
  - None.
 */
// Clear persisted progress and reset the provider's in-memory state.
export function resetExpeditionProgress(
  clearStorage: () => boolean,
  resetState: (storageAvailable: boolean) => void,
): void {
  resetState(clearStorage())
}
