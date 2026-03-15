import './App.css'
import ProfileCreate from './components/ProfileCreate.jsx'
import ProfileEdit from "./components/ProfileEdit.jsx"
import ProfileView from './components/ProfileView.jsx'
function App() {
  return <ProfileEdit user={{username:"TProf",email:"tprofile@email.com",password:"ThisIsAPassword",firstname:"Testing",lastname:"Profile",skills:["Testing","Skill 1"],interests:["Test","IT"],location:{Country:"Canada",Region:"Ontario",City:"London",Address:"123 Street Rd."},employment:{workplace:"Job Ltd.",position:"IT"},privacyLevel:0}}/>

  //old test return 
/*
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
  */ 
}

export default App
