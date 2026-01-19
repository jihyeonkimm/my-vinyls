import { MyVinyl } from '@/api/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 내 바이닐 정보에 대한 고유한 키
const STORAGE_KEY = '@my_vinyls';

export const getMyVinyls = async (): Promise<MyVinyl[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('바이닐 불러오기 실패', error);
    throw new Error('바이닐 불러오기 실패');
  }
};

export const saveVinyl = async (vinyl: MyVinyl): Promise<boolean> => {
  try {
    const vinyls = await getMyVinyls();
    const newVinyls = [...vinyls, vinyl];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newVinyls));
    return true;
  } catch (error) {
    console.error('바이닐 저장 실패', error);
    throw new Error('바이닐 저장 실패');
  }
};

export const deleteVinyl = async (index: number): Promise<boolean> => {
  try {
    const vinyls = await getMyVinyls();
    const newVinyls = vinyls.filter((_, i) => i !== index);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newVinyls));
    return true;
  } catch (error) {
    console.error('바이닐 삭제 실패', error);
    throw new Error('바이닐 삭제 실패');
  }
};

export const updateVinyl = async (
  id: number,
  updates: Partial<MyVinyl>
): Promise<boolean> => {
  try {
    const vinyls = await getMyVinyls();
    const index = vinyls.findIndex(vinyl => vinyl.id === id);

    if (index === -1) {
      throw new Error('바이닐을 찾을 수 없습니다');
    }

    const updatedVinyls = [...vinyls];
    updatedVinyls[index] = { ...updatedVinyls[index], ...updates };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedVinyls));
    return true;
  } catch (error) {
    console.error('바이닐 업데이트 실패', error);
    throw new Error('바이닐 업데이트 실패');
  }
};
