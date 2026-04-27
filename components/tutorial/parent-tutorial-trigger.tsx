'use client'

import { useEffect, useState } from 'react'
import { isParentTutorialDone, markParentTutorialDone } from '@/lib/tutorial/storage'
import TutorialOverlay from './tutorial-overlay'
import { parentSteps } from './parent-steps'

interface Props {
  userId: string
}

export default function ParentTutorialTrigger({ userId }: Props) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!isParentTutorialDone(userId)) setActive(true)
  }, [userId])

  function finish() {
    markParentTutorialDone(userId)
    setActive(false)
  }

  if (!active) return null
  return <TutorialOverlay steps={parentSteps} onComplete={finish} onSkip={finish} />
}
