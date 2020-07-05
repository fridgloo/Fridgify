import { SearchBar } from "react-native-elements";

import React from "react";
import { View, Text } from "react-native";

searchFilterFunction = (text) => {
  // this.setState({
  //   value: text,
  // });
  // const newData = this.arrayholder.filter((item) => {
  //   const itemData = `${item.name.title.toUpperCase()} ${item.name.first.toUpperCase()} ${item.name.last.toUpperCase()}`;
  //   const textData = text.toUpperCase();
  //   return itemData.indexOf(textData) > -1;
  // });
  // this.setState({
  //   data: newData,
  // });
};

const ListSearchBar = () => {
  return (
    <SearchBar
      placeholder="Search"
      lightTheme
      round
      onChangeText={(text) => this.searchFilterFunction(text)}
      autoCorrect={false}
    />
  );
};

export default ListSearchBar;
