function info(msg) {
  window.dispatchEvent(
    new CustomEvent('glb_info_event', {
      bubbles: true, 
      detail: String(msg)
    })
  )
}

function warn(msg) {
  window.dispatchEvent(
    new CustomEvent('glb_warn_event', {
      bubbles: true, 
      detail: String(msg)
    })
  )
}

function err(msg) {
  window.dispatchEvent(
    new CustomEvent('glb_err_event', {
      bubbles: true, 
      detail: String(msg)
    })
  )
}

export { info, warn, err }