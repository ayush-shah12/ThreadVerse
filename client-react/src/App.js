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
