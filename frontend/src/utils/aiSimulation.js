const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const simulateAIProcessing = async (mode, data) => {
  try {
    if (mode === 'video') {
      const { videoFile, videoPrompt, videoImages } = data;

      const formData = new FormData();
      formData.append('identity_image', videoImages[0]);
      formData.append('motion_video', videoFile);
      formData.append('prompt', videoPrompt);

      const response = await fetch(`${API_BASE_URL}/process-video`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process video');
      }

      const result = await response.json();

      return [{
        id: result.id,
        url: `${API_BASE_URL}${result.output_url}`,
        type: 'video',
        original: URL.createObjectURL(videoImages[0]),
        filter: 'none',
        label: 'AI Motion Replication',
        isMotionMap: false
      }];
    } else {
      const { avatarImage, avatarStyle, avatarPrompt, avatarOptions, resolution } = data;

      const formData = new FormData();
      formData.append('image', avatarImage);
      formData.append('style', avatarStyle);
      formData.append('prompt', avatarPrompt);
      formData.append('resolution', resolution);
      formData.append('variations', avatarOptions.batch ? 4 : 1);
      formData.append('remove_bg', avatarOptions.removeBg);

      const response = await fetch(`${API_BASE_URL}/create-avatar`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create avatar');
      }

      const result = await response.json();

      return result.outputs.map((url, i) => ({
        id: `${result.id}-${i}`,
        url: `${API_BASE_URL}${url}`,
        type: 'avatar',
        original: URL.createObjectURL(avatarImage),
        filter: 'none',
        label: `${avatarStyle}${i > 0 ? ` Var ${i+1}` : ''}`
      }));
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
