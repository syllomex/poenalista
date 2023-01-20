export interface List {
  id: string
  name: string
  ownerId: string
  createdAt: number
}

export interface ListItem {
  id: string
  name: string
  checked: boolean
  createdAt: number
}

export interface Share {
  id: string
  /** Email address */
  with: string[]
}
