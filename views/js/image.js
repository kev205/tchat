var type = [
  'image / jpg',
  'image / pjpeg',
  'image / png'
];

function verifierType(file){
  type.forEach(function(mimeType){
    if(file.type === mimeType)
      return true;
  });
  return false;
}