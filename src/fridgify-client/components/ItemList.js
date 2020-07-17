import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
  ListLabels,
  ListSearchBar,
} from "./list";

export default function ItemList({
  children,
  items,
  deleteItem,
  showExpiration,
  showCheckBox,
  checked,
  checkItem,
  sortByAndSet,
  onToggleModal,
}) {
  const [search, setSearch] = useState("");

  const clearSearch = () => {
    setSearch("");
  };

  const onChangeSearch = (search) => {
    setSearch(search.trim());
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.listOptions}>
        <ListSearchBar
          search={search}
          onChangeSearch={onChangeSearch}
          clearSearch={clearSearch}
        />
        {children}
      </View>
      <ListLabels
        showCheckBox={showCheckBox}
        showExpiration={showExpiration}
        sortByAndSet={sortByAndSet}
      />
      <SwipeListView
        data={items.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )}
        renderItem={(data, rowMap) => (
          <ListItem
            data={data}
            checked={checked}
            checkItem={checkItem}
            showCheckBox={showCheckBox}
            showExpiration={showExpiration}
            onToggleModal={onToggleModal}
          />
        )}
        renderHiddenItem={(data, rowMap) => (
          <ListItemDeleteAction
            closeRow={() => closeRow(rowMap, data.index)}
            deleteItem={() => deleteItem(data.item)}
          />
        )}
        rightOpenValue={-75}
        onRowOpen={(rowKey, rowMap) => {
          setTimeout(() => {
            closeRow(rowMap, rowKey);
          }, 2000);
        }}
        disableRightSwipe
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listOptions: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
});
