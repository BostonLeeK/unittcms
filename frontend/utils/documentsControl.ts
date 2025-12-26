import { logError } from '@/utils/errorHandler';
import Config from '@/config/config';
const apiServer = Config.apiServer;
import { DocumentType } from '@/types/document';

async function fetchDocument(jwt: string, documentId: number) {
  const url = `${apiServer}/documents/${documentId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    logError('Error fetching document', error);
  }
}

async function fetchDocuments(jwt: string, folderId: number, search?: string) {
  const queryParams = [`folderId=${folderId}`];

  if (search) {
    queryParams.push(`search=${search}`);
  }

  const query = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

  const url = `${apiServer}/documents${query}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch (error: unknown) {
    logError('Error fetching documents', error);
    return [];
  }
}

async function fetchDocumentsByProjectId(jwt: string, projectId: number, search?: string) {
  const queryParams = [`projectId=${projectId}`];

  if (search) {
    queryParams.push(`search=${search}`);
  }

  const query = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

  const url = `${apiServer}/documents/byproject${query}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch (error: unknown) {
    logError('Error fetching documents by project', error);
    return [];
  }
}

async function createDocument(jwt: string, folderId: string, title: string, content: string) {
  const newDocumentData = {
    title: title,
    content: content,
  };

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(newDocumentData),
  };

  const url = `${apiServer}/documents?folderId=${folderId}`;

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    logError('Error creating new document:', error);
    throw error;
  }
}

async function updateDocument(jwt: string, documentId: number, title: string, content: string) {
  const updateDocumentData = {
    title: title,
    content: content,
  };

  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(updateDocumentData),
  };

  const url = `${apiServer}/documents/${documentId}`;

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    logError('Error updating document:', error);
    throw error;
  }
}

async function deleteDocument(jwt: string, documentId: number) {
  const fetchOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  };

  const url = `${apiServer}/documents/${documentId}`;

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error: unknown) {
    logError('Error deleting document:', error);
    throw error;
  }
}

export { fetchDocument, fetchDocuments, fetchDocumentsByProjectId, createDocument, updateDocument, deleteDocument };

