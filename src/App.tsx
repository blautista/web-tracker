import { Provider } from "react-redux";
import EditorTable from "./components/Editor/EditorTable.tsx";
import store from "./store/store.ts";
import { Stack } from "@mui/joy";
import TransportActions from "./components/Transport/TransportActions.tsx";

function App() {
  return (
    <Provider store={store}>
      <Stack>
        <TransportActions />
        <EditorTable />
      </Stack>
    </Provider>
  );
}

export default App;
