import { DocumentFolderType, DocumentTreeNodeData } from '@/types/document';

export function buildDocumentFolderTree(folders: DocumentFolderType[]): DocumentTreeNodeData[] {
  const folderMap = new Map<number, DocumentTreeNodeData>();

  folders.forEach((folder) => {
    folderMap.set(folder.id, {
      id: folder.id.toString(),
      name: folder.name,
      detail: folder.detail,
      parentFolderId: folder.parentFolderId,
      projectId: folder.projectId,
      folderData: folder,
      children: [],
    });
  });

  const tree: DocumentTreeNodeData[] = [];

  folders.forEach((folder) => {
    const currentNode = folderMap.get(folder.id);

    if (!currentNode) return;

    if (folder.parentFolderId === null) {
      tree.push(currentNode);
    } else {
      const parent = folderMap.get(folder.parentFolderId);
      if (parent && parent.children) {
        parent.children.push(currentNode);
      }
    }
  });

  return tree;
}

