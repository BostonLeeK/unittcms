import Config from '@/config/config';
import { logError } from '@/utils/errorHandler';
const apiServer = Config.apiServer;

async function fetchDownloadAttachment(attachmentId: number, downloadFileName: string, token: string) {
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const url = `${apiServer}/attachments/download/${attachmentId}`;

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error: unknown) {
    logError('Error downloading attachment', error);
    throw error;
  }
}

async function fetchCreateAttachments(documentId: number, files: File[], token: string) {
  try {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    const url = `${apiServer}/attachments?parentDocumentId=${documentId}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error: unknown) {
    logError('Error uploading files', error);
  }
}

async function fetchDeleteAttachment(attachmentId: number, token: string) {
  const fetchOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const url = `${apiServer}/attachments/${attachmentId}`;

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error: unknown) {
    logError('Error deleting attachment', error);
    throw error;
  }
}

export { fetchCreateAttachments, fetchDownloadAttachment, fetchDeleteAttachment };

