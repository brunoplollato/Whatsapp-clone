import { Avatar, IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../../firebase';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import { useRef, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebase from 'firebase'
import TimeAgo from 'timeago-react';

import Message from '../Message';

import { Container,
          Header,
          HeaderInformation,
          HeaderIcons,
          MessageContainer,
          EndOfMessage,
          InputContainer,
          Input
        } from './styles';
import { getRecipientEmail } from '../../utils/getRecipientEmail';

function ChatScreen({ chat, messages }) {
  const [ user ] = useAuthState(auth)
  const [ input, setInput ] = useState('')
  const router = useRouter()
  const endOfMessageRef = useRef(null)
  const [ messagesSnapshot ] = useCollection(
    db.collection('chats')
      .doc(router.query.id as string)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      )

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map(message => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ))
    } else {
      return JSON.parse(messages).map(message => (
        <Message
          key={message.id}
          user={message.user}
          message={message}
        />
      ))
    }
  }

  const ScrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection('users').doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    )

    db.collection('chats').doc(router.query.id as string).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL
    })

    setInput('')
    ScrollToBottom()
  }

  const [ recipientSnapshot ] = useCollection(
    db
    .collection('users')
    .where('email', '==', getRecipientEmail(chat.users, user))
    ) 

  const recipientEmail = getRecipientEmail(chat.users, user)
  const recipient = recipientSnapshot?.docs?.[0]?.data()
    
  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}

        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last active: {' '}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : 'Unavailable'}
            </p>
          ) : (
            <p>
              Loading Last active...
            </p>
          )}
        </HeaderInformation>
        
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessageRef} />
      </MessageContainer>

      <InputContainer>
        <InsertEmoticonIcon />
        <Input value={input} onChange={e => setInput(e.target.value)} />
        <button hidden disabled={!input} type='submit' onClick={sendMessage}>Send Message</button>
        <MicIcon />
      </InputContainer>
    </Container>
  );
};

export default ChatScreen;
