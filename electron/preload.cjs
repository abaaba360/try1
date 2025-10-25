'use strict'

const { contextBridge, ipcRenderer } = require('electron')

function exposeListener(channel, callback) {
  ipcRenderer.on(channel, callback)
  return () => {
    ipcRenderer.removeListener(channel, callback)
  }
}

contextBridge.exposeInMainWorld('electronAPI', {
  onNewFile: (listener) => exposeListener('menu:new-file', listener),
  onOpenFile: (listener) => exposeListener('menu:open-file', listener),
  onSaveFile: (listener) => exposeListener('menu:save-file', listener),
  onSaveAsFile: (listener) => exposeListener('menu:save-as-file', listener),
  saveFile: (content) => ipcRenderer.invoke('file:save', content),
  saveFileAs: (content) => ipcRenderer.invoke('file:save-as', content),
  setDirty: (isDirty) => ipcRenderer.send('file:set-dirty', Boolean(isDirty))
})
