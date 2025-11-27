import React from "react";
import { Card, Text } from "react-native-paper";
import { useTheme } from "../../config/theme";

const NewsCard = ({ item }) => {
  const { theme } = useTheme();

  return (
    <Card
      style={{
        width: 280,
        marginHorizontal: 8,
        backgroundColor: theme.colors.surface,
      }}
      mode="elevated"
    >
      <Card.Cover source={{ uri: item.imageUrl }} />
      <Card.Content style={{ paddingTop: 12, gap: 8 }}>
        <Text
          variant="titleMedium"
          style={{
            fontWeight: "bold",
            color: theme.colors.primary,
          }}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text
          variant="bodyMedium"
          style={{
            color: theme.colors.onSurfaceVariant,
            minHeight: 50, 
          }}
          numberOfLines={3}
        >
          {item.description}
        </Text>
      </Card.Content>
      <Card.Actions>
        <Text
          style={{ fontStyle: "italic", color: theme.colors.onSurfaceVariant }}
        >
        </Text>
      </Card.Actions>
    </Card>
  );
};

export default NewsCard;