import { Provider } from "react-redux";
import NotesTable from "./components/Transport/NotesTable.tsx";
import store from "./store/store.ts";

function App() {
  return (
    <Provider store={store}>
      <NotesTable />
    </Provider>
  );
}

export default App;
