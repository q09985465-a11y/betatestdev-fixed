export async function uploadToR2(file, bucket) {
  const fileName = `${crypto.randomUUID()}-${file.name}`;

  if(file.size>10*1024*1024){

      throw new Error("Archivo demasiado grande");

  }

  await bucket.put(fileName, file.stream(), {
    httpMetadata: {
      contentType: file.type,
    },
  });

  return fileName;
}