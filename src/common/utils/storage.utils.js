const supabase = require('../../config/supabase')

const bucketName = process.env.SUPABASE_BUCKET

const uploadCsvFile = async ({ path, content }) => {
  const { error } = await supabase.storage
    .from(bucketName)
    .upload(path, Buffer.from(content, 'utf-8'), {
      contentType: 'text/csv; charset=utf-8',
      upsert: false
    })

  if (error) {
    const uploadError = new Error(
      `Failed to upload export file: ${error.message}`
    )
    uploadError.statusCode = 500
    uploadError.code = 'STORAGE_UPLOAD_FAILED'
    throw uploadError
  }

  return path
}

const downloadFileBuffer = async (path) => {
  const { data, error } = await supabase.storage.from(bucketName).download(path)

  if (error) {
    const downloadError = new Error(
      `Failed to download export file: ${error.message}`
    )
    downloadError.statusCode = 500
    downloadError.code = 'STORAGE_DOWNLOAD_FAILED'
    throw downloadError
  }

  const arrayBuffer = await data.arrayBuffer()

  return Buffer.from(arrayBuffer)
}

const deleteFile = async (path) => {
  const { error } = await supabase.storage.from(bucketName).remove([path])

  if (error) {
    const deleteError = new Error(
      `Failed to download export file: ${error.message}`
    )
    deleteError.statusCode = 500
    deleteError.code = 'STORAGE_DELETE_FAILED'
    throw deleteError
  }
}

module.exports = {
  uploadCsvFile,
  downloadFileBuffer,
  deleteFile
}
