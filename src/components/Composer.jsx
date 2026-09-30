import { useEffect, useRef, useState } from 'react';
import { Avatar } from './Avatar';
import { usePost } from '../hooks/usePost';

const MAX_FILE_SIZE = 40 * 1024 * 1024;
const MAX_LIVE_SECONDS = 60;

export function Composer() {
  const { currentUser, addPost } = usePost();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [liveError, setLiveError] = useState('');
  const [recordedSeconds, setRecordedSeconds] = useState(0);

  const fileInputRef = useRef(null);
  const cameraVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const discardRecordingRef = useRef(false);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    return () => {
      stopCamera();
      clearInterval(recordingTimerRef.current);
    };
  }, []);

  function stopCamera() {
    setIsCameraReady(false);

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = null;
    }
  }

  function resetComposer() {
    setText('');
    setSelectedFile(null);
    setErrorMessage('');
    setIsOpen(false);
  }

  function handleFileButton() {
    setErrorMessage('');
    fileInputRef.current?.click();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    event.target.value = '';

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setErrorMessage('Selecciona una foto o un video.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('El archivo es demasiado grande. El máximo es 40 MB.');
      return;
    }

    setSelectedFile(file);
    setIsOpen(true);
    setErrorMessage('');
  }

  async function handlePublish(event) {
    event.preventDefault();

    const cleanText = text.trim();

    if (!cleanText && !selectedFile) {
      return;
    }

    setIsPublishing(true);
    setErrorMessage('');

    try {
      await addPost(cleanText, selectedFile);
      resetComposer();
    } catch (error) {
      console.error(error);
      setErrorMessage('No fue posible publicar el archivo. Intenta con otro archivo.');
    } finally {
      setIsPublishing(false);
    }
  }

  function handleCancel() {
    resetComposer();
  }

  async function openLiveVideo() {
    setLiveError('');
    setRecordedSeconds(0);
    discardRecordingRef.current = false;
    setIsLiveOpen(true);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Tu navegador no permite acceder a la cámara.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      mediaStreamRef.current = stream;

      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
        await cameraVideoRef.current.play();
      }

      setIsCameraReady(true);
    } catch (error) {
      console.error(error);
      setLiveError(
        'No se pudo acceder a la cámara y al micrófono. Revisa los permisos del navegador.',
      );
    }
  }

  function closeLiveVideo() {
    if (isRecording) {
      discardRecordingRef.current = true;
      stopRecording();
    }

    stopCamera();
    clearInterval(recordingTimerRef.current);
    setIsLiveOpen(false);
    setIsRecording(false);
    setIsCameraReady(false);
    setRecordedSeconds(0);
    setLiveError('');
  }

  function startRecording() {
    const stream = mediaStreamRef.current;

    if (!stream) {
      setLiveError('Primero debes permitir el acceso a la cámara.');
      return;
    }

    if (!window.MediaRecorder) {
      setLiveError('Este navegador no permite grabar video desde la cámara.');
      return;
    }

    recordedChunksRef.current = [];

    let options = {};

    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
      options = { mimeType: 'video/webm;codecs=vp9,opus' };
    } else if (MediaRecorder.isTypeSupported('video/webm')) {
      options = { mimeType: 'video/webm' };
    }

    const recorder = new MediaRecorder(stream, options);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    recorder.onerror = () => {
      setLiveError('Ocurrió un error durante la grabación.');
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    };

    recorder.onstop = async () => {
      clearInterval(recordingTimerRef.current);
      setIsRecording(false);

      if (discardRecordingRef.current) {
        recordedChunksRef.current = [];
        mediaRecorderRef.current = null;
        discardRecordingRef.current = false;
        stopCamera();
        setIsLiveOpen(false);
        setRecordedSeconds(0);
        return;
      }

      const mimeType = recorder.mimeType || 'video/webm';
      const blob = new Blob(recordedChunksRef.current, { type: mimeType });

      if (!blob.size) {
        setLiveError('No se pudo crear el video. Intenta nuevamente.');
        return;
      }

      const file = new File(
        [blob],
        `video-en-vivo-${Date.now()}.webm`,
        { type: mimeType },
      );

      try {
        setIsPublishing(true);
        await addPost('Video grabado desde la cámara.', file);
        closeLiveVideo();
      } catch (error) {
        console.error(error);
        setLiveError('No fue posible publicar el video grabado.');
      } finally {
        setIsPublishing(false);
        mediaRecorderRef.current = null;
      }
    };

    mediaRecorderRef.current = recorder;
    recorder.start();
    setRecordedSeconds(0);
    setIsRecording(true);

    recordingTimerRef.current = setInterval(() => {
      setRecordedSeconds((seconds) => {
        const nextSeconds = seconds + 1;

        if (nextSeconds >= MAX_LIVE_SECONDS) {
          window.setTimeout(stopRecording, 0);
        }

        return nextSeconds;
      });
    }, 1000);
  }

  function stopRecording() {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }

  const fileTypeLabel = selectedFile?.type.startsWith('video/')
    ? 'Video seleccionado'
    : 'Foto seleccionada';

  return (
    <section className="composer">
      <div className="composer-row">
        <Avatar initials={currentUser.avatar} />
        <button
          className="composer-input"
          type="button"
          onClick={() => setIsOpen(true)}
        >
          Que estas pensando, {currentUser.name.split(' ')[0]}?
        </button>
      </div>

      {isOpen && (
        <form className="composer-form" onSubmit={handlePublish}>
          <textarea
            className="composer-textarea"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={`Que estas pensando, ${currentUser.name.split(' ')[0]}?`}
            autoFocus
          />

          {selectedFile && (
            <div className="selected-media">
              <div className="selected-media-header">
                <strong>{fileTypeLabel}</strong>
                <button
                  type="button"
                  className="remove-media-button"
                  onClick={() => setSelectedFile(null)}
                >
                  Quitar
                </button>
              </div>

              {selectedFile.type.startsWith('video/') ? (
                <video
                  className="composer-preview"
                  src={previewUrl}
                  controls
                />
              ) : (
                <img
                  className="composer-preview"
                  src={previewUrl}
                  alt="Vista previa de la publicación"
                />
              )}
            </div>
          )}

          {errorMessage && (
            <p className="composer-error">{errorMessage}</p>
          )}

          <div className="composer-form-actions">
            <button
              className="composer-cancel"
              type="button"
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button
              className="composer-publish"
              type="submit"
              disabled={isPublishing || (!text.trim() && !selectedFile)}
            >
              {isPublishing ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      )}

      <input
        ref={fileInputRef}
        className="hidden-file-input"
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
      />

      <div className="composer-actions">
        <button
          className="composer-action"
          type="button"
          onClick={openLiveVideo}
        >
          Video en vivo
        </button>

        <button
          className="composer-action"
          type="button"
          onClick={handleFileButton}
        >
          Foto/video
        </button>

        <button
          className="composer-action"
          type="button"
          onClick={() => setIsOpen(true)}
        >
          Sentimiento
        </button>
      </div>

      {isLiveOpen && (
        <div className="live-modal-overlay" role="dialog" aria-modal="true">
          <div className="live-modal">
            <div className="live-modal-header">
              <div>
                <span className="live-badge">EN VIVO</span>
                <h2>Video en vivo</h2>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeLiveVideo}
                disabled={isPublishing}
                aria-label="Cerrar video en vivo"
              >
                ×
              </button>
            </div>

            <video
              ref={cameraVideoRef}
              className="live-camera"
              muted
              playsInline
              autoPlay
            />

            {liveError && (
              <p className="composer-error">{liveError}</p>
            )}

            <p className="live-help">
              Esta función usa la cámara y el micrófono de tu computador para
              grabar un video y publicarlo en tu perfil.
            </p>

            <div className="live-actions">
              {!isRecording ? (
                <button
                  type="button"
                  className="primary-button"
                  onClick={startRecording}
                  disabled={isPublishing || !isCameraReady}
                >
                  Iniciar grabación
                </button>
              ) : (
                <button
                  type="button"
                  className="primary-button recording-button"
                  onClick={stopRecording}
                  disabled={isPublishing}
                >
                  Detener y publicar ({recordedSeconds}s)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
