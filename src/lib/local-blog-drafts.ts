import type { PostFields } from './blog-format'
import type { RemoteFile } from './github-publish'

export type DraftImage = { blob: Blob; repoPath: string; webPath: string }

export type LocalBlogDraft = {
  id: string
  post: PostFields
  tagsText: string
  slug: string
  slugEdited: boolean
  original: Pick<RemoteFile, 'name' | 'sha'> | null
  images: DraftImage[]
  updatedAt: number
}

const STORE = 'posts'

async function transact<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const database = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('adamu-tech-blog-drafts', 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'id' })
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    request.onblocked = () => reject(new Error('Close older editor tabs before opening drafts.'))
  })

  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = database.transaction(STORE, mode)
      const request = operation(transaction.objectStore(STORE))
      transaction.oncomplete = () => resolve(request.result)
      transaction.onabort = () => reject(transaction.error ?? new Error('Could not save the local draft.'))
    })
  } finally {
    database.close()
  }
}

export async function listLocalDrafts(): Promise<LocalBlogDraft[]> {
  const drafts = await transact<LocalBlogDraft[]>('readonly', (store) => store.getAll())
  return drafts.sort((a, b) => b.updatedAt - a.updatedAt)
}

export async function writeLocalDraft(draft: LocalBlogDraft): Promise<void> {
  await transact('readwrite', (store) => store.put(draft))
}

export async function deleteLocalDraft(id: string): Promise<void> {
  await transact('readwrite', (store) => store.delete(id))
}
