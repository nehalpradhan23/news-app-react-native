import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { NewsDataType } from "@/types";
import Loading from "@/components/Loading";
import { Colors } from "@/constants/Colors";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {};

const NewsDetails = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [news, setNews] = useState<NewsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [bookmark, setBookmark] = useState(false);

  const getNews = async () => {
    try {
      const URL = `https://newsdata.io/api/1/news?apikey=${process.env.EXPO_PUBLIC_API_KEY}&id=${id}`;
      const res = await axios.get(URL);
      if (res && res.data) {
        setNews(res.data.results);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log("Breaking news error: ", error);
    }
  };

  useEffect(() => {
    getNews();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      removeBookmark(news[0].article_id);
    }
  }, [isLoading]);

  const saveBookmark = async (newsId: string) => {
    setBookmark(true);
    await AsyncStorage.getItem("bookmark").then((token) => {
      const res = JSON.parse(token);
      if (res !== null) {
        let data = res.find((value: string) => value === newsId);
        if (data == null) {
          res.push(newsId);
          AsyncStorage.setItem("bookmark", JSON.stringify(res));
          alert("News saved!");
        }
      } else {
        let bookmark = [];
        bookmark.push(newsId);
        AsyncStorage.setItem("bookmark", JSON.stringify(bookmark));
        alert("News saved!");
      }
    });
  };

  const removeBookmark = async (newsId: string) => {
    setBookmark(false);
    const bookmark = await AsyncStorage.getItem("bookmark").then((token) => {
      const res = JSON.parse(token);
      return res.filter((id: string) => id !== newsId);
    });
    await AsyncStorage.setItem("bookmark", JSON.stringify(bookmark));
    alert("News unsaved");
  };

  const renderBookmark = async (newsId: string) => {
    await AsyncStorage.getItem("bookmark").then((token) => {
      const res = JSON.parse(token);
      if (res !== null) {
        let data = res.find((value: string) => value === newsId);
        return data == null ? setBookmark(false) : setBookmark(true);
      }
    });
  };
  // ============================================
  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                bookmark
                  ? removeBookmark(news[0].article_id)
                  : saveBookmark(news[0].article_id)
              }
            >
              <Ionicons
                name={bookmark ? "heart" : "heart-outline"}
                size={22}
                color={bookmark ? "red" : Colors.black}
              />
            </TouchableOpacity>
          ),
          title: "",
        }}
      />

      {isLoading ? (
        <Loading size={"large"} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.container}
          style={styles.contentContainer}
        >
          <Text style={styles.title}>{news[0].title}</Text>
          <View style={styles.newsInfoWrapper}>
            <Text style={styles.newsInfo}>
              {moment(news[0].pubDate).format("MMMM DD, hh:mm a")}
            </Text>
            <Text style={styles.newsInfo}>{news[0].source_name}</Text>
          </View>
          <Image source={{ uri: news[0].image_url }} style={styles.newsImage} />
          {!news[0].content ? (
            <Text style={styles.newsContent}>{news[0].content}</Text>
          ) : (
            <Text style={styles.newsContent}>{news[0].description}</Text>
          )}
        </ScrollView>
      )}
    </>
  );
};

export default NewsDetails;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
    marginVertical: 10,
    letterSpacing: 0.6,
  },
  newsImage: {
    width: "100%",
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  newsInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  newsInfo: {
    fontSize: 20,
    color: Colors.darkGrey,
  },
  newsContent: {
    fontSize: 14,
    color: "#555",
    letterSpacing: 0.8,
    lineHeight: 22,
  },
});
