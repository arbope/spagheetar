'use client';

import { useEffect, useRef } from 'react';
import { PitchDetector } from 'pitchy';
import { frequencyToNoteName } from '../constants';
import { Waves } from 'lucide-react';

interface TunerProps {
  setShowTuner: React.Dispatch<React.SetStateAction<boolean>>;
  showTuner: boolean;
}

function getClosestMidiNote(frequency: number): number {
  return Math.round(12 * (Math.log2(frequency / 440)) + 69);
}

function midiNoteToFrequency(midiNote: number): number {
  return 440 * Math.pow(2, (midiNote - 69) / 12);
}

export default function Tuner({ setShowTuner, showTuner }: TunerProps) {
  const pitchRef = useRef<HTMLSpanElement>(null);
  const clarityRef = useRef<HTMLSpanElement>(null);
  const noteRef = useRef<HTMLSpanElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafIdRef = useRef<number>(0);
  const tunerIconRef = useRef<HTMLDivElement>(null);
  const tunerRef = useRef<HTMLDivElement>(null);

  function updatePitch(
    analyserNode: AnalyserNode,
    detector: PitchDetector<Float32Array>,
    input: Float32Array,
    sampleRate: number
  ): void {
    analyserNode.getFloatTimeDomainData(input);
    const [pitch, clarity] = detector.findPitch(input, sampleRate);

    pitchRef.current!.textContent = pitch > 0 ? `${Math.round(pitch * 10) / 10} Hz` : '--';
    clarityRef.current!.textContent = clarity > 0 ? `${Math.round(clarity * 100)} %` : '--';

    if (pitch > 0) {
      const midiNote = getClosestMidiNote(pitch);
      const noteName = frequencyToNoteName(pitch) ?? '--';
      noteRef.current!.textContent = noteName;

      const exactFreq = midiNoteToFrequency(midiNote);
      const centsDiff = 1200 * Math.log2(pitch / exactFreq);
      const maxCents = 50;
      const pct = Math.max(-maxCents, Math.min(centsDiff, maxCents)) / maxCents;

      indicatorRef.current!.style.setProperty('--offset', `${pct * 50}%`);
      indicatorRef.current!.style.backgroundColor =
        Math.abs(centsDiff) <= 10 ? '#22c55e' : '#ef4444';
    } else {
      noteRef.current!.textContent = '--';
      indicatorRef.current!.style.setProperty('--offset', '0%');
      indicatorRef.current!.style.backgroundColor = '#3b82f6';
    }

    rafIdRef.current = requestAnimationFrame(() =>
      updatePitch(analyserNode, detector, input, sampleRate)
    );
  }

  function stopTuner() {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    cancelAnimationFrame(rafIdRef.current);
  }

  useEffect(() => {
    if (!showTuner) return;

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream;

        const analyserNode = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyserNode);

        const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
        const input = new Float32Array(detector.inputLength);

        updatePitch(analyserNode, detector, input, audioContext.sampleRate);
      })
      .catch((err) => {
        alert('Microphone access is required to use the tuner.');
        console.error('Mic error:', err);
      });

    return () => {
      stopTuner();
    };
  }, [showTuner,updatePitch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (tunerIconRef.current?.contains(target)) return;
      if (tunerRef.current && !tunerRef.current.contains(target)) {
        setShowTuner(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        ref={tunerIconRef}
        onClick={() => setShowTuner((prev) => !prev)}
        aria-label="Open tuner"
        className="text-2xl -ml-0.5 cursor-pointer transition-transform duration-700 transform hover:text-black hover:scale-x-125"
      >
        <Waves />
      </div>

      {showTuner && (
        <div
          ref={tunerRef}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center text-black bg-white/15 backdrop-blur-md rounded-lg px-6 py-4 shadow-lg z-50 max-w-xs w-full"
        >
          <div className="text-xl font-semibold mb-2">Tuner [440 Hz]</div>

          <div className="mb-1">
            Note: <span ref={noteRef}>--</span>
          </div>
          <div className="mb-1">
            Pitch: <span ref={pitchRef}>--</span>
          </div>

          <div
            className="relative h-4 w-full bg-gray-300 rounded-full mb-4"
            aria-label="Pitch accuracy meter"
          >
            <div
              ref={indicatorRef}
              className="absolute top-0 left-1/2 w-3 h-4 rounded transition-transform"
              style={{
                transform: 'translateX(var(--offset, 0%))',
                backgroundColor: '#3b82f6',
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
