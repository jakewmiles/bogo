import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  RefreshControlBase
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Message from '../components/Message';
import { useMutation, useQuery } from '@apollo/client'
import { GET_MESSAGES, SEND_MESSAGES, userVar } from '../client';

interface Props {
  navigation: any;
  route: any;
}

interface Message {
  id: number;
  user: boolean;
  createdOn: string;
  content: string;
}

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => { setValue(value => value + 1); }
}

const ContactsChat = (props: Props) => {

  const forceUpdate = useForceUpdate;

  let chatId = '';

  if (props.route.params.chatId) {
    chatId = props.route.params.chatId;
  } else {
    const userChats = userVar().user.chats;

    //check whether any of the chats for the active user is with the selected profile
    userChats.forEach((chat: any) => {
      if (chat.userId === props.route.params.id || chat.user1Id === props.route.params.id) {
        chatId = chat.id;
      }
    })
  }
  const userId = userVar().user.id
  const [messageContent, setMessageContent] = useState<string>('');
  const [messagesArray, setMessagesArray] = useState<any[]>([]);

  let { loading, error, data } = useQuery(GET_MESSAGES, {
    variables: {
      messageInput: { chatId },
      pollIntervall: 500
    }
  })

  const [sendMessage, sendMessageQuery] = useMutation(SEND_MESSAGES, {
    variables: { messageInput: { senderId: userId, recieverId: props.route.params.id, content: messageContent, chatId } }
  })

  let flatList;

  if (error) flatList = (<View style={styles.emptyMessageView}><Text style={styles.emptyMessageText}>This chat has no messages</Text></View>);

  if (loading) return <View><Text>Loading</Text></View>

  if (data) {
    data.messages.sort((a, b) => { return b.id - a.id })
    flatList = (<FlatList
      inverted={true}
      style={styles.messageView}

      data={data.messages}
      keyExtractor={item => String(item.id)}
      renderItem={({ item }) => {
        return (
          <Message
            id={item.id}
            user={item.authorId}
            createdOn={item.createdAt}
            content={item.content}
          />
        );
      }}
    />);
  }

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
    }}>
      <KeyboardAvoidingView
        style={styles.view}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.goBack}
            onPress={() => props.navigation.navigate('ContactsHome')}
          >
            <MaterialCommunityIcons
              name={'arrow-left'}
              color={'rgba(153, 135, 157, 0.7)'}
              size={20}

            />
            <Text style={styles.goBackText}> Back</Text></TouchableOpacity>
          <Text style={styles.mainHeader}>{props.route.params.firstName} </Text>
          <Text style={styles.mainInfo}>{props.route.params.city} {props.route.params.country} </Text>
          <Image
            style={styles.image}
            source={{
              uri: props.route.params.profilePicture,
            }}
          />
        </View>
        {flatList}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={messageContent}
            onChangeText={setMessageContent}
            multiline={true}
            numberOfLines={2}
            placeholder="Type message"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              sendMessage()
              setMessageContent('')
              props.navigation.navigate('ContactsChat');
            }}
          >
            <MaterialCommunityIcons
              name={'send'}
              color={'rgba(153, 135, 157, 0.7)'}
              size={25}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  mainInfo: {
    color: 'grey',
    marginLeft: -80,
    alignSelf: 'center',
    marginTop: 55
  },
  headerContainer: {
    flexDirection: 'row',
    height: '18%',
    backgroundColor: 'transparent'
  },
  messageView: {
    backgroundColor: '#FAF9FE',
    flexDirection: 'column',
    flex: 1,
  },
  emptyMessageView: {
    backgroundColor: '#FAF9FE',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMessageText: {
    fontFamily: 'PTSans_400Regular',
    fontSize: 22,
    color: '#99879D',
  },
  goBackText: {
    fontSize: 20,
    color: '#99879D',
    opacity: 0.7
  },
  goBack: {
    paddingTop: '10%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  view: {
    backgroundColor: 'rgba(153, 135, 157, 0.58)',
    flex: 1,
    height: '100%',

  },
  mainHeader: {
    fontFamily: 'PTSans_700Bold',
    fontSize: 30,
    alignSelf: 'center',
    marginLeft: '20%',
  },

  image: {
    marginRight: 20,
    height: 45,
    width: 45,
    resizeMode: 'contain',
    borderRadius: 150,
    alignSelf: 'center',
    marginLeft: '-40%',
    borderWidth: 1,
    borderColor: 'white'
  },
  input: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 20,
    backgroundColor: '#FAF9FE',
    width: '80%',
    alignSelf: 'center',
    textAlignVertical: 'top',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: '5%',
    fontSize: 15,
    marginLeft: '2%',
    marginRight: '3%',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  button: {
    width: 50,
    height: 30,
    alignSelf: 'center',
    textAlignVertical: 'top',
    fontSize: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 40,
  },
});

export default ContactsChat;