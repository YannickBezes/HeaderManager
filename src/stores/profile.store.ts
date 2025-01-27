import {defineStore} from "pinia";
import {computed, ComputedRef, DeepReadonly, readonly, ref} from "vue";
import {getDataFromStorage, saveData} from "../services/local-storage.service.ts";
import {ProfileNotFoundError} from "../errors/profile-not-found.error.ts";
import {deepCopy} from "../services/helper.ts";

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
            active: true
          }
        ]
      },
      response: {
        headers: []
      },
      activate: true,
      filters: [],
      appendMode: false
    };
  }

  function saveProfile() {
    return Promise.all([
      saveData("profiles", deepCopy(profiles.value)),
      saveData("selectedProfile", currentProfileId.value),
    ]);
  }

  async function loadProfiles() {
    const data = await getDataFromStorage<Array<Profile>>("profiles") ?? [];
    const selectedProfileIndex = await getDataFromStorage<number>("selectedProfile") ?? 0;

    if (data.length === 0) {
      const newProfile = createProfile();
      data.push(newProfile);
    }

    profiles.value = data;

    // Set currentProfile
    currentProfileId.value = profiles.value[selectedProfileIndex].id;
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
