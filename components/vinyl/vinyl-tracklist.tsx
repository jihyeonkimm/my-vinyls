import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../layout/themed-text';

interface VinylTracklistProps {
  tracklist: {
    position: string;
    title: string;
    duration: string;
    type_?: string | undefined;
  }[];
}

export default function VinylTracklist({ tracklist }: VinylTracklistProps) {
  return (
    <View style={styles.tracklistContainer}>
      {tracklist.map((track, index) => {
        const isLastItem = index === tracklist.length - 1;

        return (
          <View key={`${index} - ${track.position}`} style={styles.track}>
            <View style={styles.trackTitle}>
              <ThemedText type="sub" style={styles.trackPositionText}>
                {track.position}
              </ThemedText>
              <ThemedText
                type="default"
                style={[
                  track.type_ === 'heading'
                    ? styles.headingText
                    : styles.trackTitleText,
                  isLastItem && { borderBottomWidth: 0 },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {track.title}
              </ThemedText>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tracklistContainer: {
    marginTop: 20,
    width: '100%',
    maxWidth: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eaeaea',
  },

  track: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '100%',
    paddingHorizontal: 4,
  },
  trackTitle: {
    flexDirection: 'row',
    gap: 6,
    width: '100%',
    maxWidth: '100%',
  },

  trackPositionText: {
    flexShrink: 0,
    width: 26,
    paddingVertical: 12,
  },
  headingText: {
    paddingVertical: 12,
    fontWeight: 500,
  },
  trackTitleText: {
    flexGrow: 1,
    maxWidth: '90%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eaeaea',
  },
});
