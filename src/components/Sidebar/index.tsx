import { IconButton } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/More';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '../../../firebase';
import Chat from '../Chat';

import { Container,
  Header, 
  UserAvatar, 
  IconsContainer, 
  Search,
  SearchInput,
  SidebarButton
} from './styles';


function Sidebar() {
  const [ user ] = useAuthState(auth)
  const userChatRef = db.collection('chats').where('users', 'array-contains', user.email)
  const [ chatsSnapshot ] = useCollection(userChatRef)

  const createChat = () => {
    const input = prompt('Please enter an email address for the user you wish to chat with');

    if (!input) return null;

    if (EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
      db.collection('chats').add({
        users: [user.email, input]
      })
    }
  }

  const chatAlreadyExists = (recipientEmail: string) => 
    !!chatsSnapshot?.docs.find(
      chat => chat.data().users.find(
        (user) => user === recipientEmail
      )?.length > 0
    )

  return (
    <Container>
      <Header>
        <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />

        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>

      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search in chats" />
      </Search>

      <SidebarButton onClick={createChat} >Start a new chat</SidebarButton>

      {/* List of Chats */}
      {chatsSnapshot?.docs.map(chat => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
};

export default Sidebar;
