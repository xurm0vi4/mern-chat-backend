import Message from '../models/Message.js';
import Chat from '../models/Chat.js';

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const chat = await Chat.findById(req.params.id);

    const userMessage = new Message({ text, chat: chat._id, isBot: false });
    await userMessage.save();
    chat.messages.push(userMessage);
    await chat.save();

    req.io.emit('newMessage', { chat: chat._id, message: userMessage });
    res.json(userMessage);
  } catch (error) {
    console.log('Error in sendMessage controller', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const sendMessageFromBot = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    const botMessageText = data.content;

    const botMessage = new Message({ text: botMessageText, isBot: true, chat: chat._id });
    await botMessage.save();
    chat.messages.push(botMessage);
    await chat.save();

    req.io.emit('newMessage', { chat: chat._id, message: botMessage });
    res.json(botMessage);
  } catch (error) {
    console.log('Error in sendMessageFromBot controller', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const { text, _id } = req.body;
    const updatedMessage = await Message.findByIdAndUpdate(_id, { text }, { new: true });

    if (!updatedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    req.io.emit('updateMessage', { messageId: updatedMessage._id, text: updatedMessage.text });

    res.json(updatedMessage);
  } catch (error) {
    console.log('Error in updateMessage controller', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
