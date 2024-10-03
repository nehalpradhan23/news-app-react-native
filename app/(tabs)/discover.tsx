import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import SearchBar from "@/components/SearchBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import newsCategoryList from "@/constants/Categories";
import CheckBox from "@/components/CheckBox";
import { useNewsCategories } from "@/hooks/useNewsCategories";
import CountryList from "@/constants/CountryList";
import { useNewsCountry } from "@/hooks/useNewsCountry";

type Props = {};

const Page = (props: Props) => {
  const { top: safeTop } = useSafeAreaInsets();
  const { newsCategories, toggleNewsCategory } = useNewsCategories();
  const { newsCountries, toggleNewsCountry } = useNewsCountry();
  // ===========================================================
  return (
    <View style={[styles.container, { paddingTop: safeTop + 20 }]}>
      <SearchBar withHorizontalPadding={false} />
      <Text style={styles.title}>Categories</Text>
      <View style={styles.listContainer}>
        {newsCategories.map((item) => (
          <CheckBox
            key={item.id}
            label={item.title}
            checked={item.selected}
            onPress={() => {
              toggleNewsCategory(item.id);
            }}
          />
        ))}
      </View>

      <Text style={styles.title}>Country</Text>
      <View style={styles.listContainer}>
        {newsCountries.map((item, index) => (
          <CheckBox
            key={index}
            label={item.name}
            checked={item.selected}
            onPress={() => {
              toggleNewsCountry(index);
            }}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.searchBtn}>
        <Text style={styles.searchBtnText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 10,
  },
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 12,
    marginBottom: 20,
  },
  searchBtn: {
    backgroundColor: Colors.tint,
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    marginVertical: 10,
  },
  searchBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
