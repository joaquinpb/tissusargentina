import React, { createContext, useContext, useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/core/components/ui/dialog'
import { Button } from '@/core/components/ui/button'
import { useModalHistory } from '@/core/hooks/useModalHistory'

const ConfirmContext = createContext()

export const ConfirmProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState(null)

  const confirm = useCallback(({
    title = 'Atención',
    description = '¿Estás seguro?',
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
    variant = 'default',
  }) => {
    return new Promise((resolve) => {
      setConfirmState({ title, description, confirmText, cancelText, variant, resolve })
    })
  }, [])

  const handleClose = () => {
    if (confirmState) {
      confirmState.resolve(false)
      setConfirmState(null)
    }
  }

  const handleConfirm = () => {
    if (confirmState) {
      confirmState.resolve(true)
      setConfirmState(null)
    }
  }

  useModalHistory(confirmState !== null, handleClose)

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog open={confirmState !== null} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent
          showCloseButton={false}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); handleConfirm() }
          }}
        >
          <DialogHeader>
            <DialogTitle>{confirmState?.title}</DialogTitle>
            <DialogDescription>{confirmState?.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>{confirmState?.cancelText}</Button>
            <Button variant={confirmState?.variant} onClick={handleConfirm}>{confirmState?.confirmText}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  )
}

export const useConfirm = () => {
  const context = useContext(ConfirmContext)
  if (!context) throw new Error('useConfirm must be used within a ConfirmProvider')
  return context
}
