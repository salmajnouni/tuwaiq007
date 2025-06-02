import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [prompt, setPrompt] = useState('');
  const [greeting, setGreeting] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [posterBase64, setPosterBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'Tuwaiq007Beta') {
      setIsAuthenticated(true);
      setError('');
      setSuccess('تم تسجيل الدخول بنجاح!');
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('يرجى إدخال النص المطلوب');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Step 1: Generate greeting
      const greetingResponse = await axios.post(`${API_BASE_URL}/api/generate-greeting`, {
        prompt: prompt
      });

      if (greetingResponse.data.success) {
        const generatedGreeting = greetingResponse.data.greeting;
        setGreeting(generatedGreeting);

        // Step 2: Generate poster
        const posterResponse = await axios.post(`${API_BASE_URL}/api/generate-poster`, {
          greeting: generatedGreeting,
          background_color: '#2e7d32'
        });

        if (posterResponse.data.success) {
          if (posterResponse.data.poster_url) {
            setPosterUrl(posterResponse.data.poster_url);
            setPosterBase64('');
          } else if (posterResponse.data.poster_base64) {
            setPosterBase64(posterResponse.data.poster_base64);
            setPosterUrl('');
          }
          setSuccess('تم إنشاء الملصق بنجاح!');
        } else {
          setError('فشل في إنشاء الملصق: ' + posterResponse.data.error);
        }
      } else {
        setError('فشل في إنشاء التهنئة: ' + greetingResponse.data.error);
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (posterBase64) {
      const link = document.createElement('a');
      link.href = posterBase64;
      link.download = 'tuwaiq007-poster.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (posterUrl) {
      window.open(posterUrl, '_blank');
    }
  };

  const handleShare = (platform) => {
    const text = `${greeting} - مولد ملصقات طويق 007`;
    const imageUrl = posterUrl || posterBase64;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + imageUrl)}`, '_blank');
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL, so we'll copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
          alert('تم نسخ النص! يمكنك الآن لصقه في Instagram');
        });
        break;
      case 'snapchat':
        // Snapchat doesn't support direct sharing via URL
        navigator.clipboard.writeText(text).then(() => {
          alert('تم نسخ النص! يمكنك الآن لصقه في Snapchat');
        });
        break;
      default:
        break;
    }
  };

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      // In a real app, this would send feedback to the backend
      console.log('Feedback submitted:', feedback);
      setSuccess('شكراً لك على ملاحظاتك!');
      setFeedback('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="app">
        <div className="container">
          <div className="header">
            <h1>طويق 007</h1>
            <p>مولد الملصقات بالذكاء الاصطناعي لليوم الوطني السعودي</p>
          </div>
          
          <div className="login-container">
            <h2>تسجيل الدخول</h2>
            <form onSubmit={handleLogin}>
              <div className="input-section">
                <input
                  type="password"
                  className="input-field"
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">
                دخول
              </button>
            </form>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>طويق 007</h1>
          <p>مولد الملصقات بالذكاء الاصطناعي لليوم الوطني السعودي</p>
        </div>

        <div className="main-content">
          <form onSubmit={handleSubmit}>
            <div className="input-section">
              <label htmlFor="prompt">اكتب طلبك هنا:</label>
              <input
                id="prompt"
                type="text"
                className="input-field"
                placeholder="مثال: أعمل بوستر لليوم الوطني أو أعمل بوستر بتهنئة: كل عام ووطني بخير"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'جاري الإنشاء...' : 'إنشاء الملصق'}
            </button>
          </form>

          {loading && <div className="loading">جاري إنشاء الملصق...</div>}
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {(posterUrl || posterBase64) && (
            <div className="poster-preview">
              <h3>الملصق الخاص بك:</h3>
              <img
                src={posterUrl || posterBase64}
                alt="Generated Poster"
                className="poster-image"
              />
              
              <div className="action-buttons">
                <button onClick={handleDownload} className="action-btn download">
                  تحميل الملصق
                </button>
                <button onClick={() => handleShare('whatsapp')} className="action-btn whatsapp">
                  مشاركة في واتساب
                </button>
                <button onClick={() => handleShare('instagram')} className="action-btn instagram">
                  مشاركة في إنستغرام
                </button>
                <button onClick={() => handleShare('snapchat')} className="action-btn snapchat">
                  مشاركة في سناب شات
                </button>
              </div>
            </div>
          )}

          <div className="feedback-section">
            <h3>ملاحظاتك وتعليقاتك:</h3>
            <textarea
              className="feedback-textarea"
              placeholder="شاركنا رأيك في الخدمة أو اقتراحاتك للتحسين..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <button 
              onClick={handleFeedbackSubmit} 
              className="submit-btn"
              style={{ marginTop: '15px' }}
            >
              إرسال الملاحظات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

