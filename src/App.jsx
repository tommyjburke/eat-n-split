const initialFriends = [
   {
      id: 118836,
      name: 'Clark',
      image: 'https://i.pravatar.cc/48?u=118836',
      balance: -7,
   },
   {
      id: 933372,
      name: 'Sarah',
      image: 'https://i.pravatar.cc/48?u=933372',
      balance: 20,
   },
   {
      id: 499476,
      name: 'Anthony',
      image: 'https://i.pravatar.cc/48?u=499476',
      balance: 0,
   },
]

import { useState } from 'react'

function Button({ children, onClick }) {
   return (
      <button className='button' onClick={onClick}>
         {children}
      </button>
   )
}

export default function App() {
   const [showAddFriend, setShowAddFriend] = useState(false)
   const [friends, setFriends] = useState(initialFriends)
   const [selectedFriend, setSelectedFriend] = useState(null)

   function handleShowAddFriend() {
      setShowAddFriend((show) => !show)
   }

   function handleAddFriend(friend) {
      setFriends((friends) => [...friends, friend])
      setShowAddFriend(false)
   }

   function handleSelectFriend(friend) {
      // setSelectedFriend(friend)
      setSelectedFriend((current) =>
         current?.id === friend.id ? null : friend
      )
      console.log(friend)
      setShowAddFriend(false)
   }

   return (
      <div className='app'>
         <div className='sidebar'>
            <FriendsList
               friends={friends}
               onSelectFriend={handleSelectFriend}
               selectedFriend={selectedFriend}
            />
            {showAddFriend && (
               <FormAddFriend onAddFriend={handleAddFriend} />
            )}

            <Button onClick={handleShowAddFriend}>
               {showAddFriend ? 'close' : 'add friend'}
            </Button>
         </div>
         {selectedFriend && (
            <FormSplitBill selectedFriend={selectedFriend} />
         )}
      </div>
   )
}

function FriendsList({
   friends,
   onSelectFriend,
   selectedFriend,
}) {
   return (
      <ul>
         {friends.map((friend) => (
            <Friend
               friend={friend}
               onSelectFriend={onSelectFriend}
               key={friend.id}
               selectedFriend={selectedFriend}
            />
         ))}
      </ul>
   )
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
   const isSelected = selectedFriend?.id === friend.id
   return (
      <li className={isSelected ? 'selected' : ''}>
         <img src={friend.image} alt={friend.name} />
         <h3>{friend.name}</h3>

         {friend.balance < 0 && (
            <p className='red'>
               {' '}
               You owe {friend.name} €{Math.abs(friend.balance)}
            </p>
         )}
         {friend.balance > 0 && (
            <p className='green'>
               {' '}
               {friend.name} owes you {friend.balance}
            </p>
         )}
         {friend.balance === 0 && (
            <p className='green'> Balance:{friend.balance}</p>
         )}
         <Button onClick={() => onSelectFriend(friend)}>
            {isSelected ? 'close' : 'select'}
         </Button>
      </li>
   )
}

function FormAddFriend({ onAddFriend }) {
   const [name, setName] = useState('')
   const [image, setImage] = useState('https://robohash.org/')

   function handleSubmit(e) {
      e.preventDefault()

      if (!name || !image) {
         alert('ENTER SOMETHING')
         return
      }
      const id = crypto.randomUUID()

      const newFriend = {
         id,
         name,
         image: `${image}${id}`,
         balance: 0,
      }
      console.log('NewFriend: ', newFriend)
      onAddFriend(newFriend)
   }

   return (
      <>
         <form className='form-add-friend'>
            <label>🤦🏾‍♀️Friend Name:</label>
            <input
               type='text'
               value={name}
               onChange={(e) => setName(e.target.value)}
            />
            <label>🧱image URL:</label>
            <input
               type='text'
               value={image}
               onChange={(e) => setImage(e.target.value)}
            />
            <Button onClick={handleSubmit}>submit</Button>
         </form>
      </>
   )
}

function FormSplitBill({ selectedFriend }) {
   console.log('SELECTED FRIEND: ', selectedFriend)
   const [bill, setBill] = useState(0)
   const [paidByUser, setPaidByUser] = useState('')
   const [whoIsPaying, setWhoIsPaying] = useState('user')

   return (
      <form className='form-split-bill'>
         <h2>Split Bill with {selectedFriend.name}</h2>
         <label>🤦🏾‍♀️Bill Value:</label>
         <input type='text' />
         <label>🧱Your expense:</label>
         <input type='text' />
         <label>🤦🏾‍♀️{selectedFriend.name}'s' expense:</label>
         <input type='text' disabled={true} />
         <label>? Who is paying?</label>
         <select>
            <option value='user'>You</option>
            <option value='friend'>{selectedFriend.name}</option>
         </select>
         <Button>Split Bill</Button>
      </form>
   )
}
