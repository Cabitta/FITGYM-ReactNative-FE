import React, { useState, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { getNewsAndPromotions } from '../services/newsService';
import NewsCard from './NewsCard';
import { useTheme } from '../../config/theme';

const NewsSection = () => {
  const { theme } = useTheme();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNewsAndPromotions();
        setNews(data);
      } catch (error) {
        Alert.alert('Error', 'No se pudo obtener las noticias.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <View style={{ height: 300, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ marginVertical: 8 }}>
      <Text
        variant="headlineSmall"
        style={{
          color: theme.colors.onSurface,
          fontWeight: 'bold',
          marginBottom: 12,
          marginLeft: 8,
        }}
      >
        Novedades
      </Text>
      <FlatList
        data={news}
        renderItem={({ item }) => <NewsCard item={item} />}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingRight: 16,
        }}
      />
    </View>
  );
};

export default NewsSection;
