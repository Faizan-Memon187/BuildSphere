import React from 'react'

type ContextMenu = {
  itemId: string
  x: number
  y: number
}

type Props = {
  contextMenu: ContextMenu | null
  onMove: (itemId: string) => void
  onRotate: (itemId: string) => void
  onResize: (itemId: string) => void
  onClose: () => void
}

export default function ItemContextMenu({
  contextMenu,
  onMove,
  onRotate,
  onResize,
  onClose,
}: Props) {
  if (!contextMenu) return null

  return (
    <div
      style={{
        position: 'fixed',
        left: `${contextMenu.x}px`,
        top: `${contextMenu.y}px`,
        backgroundColor: '#1a2d42',
        border: '1px solid #4fd1c5',
        borderRadius: '4px',
        padding: '8px 0',
        zIndex: 1000,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        minWidth: '120px',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => {
          onMove(contextMenu.itemId)
          onClose()
        }}
        style={{
          width: '100%',
          padding: '8px 12px',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#c2d3de',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: '14px',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = '#2a4d62'
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = 'transparent'
        }}
      >
        Move
      </button>
      <button
        onClick={() => {
          onRotate(contextMenu.itemId)
          onClose()
        }}
        style={{
          width: '100%',
          padding: '8px 12px',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#c2d3de',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: '14px',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = '#2a4d62'
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = 'transparent'
        }}
      >
        Rotate
      </button>
      <button
        onClick={() => {
          onResize(contextMenu.itemId)
          onClose()
        }}
        style={{
          width: '100%',
          padding: '8px 12px',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#c2d3de',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: '14px',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = '#2a4d62'
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = 'transparent'
        }}
      >
        Resize
      </button>
      <button
        onClick={onClose}
        style={{
          width: '100%',
          padding: '8px 12px',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#c2d3de',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: '14px',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = '#2a4d62'
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = 'transparent'
        }}
      >
        Cancel
      </button>
    </div>
  )
}
