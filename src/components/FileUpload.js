import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  CloudUpload,
  AttachFile,
  Delete,
  Download,
  Image,
  PictureAsPdf,
  Description,
  InsertDriveFile,
  Visibility
} from '@mui/icons-material';

// File type icons and colors
const fileTypeConfig = {
  image: { icon: <Image />, color: '#4caf50', types: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'] },
  pdf: { icon: <PictureAsPdf />, color: '#f44336', types: ['pdf'] },
  document: { icon: <Description />, color: '#2196f3', types: ['doc', 'docx', 'txt', 'rtf'] },
  default: { icon: <InsertDriveFile />, color: '#9e9e9e', types: [] }
};

function FileUpload({ taskId, projectId, files = [], onFilesChange, maxFiles = 10, maxSize = 10 }) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    for (const [type, config] of Object.entries(fileTypeConfig)) {
      if (config.types.includes(extension)) {
        return { ...config, extension };
      }
    }
    return { ...fileTypeConfig.default, extension };
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    // Size check (MB to bytes)
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // File count check
    if (files.length >= maxFiles) {
      return `Maximum ${maxFiles} files allowed`;
    }

    // Duplicate check
    if (files.some(f => f.name === file.name)) {
      return 'File with this name already exists';
    }

    return null;
  };

  const handleFileSelect = (selectedFiles) => {
    const fileList = Array.from(selectedFiles);
    const validFiles = [];
    let errorMsg = '';

    for (const file of fileList) {
      const validation = validateFile(file);
      if (validation) {
        errorMsg = validation;
        break;
      }
      validFiles.push(file);
    }

    if (errorMsg) {
      setError(errorMsg);
      setTimeout(() => setError(''), 5000);
      return;
    }

    // Simulate upload process
    setUploading(true);
    
    setTimeout(() => {
      const newFiles = validFiles.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        taskId,
        projectId,
        url: URL.createObjectURL(file), // In real app, this would be server URL
        file: file // Store file object for preview
      }));

      onFilesChange([...files, ...newFiles]);
      setUploading(false);
      setError('');
    }, 1500);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  const handleDeleteFile = (fileId) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    onFilesChange(updatedFiles);
  };

  const handlePreviewFile = (file) => {
    const fileType = getFileType(file.name);
    if (fileType.extension === 'pdf' || fileType.types.includes('image')) {
      setPreviewFile(file);
    } else {
      // For other file types, trigger download
      handleDownloadFile(file);
    }
  };

  const handleDownloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Upload Area */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          border: `2px dashed ${dragOver ? '#37444B' : '#C0B19E'}`,
          backgroundColor: dragOver ? '#F1EEEA' : 'transparent',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          textAlign: 'center'
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <CloudUpload sx={{ fontSize: 48, color: '#C0B19E', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Drop files here or click to browse
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Supports: Images, PDFs, Documents
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Max {maxFiles} files, {maxSize}MB each
        </Typography>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
      </Paper>

      {/* Upload Progress */}
      {uploading && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Uploading files...
          </Typography>
          <LinearProgress />
        </Box>
      )}

      {/* Files List */}
      {files.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachFile />
            Attached Files ({files.length})
          </Typography>
          
          <List>
            {files.map((file) => {
              const fileType = getFileType(file.name);
              
              return (
                <ListItem
                  key={file.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: 'background.paper'
                  }}
                >
                  <ListItemIcon>
                    <Box sx={{ color: fileType.color }}>
                      {fileType.icon}
                    </Box>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={file.name}
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(file.size)} • {fileType.extension.toUpperCase()}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          Uploaded: {new Date(file.uploadDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handlePreviewFile(file)}
                        title="Preview/Download"
                      >
                        <Visibility />
                      </IconButton>
                      
                      <IconButton
                        size="small"
                        onClick={() => handleDownloadFile(file)}
                        title="Download"
                      >
                        <Download />
                      </IconButton>
                      
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteFile(file.id)}
                        title="Delete"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      )}

      {/* File Preview Dialog */}
      <Dialog
        open={!!previewFile}
        onClose={() => setPreviewFile(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          File Preview: {previewFile?.name}
        </DialogTitle>
        <DialogContent>
          {previewFile && (
            <Box sx={{ textAlign: 'center', p: 2 }}>
              {getFileType(previewFile.name).types.includes('image') ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '500px',
                    objectFit: 'contain'
                  }}
                />
              ) : getFileType(previewFile.name).extension === 'pdf' ? (
                <iframe
                  src={previewFile.url}
                  width="100%"
                  height="500px"
                  title={previewFile.name}
                />
              ) : (
                <Typography>
                  Preview not available for this file type
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewFile(null)}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => handleDownloadFile(previewFile)}
            startIcon={<Download />}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FileUpload;