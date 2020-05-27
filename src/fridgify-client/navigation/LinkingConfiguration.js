import * as Linking from "expo-linking";

export default {
  prefixes: [Linking.makeUrl("/")],
  config: {
    Root: {
      path: "root",
      screens: {
        Home: "home",
        Links: "links",
        Demo: "demos",
      },
    },
    SignIn: {
      path: "signin",
      screens: {
        SignIn: "signin",
      },
    },
  },
};
