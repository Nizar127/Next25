export type PitchType = "normal" | "auction" | "hiring" | "fundraising"
export type AuctionType = "premium" | "public"
export type BidType = "live" | "normal"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  createdAt: Date
}

export interface Vote {
  type: "up" | "down"
  userId: string
  pitchId: string
  createdAt: Date
}

export interface Pitch {
  id: string
  type: PitchType
  title: string
  description: string
  category: string
  video?: string // S3 key
  gallery?: string[] // S3 keys
  creatorId: string
  creator: User
  upvotes: number
  downvotes: number
  createdAt: Date
  updatedAt: Date
}

export interface AuctionPitch extends Pitch {
  type: "auction"
  auctionType: AuctionType
  bidType: BidType
  startingBid: number
  minimumBidIncrement: number
  currentBid?: number
  currentBidderId?: string
  liveAuctionDateTime?: Date
  bidStartDateTime?: Date
  bidEndDateTime?: Date
  status: "upcoming" | "active" | "ended"
}

export interface HiringPitch extends Pitch {
  type: "hiring"
  position: string
  salaryMin: number
  salaryMax: number
  requirements: string
  deadline: Date
}

export interface FundraisingPitch extends Pitch {
  type: "fundraising"
  goalAmount: number
  currentAmount: number
  deadline: Date
  rewards: string
}

export interface CreatePitchData {
  type: PitchType
  title: string
  description: string
  category: string
  video?: File
  gallery?: File[]

  // For hiring pitches
  position?: string
  salaryMin?: number
  salaryMax?: number
  requirements?: string

  // For fundraising pitches
  goalAmount?: number
  rewards?: string

  // For auction pitches
  auctionType?: AuctionType
  bidType?: BidType
  startingBid?: number
  minimumBidIncrement?: number
  liveAuctionDateTime?: Date
  bidStartDateTime?: Date
  bidEndDateTime?: Date
}

export interface PitchWithUrls extends Pitch {
  videoUrl: string | null
  galleryUrls: string[]
}

