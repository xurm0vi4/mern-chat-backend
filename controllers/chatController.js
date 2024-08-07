import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.userId }).populate('messages').populate('user');
    res.json(chats);
  } catch (error) {
    console.log('Error in getChats controller:', error.message);
    res.status(404).json({ error: 'Chats are not found' });
  }
};

export const getOneChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id }).populate('messages').populate('user');
    res.json(chat);
  } catch (error) {
    console.log('Error in getOneChat controller:', error.message);
    res.status(404).json({ error: 'Chat is not found' });
  }
};

export const createChat = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    const chat = await Chat.findOne({ firstName, lastName, user: req.userId });
    if (chat) {
      return res.status(400).json({ error: 'This chat already exists' });
    }

    const newChat = new Chat({ firstName, lastName, user: req.userId });
    await newChat.save();
    res.json(newChat);
  } catch (error) {
    console.log('Error in createChat controller', error.message);
    res.status(400).json({ error: 'Error in creating chat' });
  }
};

export const updateChat = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const chat = await Chat.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName },
      { new: true },
    );
    res.json(chat);
  } catch (error) {
    console.log('Error in updateChat controller', error.message);
    res.status(400).json({ error: 'Error in updating chat' });
  }
};

export const deleteChat = async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.json({ message: 'Chat deleted' });
  } catch (error) {
    console.log('Error in deleteChat controller', error.message);
    res.status(404).json({ error: 'Error in deleting chat' });
  }
};
