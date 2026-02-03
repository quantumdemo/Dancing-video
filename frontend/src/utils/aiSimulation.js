export const simulateAIProcessing = (mode, data) => {
  const requestId = Math.random().toString(36).substring(7);
  let newResults = [];

  if (mode === 'video') {
    const { videoFile, videoPrompt, videoImagesPreviews } = data;
    const videoUrl = URL.createObjectURL(videoFile);
    let dynamicFilter = 'contrast(1.2) saturate(1.4)';

    const p = videoPrompt.toLowerCase();
    if (p.includes('neon') || p.includes('cyber')) dynamicFilter += ' hue-rotate(280deg) brightness(1.2)';
    else if (p.includes('old') || p.includes('retro')) dynamicFilter += ' sepia(0.5) contrast(0.8)';
    else if (p.includes('dark')) dynamicFilter += ' brightness(0.7) contrast(1.5)';
    else dynamicFilter += ' hue-rotate(200deg)';

    newResults = [{
      id: requestId,
      url: videoUrl,
      type: 'video',
      original: videoImagesPreviews[0] || null,
      filter: dynamicFilter,
      label: 'Motion Sync',
      isMotionMap: true
    }];
  } else {
    const { avatarImagePreview, avatarStyle, avatarOptions } = data;
    const imageUrl = avatarImagePreview;
    const styleMap = {
      'anime': { filter: 'contrast(1.1) saturate(1.3) brightness(1.1) sepia(0.1)', label: 'Anime' },
      '3d-pixar': { filter: 'saturate(1.8) brightness(1.1) blur(0.4px)', label: '3D Pixar' },
      'cyberpunk': { filter: 'hue-rotate(280deg) contrast(1.2) saturate(1.5) brightness(1.1)', label: 'Cyberpunk' },
      'watercolor': { filter: 'opacity(0.8) contrast(0.8) sepia(0.3) saturate(1.2) blur(0.2px)', label: 'Watercolor' },
      'professional-logo': { filter: 'contrast(1.8) brightness(1.2) grayscale(1)', label: 'Minimalist Logo' },
      'gaming-character': { filter: 'contrast(1.5) brightness(0.9) saturate(1.5) hue-rotate(10deg)', label: 'Gaming' }
    };

    const selectedStyleData = styleMap[avatarStyle] || styleMap['cyberpunk'];
    const count = avatarOptions.batch ? 4 : 1;

    newResults = Array.from({ length: count }).map((_, i) => {
      const hueShift = i * 15;
      const currentFilter = i === 0
        ? selectedStyleData.filter
        : `${selectedStyleData.filter} hue-rotate(${hueShift}deg)`;

      return {
        id: `${requestId}-${i}`,
        url: imageUrl,
        type: 'avatar',
        original: imageUrl,
        filter: currentFilter,
        label: `${selectedStyleData.label}${i > 0 ? ` Var ${i+1}` : ''}`
      };
    });
  }

  return newResults;
};
