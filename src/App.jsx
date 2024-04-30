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
      // console.log(friend)
      setShowAddFriend(false)
   }

   function handleSplitBill(value) {
      // console.log('value = ', value)
      setFriends((friends) =>
         friends.map((friend) =>
            friend.id === selectedFriend.id
               ? { ...friend, balance: friend.balance + value }
               : friend
         )
      )
      setSelectedFriend(null)
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
            <FormSplitBill
               selectedFriend={selectedFriend}
               onSplitBill={handleSplitBill}
            />
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
      // console.log('NewFriend: ', newFriend)
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

function FormSplitBill({ selectedFriend, onSplitBill }) {
   // console.log('SELECTED FRIEND: ', selectedFriend)
   const [bill, setBill] = useState(0)
   const [paidByUser, setPaidByUser] = useState('')
   const [whoIsPaying, setWhoIsPaying] = useState('user')
   const paidByFriend = bill ? bill - paidByUser : ''

   function handleSubmit(e) {
      e.preventDefault()
      // console.log('handle submit: ', e)
      // console.log(e.timeStamp)
      // console.log('BILL: ', bill)

      if (!bill || !paidByUser) {
         alert('NOTHING')
         return
      }

      onSplitBill(
         whoIsPaying === 'user' ? paidByFriend : -paidByUser
      )
   }

   return (
      <form className='form-split-bill' onSubmit={handleSubmit}>
         <h2>Split Bill with {selectedFriend.name}</h2>
         <label>🤦🏾‍♀️Bill Value:</label>

         <input
            type='number'
            pattern='\d*'
            onChange={(e) => {
               setBill(Number(e.target.value))
               console.log('e: ', e.target.value)
            }}
         />

         <label>🧱Your expense:</label>
         <input
            type='number'
            onChange={(e) =>
               setPaidByUser(
                  Number(e.target.value) > bill
                     ? paidByUser
                     : Number(e.target.value)
               )
            }
         />
         <label>🤦🏾‍♀️{selectedFriend.name}'s' expense:</label>

         <input
            type='number'
            value={paidByFriend}
            disabled={true}
         />
         <label>? Who is paying?</label>
         <select
            value={whoIsPaying}
            onChange={(e) => {
               setWhoIsPaying(e.target.value)
               console.log("who's paying: ", whoIsPaying)
            }}
         >
            <option value='user'>You</option>
            <option value='friend'>{selectedFriend.name}</option>
         </select>
         <Button>Split Bill</Button>
      </form>
   )
}
