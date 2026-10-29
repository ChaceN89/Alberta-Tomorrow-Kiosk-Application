/**
  File: useAudioPlayer.ts | Author: Chace Nielson
  Date Created: Oct 28, 2026
  Date Updated: Oct 29, 2026

  Description:
  - Provide the consumer hook for the shared media player.
  - Modules call playTrack with typed media data and optional start/end callbacks.

  Usage:
  - Modules and module tools call useAudioPlayer; AudioPlayerProvider supplies the value.

  Notes:
  - Track and queue types live in provider/types.ts.
 */
import { useContext } from 'react'
import { AudioPlayerContext } from '../provider/AudioPlayerContext'

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext)

  if (!context) {
    throw new Error(
      'useAudioPlayer must be used within an AudioPlayerProvider.',
    )
  }

  return context
}
