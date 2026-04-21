import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, X, Send, Bot, User, ChevronDown, Loader2, AlertCircle } from 'lucide-react';

const GOLD = '#c9a84c';
const GOLD_LIGHT = '#e0c873';

// Page-specific suggested question chips
const SUGGESTIONS = {
  'Price Volatility': [
    'Which product needs immediate attention?',
    'What is causing the high volatility?',
    'Recommend a pricing strategy',
    'Summarize the current risk level',
  ],
  'Billing Anomaly Detection': [
    'What are the critical anomalies right now?',
    'How do I resolve duplicate charges?',
    'Summarize today\'s revenue risk',
    'Which anomalies need urgent action?',
  ],
  'Demand Forecast': [
    'Which category needs more stock?',
    'Explain the forecast accuracy',
    'What is the seasonal demand trend?',
    'Which products have declining demand?',
  ],
};

const SYSTEM_PROMPTS = {
  'Price Volatility':
    'You are InsightBI\'s AI analyst specializing in price volatility and market risk. You help administrators understand pricing trends, volatility metrics, and risk levels. Be concise, actionable, and data-driven. Use the live data context provided to give specific insights.',
  'Billing Anomaly Detection':
    'You are InsightBI\'s AI analyst specializing in billing anomaly detection and fraud prevention. You help administrators identify, prioritize, and resolve billing irregularities. Be concise, actionable, and urgent about critical issues. Use the live data context provided to give specific insights.',
  'Demand Forecast':
    'You are InsightBI\'s AI analyst specializing in demand forecasting and inventory planning. You help administrators understand demand patterns, forecast accuracy, and category trends. Be concise, actionable, and forward-looking. Use the live data context provided to give specific insights.',
};

// ── Mock Streaming Fallback ──
const simulateMockResponse = (messages, pageTitle, context, onChunk, onDone) => {
  let reply = "I analyzed the dashboard. ";
  
  if (pageTitle === 'Price Volatility') {
    reply = "Based on the live data, Product B and E are showing high volatility. I recommend reviewing their pricing strategy immediately. The overall risk score is currently " + (context?.metrics?.riskScore || 33) + "/100.";
  } else if (pageTitle === 'Billing Anomaly Detection') {
    reply = "I detect " + (context?.metrics?.totalAnomalies || 156) + " anomalies today. There are critical anomalies putting " + (context?.revenueAtRisk || "$8,700") + " at risk. Focus on duplicate charges first.";
  } else if (pageTitle === 'Demand Forecast') {
    reply = "The forecast accuracy is strong at " + (context?.metrics?.forecastAccuracy || 92.7) + "%. Electronics demand is predicted to rise significantly. Ensure adequate stock levels for the upcoming months.";
  } else {
    reply = "Everything looks stable according to the latest data.";
  }

  const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
  if (lastUserMsg.includes('product') || lastUserMsg.includes('category') || lastUserMsg.includes('stock')) {
    reply += " I recommend focusing on the high-risk items highlighted in the table below. They require immediate attention to stabilize the metrics.";
  } else if (lastUserMsg.includes('resolve') || lastUserMsg.includes('action')) {
    reply += " Please navigate to the detail view of the top flagged items to take action immediately.";
  } else if (lastUserMsg.includes('hi') || lastUserMsg.includes('hello')) {
    reply = "Hello! I'm ready to analyze your dashboard. What would you like to know about the current metrics?";
  }

  const words = reply.split(' ');
  let i = 0;
  
  const interval = setInterval(() => {
    if (i < words.length) {
      onChunk(words[i] + ' ');
      i++;
    } else {
      clearInterval(interval);
      onDone();
    }
  }, 60); 
};

// ── Gemini Streaming API Call ──
const streamGemini = async (messages, pageTitle, context, onChunk, onDone, onError) => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') {
    // Fallback to mock if no key
    return simulateMockResponse(messages, pageTitle, context, onChunk, onDone);
  }

  const systemPrompt = SYSTEM_PROMPTS[pageTitle] || SYSTEM_PROMPTS['Price Volatility'];
  const contextStr = context ? `\n\nLive Dashboard Data:\n${JSON.stringify(context, null, 2)}` : '';

  // Build Gemini contents array (multi-turn)
  const contents = messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  // Prepend system context into first user message
  if (contents.length > 0 && contents[0].role === 'user') {
    contents[0].parts[0].text = `${systemPrompt}${contextStr}\n\nUser: ${contents[0].parts[0].text}`;
  }

  const body = {
    contents,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData?.error?.message || `API error: ${response.status}`;
      // Fallback to mock if API key is suspended or invalid
      if (response.status === 403 || errMsg.includes('suspended') || errMsg.includes('API_KEY_INVALID')) {
        throw new Error('MOCK_FALLBACK');
      }
      throw new Error(errMsg);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep incomplete line

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const chunk = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (chunk) onChunk(chunk);
          } catch {}
        }
      }
    }
    onDone();
  } catch (err) {
    if (err.message === 'MOCK_FALLBACK') {
      simulateMockResponse(messages, pageTitle, context, onChunk, onDone);
    } else {
      onError(err.message || 'Failed to reach AI. Please try again.');
    }
  }
};

// ── Message Bubble ──
const MessageBubble = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ marginBottom: '16px' }}
    >
      {/* Avatar */}
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: isUser ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.25)',
          border: `1px solid ${isUser ? 'rgba(201,168,76,0.3)' : GOLD}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isUser ? (
          <User style={{ width: '16px', height: '16px', color: GOLD }} />
        ) : (
          <Bot style={{ width: '16px', height: '16px', color: GOLD }} />
        )}
      </div>

      {/* Bubble */}
      <div
        style={{
          maxWidth: '78%',
          padding: '10px 14px',
          borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
          background: isUser
            ? 'rgba(201,168,76,0.12)'
            : 'rgba(255,255,255,0.04)',
          border: isUser
            ? '1px solid rgba(201,168,76,0.25)'
            : '1px solid rgba(255,255,255,0.08)',
          color: '#f0ece4',
          fontSize: '0.875rem',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {msg.content}
        {msg.streaming && (
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '14px',
              background: GOLD,
              borderRadius: '2px',
              marginLeft: '4px',
              animation: 'aiCursorBlink 0.8s ease infinite',
              verticalAlign: 'text-bottom',
            }}
          />
        )}
      </div>
    </div>
  );
};

// ── Main AiAssistant Component ──
const AiAssistant = ({ pageTitle, context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const suggestions = SUGGESTIONS[pageTitle] || [];

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = useCallback(
    async (text) => {
      const userText = text || input.trim();
      if (!userText || isStreaming) return;
      setInput('');
      setError('');

      const userMsg = { role: 'user', content: userText };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setIsStreaming(true);

      // Placeholder assistant message for streaming
      const assistantMsg = { role: 'assistant', content: '', streaming: true };
      setMessages((prev) => [...prev, assistantMsg]);

      await streamGemini(
        updatedMessages,
        pageTitle,
        context,
        // onChunk — append to last message
        (chunk) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.role === 'assistant') {
              updated[updated.length - 1] = { ...last, content: last.content + chunk };
            }
            return updated;
          });
        },
        // onDone — remove streaming flag
        () => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.role === 'assistant') {
              updated[updated.length - 1] = { ...last, streaming: false };
            }
            return updated;
          });
          setIsStreaming(false);
        },
        // onError
        (errMsg) => {
          setMessages((prev) => prev.filter((m) => !(m.role === 'assistant' && m.content === '')));
          setError(errMsg);
          setIsStreaming(false);
        }
      );
    },
    [input, messages, isStreaming, pageTitle, context]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError('');
  };

  return (
    <>
      {/* CSS Animations */}
      <style>{`
        @keyframes aiCursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes aiPanelSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes aiButtonPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201, 168, 76, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(201, 168, 76, 0); }
        }
        @keyframes aiSparkle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-8deg) scale(1.1); }
          75% { transform: rotate(8deg) scale(1.1); }
        }
        .ai-fab:hover .ai-sparkle-icon {
          animation: aiSparkle 0.5s ease;
        }
        .ai-suggestion-chip:hover {
          background: rgba(201,168,76,0.2) !important;
          border-color: rgba(201,168,76,0.5) !important;
          transform: translateY(-1px);
        }
        .ai-send-btn:hover:not(:disabled) {
          background: rgba(201,168,76,0.9) !important;
          transform: scale(1.05);
        }
        .ai-send-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>

      {/* Floating Action Button */}
      {!isOpen && (
        <button
          className="ai-fab"
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 22px',
            borderRadius: '50px',
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
            border: 'none',
            cursor: 'pointer',
            color: '#060606',
            fontWeight: 700,
            fontSize: '0.875rem',
            letterSpacing: '0.02em',
            animation: 'aiButtonPulse 3s ease infinite',
            transition: 'all 0.2s ease',
            boxShadow: '0 8px 32px rgba(201,168,76,0.35)',
          }}
        >
          <Sparkles className="ai-sparkle-icon" style={{ width: '18px', height: '18px' }} />
          Ask AI
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            zIndex: 1000,
            width: '420px',
            maxWidth: 'calc(100vw - 40px)',
            borderRadius: '20px',
            background: '#0a0a0a',
            border: '1px solid rgba(201,168,76,0.25)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.1)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'aiPanelSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            overflow: 'hidden',
          }}
        >
          {/* Panel Header */}
          <div
            style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.05))',
              borderBottom: '1px solid rgba(201,168,76,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles style={{ width: '18px', height: '18px', color: '#060606' }} />
              </div>
              <div>
                <p style={{ color: '#f0ece4', fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>
                  InsightBI AI
                </p>
                <p style={{ color: '#a09888', fontSize: '0.72rem', margin: 0 }}>
                  {pageTitle} Analyst · Powered by Gemini
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  title="Clear chat"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#605848',
                    fontSize: '0.7rem',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#a09888')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#605848')}
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsMinimized((m) => !m)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#605848',
                  display: 'flex',
                  padding: '4px',
                  borderRadius: '6px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#a09888')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#605848')}
              >
                <ChevronDown
                  style={{
                    width: '18px',
                    height: '18px',
                    transform: isMinimized ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </button>
              <button
                onClick={() => { setIsOpen(false); setIsMinimized(false); }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#605848',
                  display: 'flex',
                  padding: '4px',
                  borderRadius: '6px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#605848')}
              >
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
          </div>

          {/* Collapsible Body */}
          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '20px',
                  minHeight: '320px',
                  maxHeight: '420px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(201,168,76,0.2) transparent',
                }}
              >
                {/* Welcome / Empty State */}
                {messages.length === 0 && (
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 12px',
                      }}
                    >
                      <Sparkles style={{ width: '28px', height: '28px', color: '#060606' }} />
                    </div>
                    <p style={{ color: '#f0ece4', fontWeight: 600, fontSize: '0.95rem', margin: '0 0 6px' }}>
                      Hi, I'm your {pageTitle} Analyst
                    </p>
                    <p style={{ color: '#605848', fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>
                      I can see your live dashboard data.<br />Ask me anything about the metrics below.
                    </p>
                  </div>
                )}

                {/* Suggestion Chips — show only when no messages */}
                {messages.length === 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        className="ai-suggestion-chip"
                        onClick={() => sendMessage(s)}
                        disabled={isStreaming}
                        style={{
                          background: 'rgba(201,168,76,0.08)',
                          border: '1px solid rgba(201,168,76,0.2)',
                          borderRadius: '10px',
                          padding: '10px 14px',
                          color: '#e0c873',
                          fontSize: '0.82rem',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Sparkles style={{ width: '13px', height: '13px', flexShrink: 0, opacity: 0.7 }} />
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {/* Messages */}
                {messages.map((msg, i) => (
                  <MessageBubble key={i} msg={msg} />
                ))}

                {/* Error */}
                {error && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      marginTop: '8px',
                    }}
                  >
                    <AlertCircle style={{ width: '16px', height: '16px', color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ color: '#fca5a5', fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>{error}</p>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div
                style={{
                  padding: '14px 16px',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                {/* Streaming indicator */}
                {isStreaming && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '10px',
                      color: '#a09888',
                      fontSize: '0.75rem',
                    }}
                  >
                    <Loader2 style={{ width: '13px', height: '13px', animation: 'spin 1s linear infinite' }} />
                    AI is thinking...
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about this data..."
                    disabled={isStreaming}
                    rows={1}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(201,168,76,0.2)',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      color: '#f0ece4',
                      fontSize: '0.875rem',
                      resize: 'none',
                      outline: 'none',
                      fontFamily: 'inherit',
                      lineHeight: '1.5',
                      transition: 'border-color 0.2s',
                      maxHeight: '120px',
                      overflowY: 'auto',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)')}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                  />
                  <button
                    className="ai-send-btn"
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isStreaming}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: GOLD,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Send style={{ width: '17px', height: '17px', color: '#060606' }} />
                  </button>
                </div>
                <p style={{ color: '#3a3228', fontSize: '0.68rem', margin: '8px 0 0', textAlign: 'center' }}>
                  Context-aware · Powered by Gemini 1.5 Flash
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AiAssistant;
