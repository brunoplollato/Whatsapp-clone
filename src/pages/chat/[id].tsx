import Head from 'next/head';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../../firebase';
import ChatScreen from '../../components/ChatScreen';

import Sidebar from '../../components/Sidebar';
import { getRecipientEmail } from '../../utils/getRecipientEmail';

import { Container, ChatContainer } from './styles';

export default function Chat({ messages, chat }) {
  const [ user ] = useAuthState(auth)

  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  )
}

export async function getServerSideProps(context) {
  const ref = db.collection('chats').doc(context.query.id)

  // PREP the messages on the server
  const messageRes = await ref
    .collection('messages')
    .orderBy('timestamp', 'asc')
    .get()

  const messages = messageRes.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })).map(messages => ({
    ...messages,
    timestamp: messages.timestamp.toDate().getTime()
  }))

  // PREP the chats
  const chatRes = await ref.get()
  const chat = {
    id: chatRes.id,
    ...chatRes.data()
  }

  return {
    props: {
      messages: JSON.stringify(messages),
      chat
    }
  }
}