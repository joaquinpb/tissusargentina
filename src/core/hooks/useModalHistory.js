import { useEffect, useId, useRef } from 'react'

export function useModalHistory(isOpen, onClose) {
  const modalId = useId()
  const isPopStateClose = useRef(false)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const handlePopState = (event) => {
      if (!isOpen) return
      const currentStateId = event.state?.modalId
      if (currentStateId !== modalId) {
        isPopStateClose.current = true
        onCloseRef.current()
      }
    }

    if (isOpen) {
      isPopStateClose.current = false
      if (!window.history.state || window.history.state.modalId !== modalId) {
        window.history.pushState({ modalId }, '')
      }
      window.addEventListener('popstate', handlePopState)
    }

    return () => {
      window.removeEventListener('popstate', handlePopState)
      if (isOpen && !isPopStateClose.current && window.history.state?.modalId === modalId) {
        window.history.back()
      }
    }
  }, [isOpen, modalId])
}
