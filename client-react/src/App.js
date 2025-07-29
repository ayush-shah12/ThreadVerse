// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import { ViewContextProvider } from './context/ViewContext.jsx';
import { UserContextProvider } from './context/UserContext.jsx';
import Wrapper from './Wrapper.jsx';

function App() {

  return (
    <UserContextProvider>
    <ViewContextProvider>
        <Wrapper/> 
    </ViewContextProvider>
    </UserContextProvider>
  );
}

export default App;
