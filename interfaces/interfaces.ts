interface User {
  id: string
  firstName: string
  lastName: string
  dob: string
  guide: Boolean
  city: string
  country: string
  gender: string
  summary: string
  profileImg: string
  filterCity: string
  languages: Array<{ id: string, name: string }>
  interests: Array<{ id: string, name: string }>
  isFavorited: Boolean
}

export default User