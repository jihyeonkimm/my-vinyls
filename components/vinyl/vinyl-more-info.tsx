import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../layout/themed-text';

interface VinylMoreInfoProps {
  moreInfo: {
    released?: string;
    labels?: {
      name: string;
      catno: string;
      id: number;
    }[];
    formats?: {
      name: string;
      qty: string;
      descriptions: string[];
      text: string;
    }[];
  };
}

export default function VinylMoreInfo({ moreInfo }: VinylMoreInfoProps) {
  return (
    <View style={styles.moreInfoContainer}>
      <ThemedText type="small">발매일 : {moreInfo.released}</ThemedText>
      <View style={styles.labelsContainer}>
        <ThemedText type="small">레이블 :</ThemedText>
        {moreInfo.labels &&
          moreInfo.labels.length > 0 &&
          moreInfo.labels.map((label, index) => (
            <ThemedText
              key={`${label.catno} - ${label.id} - ${index}`}
              type="small"
            >
              {label.name} - {label.catno}
              {index < moreInfo.labels!.length - 1 ? ',' : ''}
            </ThemedText>
          ))}
      </View>
      <View style={styles.formatContainer}>
        <ThemedText type="small">
          형식 : {moreInfo.formats?.[0].name},
        </ThemedText>
        {moreInfo.formats?.[0].descriptions.map((desc, index) => (
          <ThemedText key={index} type="small">
            {desc}
            {index < moreInfo.formats![0].descriptions.length - 1 ||
            moreInfo.formats?.[0].text
              ? ','
              : ''}
          </ThemedText>
        ))}
        <ThemedText type="small">{moreInfo.formats?.[0].text}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  moreInfoContainer: {
    marginTop: 20,
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 3,
    maxWidth: '100%',
  },
  formatContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 3,
    maxWidth: '100%',
  },
});
