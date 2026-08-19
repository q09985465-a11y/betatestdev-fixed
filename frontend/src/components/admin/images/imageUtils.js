import imageCompression from "browser-image-compression";

export const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB


export async function compressImage(file) {

  return imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  });

}

export function getImageUrl(filename){

  if(!filename){
    return null;
  }

  return `/images/${filename}`;

}

export function validateImage(file) {

  if (!ALLOWED_TYPES.includes(file.type)) {

    return {
      valid: false,
      error: `${file.name}: formato no permitido.`,
    };

  }


  if (file.size > MAX_FILE_SIZE) {

    return {
      valid: false,
      error: `${file.name}: supera el tamaño máximo permitido.`,
    };

  }


  return {
    valid: true,
  };

}

export async function prepareImages(files) {

  const images = [];
  const errors = [];


  for (const file of files) {

    const validation = validateImage(file);


    if (!validation.valid) {

      errors.push(validation.error);
      continue;

    }


    const compressed = await compressImage(file);

    images.push({

	  id: crypto.randomUUID(),

	  file: compressed,

	  preview: URL.createObjectURL(compressed),

	  filename: null,

	  status: "new",

	  position: 0

	});


  }


  return {
    images,
    errors,
  };

}

export function mapExistingImages(images, baseUrl){

  if(!images || images.length === 0){
    return [];
  }


  return images.map((filename,index)=>({

    id:crypto.randomUUID(),

    filename,

    preview:`${baseUrl}/${filename}`,

    file:null,

    position:index,

    status:"existing"

}));

}

export function revokeImagePreview(image){

  if(
    image.preview &&
    image.preview.startsWith("blob:")
  ){

    URL.revokeObjectURL(image.preview);

  }

}

export function extractImageNames(images){

  return images
    .filter(img => img.filename)
    .map(img => img.filename);

}

export function getPendingUploads(images){

  return images.filter(
    img =>
      img.file &&
      !img.uploaded
  );

}