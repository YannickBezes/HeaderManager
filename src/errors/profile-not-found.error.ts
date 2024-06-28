export class ProfileNotFoundError extends Error {
  constructor(profileId: number) {
    super(`Profile with id '${profileId}' not found!`)
    this.name = this.constructor.name;
  }
}
