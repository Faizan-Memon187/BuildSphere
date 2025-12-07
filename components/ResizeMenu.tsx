import React from 'react'

type ResizeMenu = {
  itemId: string
  x: number
  y: number
}

type Props = {
  resizeMenu: ResizeMenu | null
  onResizeWidth: (itemId: string) => void
  onResizeLength: (itemId: string) => void
  onClose: () => void
}

export default function ResizeMenu({
  resizeMenu,
  onResizeWidth,
  onResizeLength,
  onClose,
}: Props) {
  if (!resizeMenu) return null

  return (
    <div
      style={{
        position: 'fixed',
        left: `${resizeMenu.x}px`,
        top: `${resizeMenu.y}px`,
        backgroundColor: '#1a2d42',
        border: '1px solid #4fd1c5',
        borderRadius: '4px',
        padding: '8px 0',
        zIndex: 1000,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        minWidth: '140px',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => {
          onResizeWidth(resizeMenu.itemId)
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
        Resize Width
      </button>
      <button
        onClick={() => {
          onResizeLength(resizeMenu.itemId)
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
        Resize Length
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
