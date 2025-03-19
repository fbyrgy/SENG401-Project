import React, { useState } from 'react';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css'; 
import { BACKEND_URL } from '../config';

const Chatbox = ({ ticker }: { ticker: string }) => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userMessage.trim()) return;

    setChatHistory((prevHistory) => [...prevHistory, `You: ${userMessage}`]);
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/llm/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, ticker }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Received response from AI:", data);

      setChatHistory((prevHistory) => [
        ...prevHistory, 
        data.response ? `AI: ${data.response}` : 'AI: No response available.'
      ]);

    } catch (error) {
      console.error('Error in fetch:', error);
      setChatHistory((prevHistory) => [...prevHistory, 'AI: Sorry, something went wrong.']);
    } finally {
      setUserMessage('');
      setIsLoading(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <ResizableBox
        width={300}
        height={isMinimized ? 50 : 400}
        minConstraints={[250, 50]}
        maxConstraints={[600, 600]}
        axis="both"
        resizeHandles={['nw']}
        className="rounded-lg border border-gray-700 shadow-lg overflow-hidden bg-[#1a1a1a]"
      >
        <div className="flex flex-col h-full">
          {/* Header with Minimize Button */}
          <div className="flex justify-between items-center p-3 bg-[#2c2c2c] text-white border-b border-gray-700">
            <span className="text-lg font-semibold">Chat</span>
            <button
              onClick={toggleMinimize}
              className="text-xl font-bold text-gray-300 hover:text-white"
            >
              {isMinimized ? '＋' : '－'}
            </button>
          </div>

          {!isMinimized && (
            <>
              {/* Chat History */}
              <div className="flex-grow p-4 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {chatHistory.map((message, index) => {
                  const isAIMessage = message.startsWith("AI:");
                  return (
                    <p
                      key={index}
                      className={`text-sm p-2 rounded-lg ${
                        isAIMessage ? "bg-gray-700 text-gray-300" : "bg-gray-800 text-white"
                      }`}
                    >
                      {message}
                    </p>
                  );
                })}
                {isLoading && <p className="text-sm text-gray-400">AI is typing...</p>}
              </div>

              {/* Message Input */}
              <form className="flex p-3 border-t border-gray-700" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Type your message..."
                  required
                  className="flex-grow p-2 border border-gray-600 rounded-lg mr-2 bg-[#262626] text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400 outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-600 hover:bg-green-700 transition"
                >
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </ResizableBox>
    </div>
  );
};

export default Chatbox;
