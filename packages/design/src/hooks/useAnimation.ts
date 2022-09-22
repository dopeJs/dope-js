import { useEffect, useRef, useCallback } from 'react'

export interface ISpeedMaps {
  immediately: number
  quickly: number
  normal: number
  slowly: number
}

const SpeedMaps: ISpeedMaps = {
  immediately: 100,
  quickly: 200,
  normal: 300,
  slowly: 400,
}

export interface Options {
  id?: string
  auto?: boolean
  keyframes?: Keyframe[] | PropertyIndexedKeyframes
  timing?: number | EffectTiming | keyof ISpeedMaps
  onReady?: (playState: AnimationPlayState) => void
  onFinish?: (event: AnimationPlaybackEvent) => unknown
}

export const useAnimation = <T extends HTMLElement>({
  id,
  auto,
  keyframes,
  timing,
  onReady,
  onFinish,
}: Options = {}) => {
  const ref = useRef<T>(null)
  const animateRef = useRef<Animation>()

  const play = useCallback(() => animateRef.current?.play(), [])

  const pause = useCallback(() => animateRef.current?.pause(), [])

  const cancel = useCallback(() => animateRef.current?.cancel(), [])

  const reverse = useCallback(() => animateRef.current?.reverse(), [])

  const finish = useCallback(() => animateRef.current?.finish(), [])

  const animate = useCallback(
    (opts: Options) => {
      if (!ref.current || !opts.keyframes) return
      if (typeof opts.timing === 'string') {
        opts.timing = SpeedMaps[opts.timing]
      }
      animateRef.current = ref.current.animate(opts.keyframes, opts.timing || 300)
      if (auto === false) {
        animateRef.current.pause()
      }
      if (id) animateRef.current.id = id
      onReady && animateRef.current.ready.then((animation) => onReady(animation.playState))

      onFinish && animateRef.current.addEventListener('finish', onFinish)

      return () => onFinish && animateRef.current?.removeEventListener('finish', onFinish)
    },
    [auto, id, onReady, onFinish]
  )

  useEffect(() => {
    animate({ id, auto, keyframes, timing })
  }, [id, auto, keyframes, timing])

  return {
    ref,
    play,
    pause,
    cancel,
    reverse,
    finish,
    animate,
  }
}
