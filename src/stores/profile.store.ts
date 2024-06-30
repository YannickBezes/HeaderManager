import {defineStore} from "pinia";
import {computed, ComputedRef, DeepReadonly, readonly, ref} from "vue";
import {getDataFromStorage, saveData} from "../services/local-storage.service.ts";
import {ProfileNotFoundError} from "../errors/profile-not-found.error.ts";

const STORAGE_KEY: string = "profiles";
const DEFAULT_PREFIX_NAME: string = "Profile";



export const useProfileStore = defineStore("profile", () => {
  const currentProfileId = ref<number | null>(null);
  const profiles = ref<Array<Profile>>([]);

  const currentProfile: ComputedRef<Profile | null> = computed((): Profile | null =>
    profiles.value.find(profile => profile.id === currentProfileId.value) ?? null
  );

  function getProfileById(profileId: number): DeepReadonly<Profile> | null {
    const profile = profiles.value.find(profile => profile.id === profileId);
    if (!profile) {
      return null;
    }

    return readonly(profile);
  }

  function createProfile(): Profile {
    const id = profiles.value.length + 1;

    return {
      id,
      name: `${ DEFAULT_PREFIX_NAME } ${ id }`,
      request: {
        headers: [
          {
            name: "",
            value: "",
            active: true,
          }
        ]
      },
      response: {
        headers: []
      },
      activate: true
    };
  }

  function saveProfile() {
    saveData(STORAGE_KEY, profiles.value);
  }

  function loadProfiles() {
    const data = getDataFromStorage<Array<Profile>>(STORAGE_KEY) ?? [];
    if (data.length === 0) {
      const newProfile = createProfile();
      data.push(newProfile);
    }

    profiles.value = data;

    // Set currentProfile
    const currentProfile = profiles.value
      .find(profile => profile.activate) ?? profiles.value[0];
    currentProfileId.value = currentProfile.id;
  }

  function updateProfile(id: number, updatedProfile: Profile) {
    const profileIndex = profiles.value.findIndex(profile => profile.id === id);
    if (profileIndex === -1) {
      throw new ProfileNotFoundError(id);
    }

    profiles.value[profileIndex] = updatedProfile;
    saveProfile();
  }

  return {
    currentProfileId: readonly(currentProfileId),
    currentProfile: readonly(currentProfile),
    getProfileById,
    loadProfiles,
    updateProfile
  };
});
