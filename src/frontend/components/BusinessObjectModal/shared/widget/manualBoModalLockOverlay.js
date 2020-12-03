const OVERLAY_1_STYLE_RAW = `
  position: absolute;
  top: 0px;
  left: 0px;
  background: #0A2E4D;
  width: 100%;
  height: 102%;
  opacity: 0.5;
  border-bottom: 0px;
`

const OVERLAY_2_STYLE_RAW = `
  position: absolute;
  top: 0px;
  left: 0px;
  background: #0A2E4D;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  border-bottom: 0px;
`

const manualBoModalLockOverlay = (anyUnsavedChanges) => {
  const boModalHeaderNode = document.querySelector('#BoModalHeader')
  const bomSidebar = document.querySelector('#BomSidebar')
  const headerOverlay = boModalHeaderNode.querySelector('#bomHeaderOverlay')
  const sidebarOverlay = bomSidebar.querySelector('#bomSidebarOverlay')

  if (anyUnsavedChanges) {
    if (!headerOverlay) {
      const overlayDiv = document.createElement('div')
      overlayDiv.id = 'bomHeaderOverlay'
      overlayDiv.style = OVERLAY_1_STYLE_RAW
      boModalHeaderNode.appendChild(overlayDiv)
    }

    if (!sidebarOverlay) {
      const overlayDiv2 = document.createElement('div')
      overlayDiv2.id = 'bomSidebarOverlay'
      overlayDiv2.style = OVERLAY_2_STYLE_RAW
      bomSidebar.appendChild(overlayDiv2)
    }
  } else {
    if (headerOverlay) boModalHeaderNode.removeChild(headerOverlay)
    if (sidebarOverlay) bomSidebar.removeChild(sidebarOverlay)
  }
}

export default manualBoModalLockOverlay
