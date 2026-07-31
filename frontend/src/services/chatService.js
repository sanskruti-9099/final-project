import api from './api';

export const chatService = {
  /**
   * Send a question to the AI chat endpoint.
   * @param {string} question - The user's question
   * @returns {Promise<string>} The AI's answer
   */
  async askQuestion(question) {
    const response = await api.post('/chat', { question });
    if (response.data && response.data.success) {
      return response.data.answer;
    }
    throw new Error('Unexpected response format from server');
  },
};
