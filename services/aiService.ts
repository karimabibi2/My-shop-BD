export const aiChat = async (message: string) => {
  try {
    const response = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) {
      throw new Error('AI service error');
    }
    
    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error('AI Chat Error:', error);
    return "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.";
  }
};
