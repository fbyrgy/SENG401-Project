import React, { useState } from 'react';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css'; 

const Chatbox = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false); 

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    setChatHistory((prevHistory) => [...prevHistory, `You: ${userMessage}`]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5005/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Received response from AI:", data);

      if (data.response) {
        setChatHistory((prevHistory) => [...prevHistory, `AI: ${data.response}`]);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
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
        minConstraints={[200, 50]}  // Minimum size
        maxConstraints={[600, 600]}  // Maximum size
        axis="both"
        resizeHandles={['nw']} // Resize handle at the top-left corner
      >
        <div className="bg-[#404040] text-white rounded-lg shadow-lg flex flex-col resize overflow-hidden border border-[#181818] relative">
          {/* Resize Handle - Positioned in the top-left corner */}
          <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize bg-gray-600 rounded-full"></div>

          {/* Header */}
          <div className="flex justify-between items-center p-2">
            <span className="text-lg font-bold">Chat</span>
            <button
              onClick={toggleMinimize}
              className="text-3xl font-extrabold text-gray-300 hover:text-white"
            >
              {isMinimized ? '＋' : '－'}
            </button>
          </div>

          {!isMinimized && (
            <>
              <div className="flex-grow p-4 overflow-y-auto space-y-2">
                {chatHistory.map((message, index) => {
                  const isAIMessage = message.startsWith("AI:");
                  return (
                    <p
                      key={index}
                      className={`text-sm p-2 rounded-lg ${
                        isAIMessage ? "bg-gray-700 text-gray-200" : "bg-gray-800 text-white"
                      }`}
                    >
                      {message}
                    </p>
                  );
                })}
                {isLoading && <p className="text-sm text-gray-400">AI is typing...</p>}
              </div>

              <form className="flex p-4 border-t border-[#181818]" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Type your message..."
                  required
                  className="flex-grow p-2 border border-[#181818] rounded-lg mr-2 bg-[#181818] text-white placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-[#31854D] text-white rounded-lg disabled:bg-gray-600 hover:bg-[#1f7c3d]"
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
