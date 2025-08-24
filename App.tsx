import "react-native-gesture-handler"; // safe to include at top
import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/store";
// import AppNavigator from "./src/app/AppNavigator";
import AuthGate from "./src/app/AuthGate";

export default function App() {
  return (
    <Provider store={store}>
      <AuthGate />
    </Provider>
  );
}
