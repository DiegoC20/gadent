import { useState } from 'react'
import { Modal, Field, TextInput, Select, TextArea } from './OrthodonticsUI'

interface UploadedFile {
  id: number
  doctor: string
  name: string
  description: string
  fileName: string
}

interface Album {
  id: number
  name: string
  date: string
  files: UploadedFile[]
}

export default function FotografiasTab() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false)
  const [newAlbumName, setNewAlbumName] = useState('')

  const [isFileModalOpen, setIsFileModalOpen] = useState(false)
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null)
  
  const [isDragging, setIsDragging] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [newFileDoctor, setNewFileDoctor] = useState('Diego Cruzado')
  const [newFileDesc, setNewFileDesc] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleCreateAlbum = () => {
    if (!newAlbumName.trim()) return
    
    const newAlbum: Album = {
      id: Date.now(),
      name: newAlbumName,
      date: new Date().toLocaleDateString('es-ES'),
      files: []
    }
    setAlbums([...albums, newAlbum])
    setNewAlbumName('')
    setIsAlbumModalOpen(false)
  }

  const handleDeleteAlbum = (id: number) => {
    setAlbums(albums.filter(a => a.id !== id))
  }

  const openFileModal = (albumId: number) => {
    setSelectedAlbumId(albumId)
    setSelectedFile(null)
    setNewFileName('')
    setNewFileDesc('')
    setIsFileModalOpen(true)
  }

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleSaveFile = () => {
    if (!selectedAlbumId) return
    
    setAlbums(albums.map(album => {
      if (album.id === selectedAlbumId) {
        return {
          ...album,
          files: [...album.files, {
            id: Date.now(),
            doctor: newFileDoctor,
            name: newFileName || (selectedFile ? selectedFile.name : 'Archivo sin nombre'),
            description: newFileDesc,
            fileName: selectedFile ? selectedFile.name : 'imagen.jpg'
          }]
        }
      }
      return album
    }))
    
    setIsFileModalOpen(false)
  }

  return (
    <div className="mx-auto max-w-6xl pt-6 pb-12 font-sans">
      
      {albums.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay álbumes creados</h3>
            <p className="text-gray-500 mb-6">Comienza creando un nuevo álbum para subir las fotografías del paciente.</p>
            <button 
              onClick={() => setIsAlbumModalOpen(true)}
              className="rounded-full bg-[#79CEDC] px-8 py-3 text-sm font-medium text-white hover:bg-[#68bed0] transition-colors shadow-sm"
            >
              Crear nuevo album
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => setIsAlbumModalOpen(true)}
              className="rounded-full bg-[#79CEDC] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#68bed0] transition-colors shadow-sm"
            >
              Crear nuevo album
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map(album => (
              <div key={album.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                    <h3 className="font-semibold text-gray-800 text-lg">{album.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{album.date} • {album.files.length} archivos</p>
                  
                  {album.files.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {album.files.map(f => (
                        <div key={f.id} className="flex items-center gap-2 text-sm text-cyan-600 bg-cyan-50 p-2 rounded">
                          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="truncate">{f.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                  <button 
                    onClick={() => openFileModal(album.id)}
                    className="text-sm font-medium text-cyan-600 hover:text-cyan-800"
                  >
                    Subir archivo
                  </button>
                  <button 
                    onClick={() => handleDeleteAlbum(album.id)}
                    className="text-sm font-medium text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Album Modal */}
      <Modal 
        isOpen={isAlbumModalOpen} 
        onClose={() => setIsAlbumModalOpen(false)} 
        title="NUEVO ALBUM"
      >
        <div className="text-left mb-6">
          <Field label="Nombre del album:">
            <TextInput 
              value={newAlbumName} 
              onChange={e => setNewAlbumName(e.target.value)} 
              placeholder="Ej. Fotos pre-tratamiento"
            />
          </Field>
        </div>
        <button 
          onClick={handleCreateAlbum}
          className="rounded-full bg-[#79CEDC] px-10 py-2.5 font-medium text-white hover:bg-[#68bed0] transition-colors"
        >
          Guardar
        </button>
      </Modal>

      {/* File Modal */}
      <Modal 
        isOpen={isFileModalOpen} 
        onClose={() => setIsFileModalOpen(false)} 
        title="NUEVO ARCHIVO"
      >
        <div className="text-left space-y-4 mb-6 h-[400px] overflow-y-auto pr-2">
          <div className="grid grid-cols-[100px_1fr] items-center gap-4">
            <span className="text-sm text-gray-600">Doctor:</span>
            <Select 
              options={['Diego Cruzado']} 
              value={newFileDoctor} 
              onChange={e => setNewFileDoctor(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-[100px_1fr] items-center gap-4">
            <span className="text-sm text-gray-600">Nombre:</span>
            <TextInput 
              placeholder="Nombre para el archivo" 
              value={newFileName}
              onChange={e => setNewFileName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-4">
            <span className="text-sm text-gray-600 pt-2">Descripción:</span>
            <TextArea 
              placeholder="Escribe una descripción" 
              rows={4}
              value={newFileDesc}
              onChange={e => setNewFileDesc(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-4">
            <span className="text-sm text-gray-600 pt-2">Archivo</span>
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragging ? 'border-cyan-500 bg-cyan-50' : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              {selectedFile ? (
                <div className="text-cyan-600 font-medium">
                  ✓ {selectedFile.name}
                </div>
              ) : (
                <span className="text-sm text-gray-500">
                  Arrastra y suelta un archivo en esta zona o haz click aquí para seleccionarlos...
                </span>
              )}
            </div>
          </div>
        </div>
        <button 
          onClick={handleSaveFile}
          className="rounded-full bg-[#A8E2E9] px-10 py-2.5 font-medium text-white hover:bg-[#8fd0d8] transition-colors w-[140px]"
        >
          Guardar
        </button>
      </Modal>

    </div>
  )
}
