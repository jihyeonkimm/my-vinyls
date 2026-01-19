import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from './ui/icon';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const MAX_STARS = 5;

export default function StarRating({
  rating,
  onRatingChange,
}: StarRatingProps) {
  const handlePress = (selectedRating: number) => {
    if (selectedRating === rating) {
      onRatingChange(0);
    } else {
      onRatingChange(selectedRating);
    }
  };

  return (
    <View style={styles.container}>
      {Array(MAX_STARS)
        .fill(0)
        .map((_, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={styles.starButton}
              onPress={() => handlePress(index + 1)}
            >
              <Icon
                name={index + 1 <= rating ? 'star' : 'star-border'}
                size={30}
                color="#FFD700"
              />
            </TouchableOpacity>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  starButton: {
    width: 30,
    height: 30,
  },
});
