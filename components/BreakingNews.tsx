import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewToken,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Colors } from "@/constants/Colors";
import { NewsDataType } from "@/types";
import SliderItem from "./SliderItem";
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import Pagination from "./Pagination";

type Props = {
  newsList: Array<NewsDataType>;
};

const BreakingNews = ({ newsList }: Props) => {
  const [data, setData] = useState(newsList);
  // console.log("breaking news: ", data);
  const [paginationIndex, setPaginationIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const ref = useAnimatedRef<Animated.FlatList<any>>();

  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const interval = useRef<NodeJS.Timeout>();
  const offset = useSharedValue(0);
  const { width } = useWindowDimensions();

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
    onMomentumEnd: (e) => {
      offset.value = e.contentOffset.x;
    },
  });

  useEffect(() => {
    if (isAutoPlay === true) {
      interval.current = setInterval(() => {
        offset.value = offset.value + width;
      }, 5000);
    } else {
      clearInterval(interval.current);
    }
  }, [isAutoPlay, offset, width]);

  useDerivedValue(() => {
    scrollTo(ref, offset.value, 0, true);
  });

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (
      viewableItems[0].index !== undefined &&
      viewableItems[0].index !== null
    ) {
      setPaginationIndex(viewableItems[0].index % newsList.length);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);
  // ===========================================================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Breaking News</Text>
      <View style={styles.slideWrapper}>
        <Animated.FlatList
          ref={ref}
          data={data}
          keyExtractor={(_, index) => `list_item${index}`}
          renderItem={({ item, index }) => (
            <SliderItem slideItem={item} index={index} scrollX={scrollX} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={onScrollHandler}
          scrollEventThrottle={16}
          onEndReachedThreshold={0.5}
          onEndReached={() => setData([...data, ...newsList])}
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
          onScrollBeginDrag={() => {
            setIsAutoPlay(false);
          }}
          onScrollEndDrag={() => {
            setIsAutoPlay(true);
          }}
        />
        <Pagination
          items={newsList}
          scrollX={scrollX}
          paginationIndex={paginationIndex}
        />
      </View>
    </View>
  );
};

export default BreakingNews;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 10,
    marginLeft: 20,
  },
  slideWrapper: {
    // width: "100%",
    // flex: 1,
    justifyContent: "center",
  },
});
