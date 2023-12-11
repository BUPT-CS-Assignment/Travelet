function handleFileInput(event, dest, hook = ()=>{}) {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    dest.push(files[i]);
    hook(i, files[i]);
  }
}

function read(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    }
    reader.readAsDataURL(file);
  })
}

function sync_read(file, onsuccess) {
  const reader = new FileReader();
  reader.onload = () => {
    onsuccess(reader.result);
  }
  reader.readAsDataURL(file);
}

async function async_read(file) {
  const raw = await async_read(file);
  return raw;
}

function handleFileRemove(idx, dest, hook=()=>{}) {
  dest.splice(idx, 1);
  hook(idx);
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

export {async_read, sync_read, handleFileInput, handleFileRemove ,formatFileSize, iconFileType}