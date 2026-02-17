import './App.css'
import UserCard from './components/UserCard'

function App() {

  return (
    <>
     <UserCard name="Anshul Panchal" role="CEO" isAvailable={true}/>
     <UserCard name="Kuldeep Sharma" role="Developer" isAvailable={false}/>
     <UserCard name="Mansi Mehta" role="Designer" isAvailable={true}/>
    </>
  )
}

export default App
