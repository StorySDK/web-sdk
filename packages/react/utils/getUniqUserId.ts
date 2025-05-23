import { nanoid } from 'nanoid';
import { StorageService } from '../services/StorageService';

const USER_ID_KEY = 'storysdk_user_id';

/**
 * Gets or creates a unique user ID for tracking across sessions
 * Using StorageService which handles storage for both browser and React Native
 */
export const getUniqUserId = (): Promise<string> => StorageService.getItem<string>(USER_ID_KEY)
  .then((existingId) => {
    if (existingId) {
      return existingId;
    }

    const id = nanoid();
    return StorageService.setItem(USER_ID_KEY, id)
      .then(() => id);
  });
