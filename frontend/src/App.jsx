import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ModeToggle from './components/ModeToggle';
import UploadArea from './components/UploadArea';
import PromptInput from './components/PromptInput';
import StyleSelector from './components/StyleSelector';
import ResultsPanel from './components/ResultsPanel';
import { Layers, Box, Maximize2 } from 'lucide-react';

function App() {
  const [mode, setMode] = useState('video');
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [showResultsMobile, setShowResultsMobile] = useState(false);

  // Form states
  const [videoImages, setVideoImages] = useState([]); // Support multiple
  const [videoFile, setVideoFile] = useState(null);
  const [videoPrompt, setVideoPrompt] = useState('');

  const [avatarImage, setAvatarImage] = useState(null);
  const [avatarStyle, setAvatarStyle] = useState('cyberpunk');
  const [avatarPrompt, setAvatarPrompt] = useState('');
  const [resolution, setResolution] = useState('1024x1024');
  const [avatarOptions, setAvatarOptions] = useState({
    crop: false,
    removeBg: false,
    batch: true,
  });

  useEffect(() => {
    const savedHistory = localStorage.getItem('ai_studio_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const saveToHistory = (newResults) => {
    setHistory(prev => {
      const updated = [...newResults, ...prev].slice(0, 20);
      return updated;
    });
  };

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('ai_studio_history', JSON.stringify(history));
    }
  }, [history]);

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 300);
    return interval;
  };

  const handleGenerate = async () => {
    if ((mode === 'video' && (!videoImages.length || !videoFile)) || (mode === 'avatar' && !avatarImage)) {
      alert('Please upload all required media before generating.');
      return;
    }

    setLoading(true);
    const progressInterval = simulateProgress();

    // Simulate AI processing time
    const waitTime = mode === 'video' ? 4000 : 3000;

    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);

      const requestId = Math.random().toString(36).substring(7);
      let newResults = [];

      if (mode === 'video') {
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
          original: videoImages.length > 0 ? URL.createObjectURL(videoImages[0]) : null,
          filter: dynamicFilter,
          label: 'Style Transfer'
        }];
      } else {
        const imageUrl = URL.createObjectURL(avatarImage);
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
          // Add some variation for batch
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

      setResults(newResults);
      saveToHistory(newResults);
      setLoading(false);
      setProgress(0);
      // Always show results panel on smaller screens, and ensure it's "notified" on desktop
      setShowResultsMobile(true);
    }, waitTime);
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="flex-1 flex overflow-hidden relative">
        {/* Editor Section */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-[#010101]">
          <div className="max-w-4xl mx-auto space-y-8 md:space-y-10">
            {activeTab === 'home' ? (
              <>
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Studio Editor</h1>
                    <p className="text-gray-500 mt-1 text-sm">Transform your vision into AI-powered media.</p>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <ModeToggle mode={mode} setMode={setMode} />
                    <button
                      onClick={() => setShowResultsMobile(true)}
                      className="xl:hidden p-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors"
                    >
                      <Maximize2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="bg-dark-card border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl space-y-8">
                  {mode === 'video' ? (
                    <div className="space-y-8">
                      <div className="flex flex-col md:flex-row gap-6">
                        <UploadArea
                          label="Reference Images"
                          type="image"
                          file={videoImages[0]} // Show first for preview
                          setFile={(f) => setVideoImages(prev => Array.isArray(f) ? f : [f])}
                          accept="image/*"
                          multiple={true}
                        />
                        <UploadArea
                          label="Source Video"
                          type="video"
                          file={videoFile}
                          setFile={setVideoFile}
                          accept="video/*"
                        />
                      </div>
                      <PromptInput
                        prompt={videoPrompt}
                        setPrompt={setVideoPrompt}
                        placeholder="Describe how the image should match the video motion and style..."
                        buttonText="Generate Video"
                        onGenerate={handleGenerate}
                        loading={loading}
                      />
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-[0.4]">
                          <UploadArea
                            label="Portrait Image"
                            type="image"
                            file={avatarImage}
                            setFile={setAvatarImage}
                            accept="image/*"
                          />
                        </div>
                        <div className="flex-[0.6] space-y-6">
                          <StyleSelector
                            selectedStyle={avatarStyle}
                            setSelectedStyle={setAvatarStyle}
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <label className="text-sm font-medium text-gray-400">Resolution</label>
                              <div className="flex gap-2">
                                {['256x256', '512x512', '1024x1024'].map(res => (
                                  <button
                                    key={res}
                                    onClick={() => setResolution(res)}
                                    className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all ${
                                      resolution === res
                                        ? 'bg-primary-blue border-primary-blue text-white'
                                        : 'bg-white/5 border-white/10 text-gray-400'
                                    }`}
                                  >
                                    {res.split('x')[0]}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-3">
                              <label className="text-sm font-medium text-gray-400">Enhancements</label>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setAvatarOptions(prev => ({ ...prev, crop: !prev.crop }))}
                                  className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all ${
                                    avatarOptions.crop
                                      ? 'bg-primary-red border-primary-red text-white'
                                      : 'bg-white/5 border-white/10 text-gray-400'
                                  }`}
                                >
                                  CROP FACE
                                </button>
                                <button
                                  onClick={() => setAvatarOptions(prev => ({ ...prev, removeBg: !prev.removeBg }))}
                                  className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all ${
                                    avatarOptions.removeBg
                                      ? 'bg-primary-red border-primary-red text-white'
                                      : 'bg-white/5 border-white/10 text-gray-400'
                                  }`}
                                >
                                  REMOVE BG
                                </button>
                                <button
                                  onClick={() => setAvatarOptions(prev => ({ ...prev, batch: !prev.batch }))}
                                  className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all ${
                                    avatarOptions.batch
                                      ? 'bg-primary-red border-primary-red text-white'
                                      : 'bg-white/5 border-white/10 text-gray-400'
                                  }`}
                                >
                                  BATCH (4x)
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <PromptInput
                        prompt={avatarPrompt}
                        setPrompt={setAvatarPrompt}
                        placeholder="Detail your avatar customization (e.g., 'cyberpunk astronaut')..."
                        buttonText="Create Avatar"
                        onGenerate={handleGenerate}
                        loading={loading}
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-8">
                <header>
                  <h1 className="text-3xl font-bold tracking-tight">History</h1>
                  <p className="text-gray-500 mt-1">Your recent generations.</p>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {history.length > 0 ? (
                    history.map((item, idx) => (
                      <div key={idx} className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden group">
                        <div className="aspect-square relative overflow-hidden">
                          {item.type === 'video' ? (
                            <video src={item.url} className="w-full h-full object-cover" style={{ filter: item.filter }} />
                          ) : (
                            <img src={item.url} alt="Generated" className="w-full h-full object-cover" style={{ filter: item.filter }} />
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                             <button className="p-3 bg-primary-blue rounded-full text-white hover:scale-110 transition-transform">
                                <Maximize2 size={20} />
                             </button>
                          </div>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.type}</span>
                          <span className="text-[10px] text-gray-600">2h ago</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center text-gray-500">
                      No history yet. Start creating to see your work here.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Privacy Notice */}
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 text-xs text-gray-400">
               <div className="w-8 h-8 rounded-full bg-primary-blue/10 flex items-center justify-center text-primary-blue shrink-0">
                 <Maximize2 size={16} />
               </div>
               <p>
                 <span className="font-bold text-white mr-1 uppercase tracking-widest text-[10px]">Privacy First:</span>
                 Your uploaded media is processed in real-time and not stored permanently on our servers.
               </p>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <ResultsPanel
          results={results}
          loading={loading}
          progress={progress}
          isOpen={showResultsMobile}
          onClose={() => setShowResultsMobile(false)}
        />
      </div>
    </Layout>
  );
}

export default App;
