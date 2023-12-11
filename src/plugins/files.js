function handleFileInput(event, dest) {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    var file = files[i];
    const reader = new FileReader();
    reader.onload = () => {
      file['raw'] = reader.result;
      dest.push(file);
    }
    reader.readAsDataURL(file);
  }
}

function handleFileRemove(idx, dest) {
  dest.splice(idx, 1);
}

function formatFileSize(size) {
  if (size === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const FileIconMap = {
  image: 'mdi-image',
  video: 'mdi-play-box',
  audio: 'mdi-music-box',
  text: 'mdi-text-box',
  application: 'mdi-file',
}
function iconFileType(ftype) {
  const t = String(ftype).split('/')[0];
  if(t in FileIconMap) return FileIconMap[t];
  else return 'mdi-file-question';
}

export {handleFileInput, handleFileRemove ,formatFileSize, iconFileType}