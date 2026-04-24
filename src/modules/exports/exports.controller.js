const {
  previewExportService,
  createExportService,
  getExportHistoryService,
  downloadExportService,
  deleteExportService
} = require('./exports.service')

const previewExport = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const data = await previewExportService(userId, req.body)
    return res.status(200).json({ success: true, data })
  } catch (error) {
    return next(error)
  }
}

const createExport = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const data = await createExportService(userId, req.body)
    return res.status(201).json({ success: true, data })
  } catch (error) {
    return next(error)
  }
}

const getExportHistory = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const result = await getExportHistoryService(userId, req.query)
    return res.status(200).json({ success: true, ...result })
  } catch (error) {
    return next(error)
  }
}

const downloadExport = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const { id } = req.params
    const { fileContent, name } = await downloadExportService(userId, id)
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="${name}"`)
    return res.status(200).send(fileContent)
  } catch (error) {
    return next(error)
  }
}

const deleteExport = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const { id } = req.params
    await deleteExportService(userId, id)
    return res
      .status(200)
      .json({ success: true, message: 'Export deleted successfully' })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  previewExport,
  createExport,
  getExportHistory,
  downloadExport,
  deleteExport
}
