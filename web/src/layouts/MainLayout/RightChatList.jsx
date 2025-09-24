import React from 'react'
import ChatView from '../../features/chat/views/ChatView';

function RightChatList() {
  const users = Array(100).fill(10);
  return (
    <div className='w-60 flex flex-col relative h-full'>
     
      <ChatView/>
     
    </div>
  )
}

export default RightChatList