// Voice presets for Grok Imagine Video (image-to-video and text-to-video).
//
// Grok Imagine has no `voice` parameter, so the only lever for voice
// consistency is the prompt itself. Each preset's `prompt` is a detailed
// English voice description that gets injected into the prompt prefix.
// Same id → same description string → similar-sounding output across orders.
//
// Service slugs that should expose this selector are listed in VOICE_ENABLED_SLUGS.

export interface VoicePreset {
  id: string
  label: string        // Vietnamese, shown in dropdown
  description: string  // Vietnamese hint, shown under the dropdown
  prompt: string       // English voice description injected into Grok prompt
}

export const NO_VOICE_ID = 'none'

export const VOICE_PRESETS: VoicePreset[] = [
  {
    id: NO_VOICE_ID,
    label: 'Không có giọng nói',
    description: 'Video không có lời thoại hay thuyết minh, chỉ có hình ảnh và âm thanh môi trường.',
    prompt:
      'No spoken dialogue, no narration, no voice-over, no singing. The video must be silent of any human speech. Only natural ambient sounds, music, or environmental audio are allowed. Characters do not talk.',
  },
  {
    id: 'nam-bac-tram',
    label: 'Nam Bắc — trầm, trung niên',
    description: 'Giọng nam miền Bắc, trầm ấm, khoảng 40 tuổi. Phù hợp lời dẫn nghiêm túc, tài liệu.',
    prompt:
      'The speaker is a Northern Vietnamese man in his early 40s with a deep, warm, resonant chest voice, calm steady pacing, neutral Hanoi accent, clear articulation, and a serious narrator-like tone.',
  },
  {
    id: 'nam-bac-tre',
    label: 'Nam Bắc — thanh niên',
    description: 'Giọng nam Hà Nội trẻ, năng động, khoảng 25 tuổi.',
    prompt:
      'The speaker is a young Northern Vietnamese man, around 25 years old, with a bright energetic mid-pitch voice, friendly upbeat delivery, clean Hanoi accent, and natural conversational rhythm.',
  },
  {
    id: 'nu-bac-ngot',
    label: 'Nữ Bắc — ngọt ngào',
    description: 'Giọng nữ miền Bắc, nhẹ nhàng, dịu dàng. Phù hợp quảng cáo, kể chuyện.',
    prompt:
      'The speaker is a Northern Vietnamese woman in her late 20s with a soft, sweet, gentle voice, warm breathy timbre, slow tender pacing, clean Hanoi accent, and an inviting storyteller tone.',
  },
  {
    id: 'nu-bac-tre',
    label: 'Nữ Bắc — trẻ trung',
    description: 'Giọng nữ Hà Nội, tươi sáng, sôi nổi. Phù hợp vlog, review.',
    prompt:
      'The speaker is a young Northern Vietnamese woman, around 22 years old, with a bright cheerful higher-pitch voice, lively expressive delivery, clean Hanoi accent, and a playful vlogger-style energy.',
  },
  {
    id: 'nam-nam-am',
    label: 'Nam Nam Bộ — ấm áp',
    description: 'Giọng nam Sài Gòn, ấm, mộc mạc. Phù hợp nội dung gần gũi.',
    prompt:
      'The speaker is a Southern Vietnamese man in his 30s from Saigon, with a warm relaxed mid-pitch voice, smooth unhurried pacing, distinct Southern accent (clear "v" pronounced as "y", soft tones), and a friendly down-to-earth tone.',
  },
  {
    id: 'nu-nam-tinh',
    label: 'Nữ Nam Bộ — tình cảm',
    description: 'Giọng nữ Sài Gòn, mềm mại, truyền cảm.',
    prompt:
      'The speaker is a Southern Vietnamese woman in her late 20s from Saigon, with a soft emotive mid-pitch voice, smooth lyrical pacing, distinct Southern accent, and a tender heartfelt delivery.',
  },
  {
    id: 'tre-em-nam',
    label: 'Bé trai',
    description: 'Giọng trẻ em nam, khoảng 8 tuổi.',
    prompt:
      'The speaker is a Vietnamese boy around 8 years old, with a bright high-pitched childlike voice, innocent cheerful delivery, neutral accent, and youthful playful energy.',
  },
  {
    id: 'tre-em-nu',
    label: 'Bé gái',
    description: 'Giọng trẻ em nữ, khoảng 8 tuổi.',
    prompt:
      'The speaker is a Vietnamese girl around 8 years old, with a sweet high-pitched childlike voice, gentle innocent delivery, neutral accent, and a soft cheerful tone.',
  },
]

// Default preset used when the user hasn't selected one (keeps existing behavior consistent).
export const DEFAULT_VOICE_ID = 'nu-bac-ngot'

export function getVoicePreset(id: string | undefined | null): VoicePreset | undefined {
  if (!id) return undefined
  return VOICE_PRESETS.find((v) => v.id === id)
}

// Service slugs whose order form should render the voice selector.
export const VOICE_ENABLED_SLUGS = new Set<string>([
  'anh-thanh-video',
  'tao-video-tu-van-ban',
])

export function isVoiceEnabledService(serviceSlug: string): boolean {
  return VOICE_ENABLED_SLUGS.has(serviceSlug)
}

/**
 * Build the Vietnamese-language + voice description prefix that gets prepended
 * to the user's prompt before sending to Grok Imagine.
 */
export function buildVoicePromptPrefix(voiceId: string | undefined | null): string {
  const preset = getVoicePreset(voiceId) ?? getVoicePreset(DEFAULT_VOICE_ID)!
  if (preset.id === NO_VOICE_ID) {
    return `[Audio: ${preset.id}] ${preset.prompt}`
  }
  return `[Language: Vietnamese] The characters speak Vietnamese. All spoken dialogue, narration, and voice-over are in Vietnamese. [Voice: ${preset.id}] ${preset.prompt}`
}
