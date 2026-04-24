const express = require('express')
const { requireAuth } = require('../../common/middleware/auth.middleware')
const {
  previewExport,
  createExport,
  getExportHistory,
  downloadExport,
  deleteExport
} = require('./exports.controller')

const router = express.Router()

router.post('/', requireAuth, createExport)
router.post('/preview', requireAuth, previewExport)
router.get('/history', requireAuth, getExportHistory)
router.delete('/:id', requireAuth, deleteExport)
router.get('/:id/download', requireAuth, downloadExport)

module.exports = router
