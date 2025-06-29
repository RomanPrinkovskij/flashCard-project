/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * Flash Cards API
 * API documentation for the Flash Cards application
 * OpenAPI spec version: 1.0
 */
export interface CreateCardDto {
  /** Front side / question text of the flash-card */
  question: string;
  /** Back side / answer text of the flash-card */
  answer: string;
  /** ID of the deck this card belongs to */
  deckId: number;
}

export interface CardResponse {
  /** Unique identifier of the card */
  id: number;
  /** Question text */
  question: string;
  /** Answer text */
  answer: string;
  /** Deck ID */
  deckId: number;
  /** Owner (user) ID */
  ownerId: number;
  /** Public URL of the card image (null if no image uploaded) */
  imgUrl?: string;
}

export interface UpdateCardDto {
  /** Updated question text */
  question?: string;
  /** Updated answer text */
  answer?: string;
  /** Deck ID */
  deckId?: number;
}

export interface CreateSubjectDto {
  /** The name of the subject */
  name: string;
  /** The description of the subject */
  description: string;
}

export interface SubjectResponse {
  /** The unique ID of the subject */
  id: number;
  /** The name of the subject */
  name: string;
  /** The description of the subject */
  description?: string;
  /** The ID of the user who owns the subject */
  ownerId: number;
}

export interface SubjectCount {
  /** Number of decks */
  decks: number;
}

export interface SubjectResponseWithCount {
  /** The unique ID of the subject */
  id: number;
  /** The name of the subject */
  name: string;
  /** The description of the subject */
  description?: string;
  /** The ID of the user who owns the subject */
  ownerId: number;
  /** Count of related decks to this subject */
  _count: SubjectCount;
}

export interface UpdateSubjectDto {
  /** The updated name of the subject */
  name?: string;
  /** An optional updated description of the subject */
  description?: string;
}

export interface CreateDeckDto {
  /** The name of the deck */
  name: string;
  /** Relation to subjects table */
  subjectId: number;
  /** An optional description of the deck */
  description?: string;
}

/**
 * Optional description of the deck
 */
export type DeckResponseDescription = { [key: string]: unknown };

export interface DeckResponse {
  /** Unique identifier of the deck */
  id: number;
  /** The name of the deck */
  name: string;
  /** Identifier of the user that owns this deck */
  ownerId: number;
  /** Optional description of the deck */
  description?: DeckResponseDescription;
  /** The subject this deck belongs to */
  subject: SubjectResponse;
  /** Related cards */
  cards: CardResponse[];
}

export interface UpdateDeckDto {
  /** Updated name of the deck */
  name?: string;
  /** Updated description of the deck */
  description?: string;
}

export interface CreateUserDto {
  /**
   * The name of the user
   * @maxLength 48
   */
  name: string;
  /**
   * The email of the user
   * @maxLength 256
   */
  email: string;
  /**
   * The password of the user
   * @minLength 6
   * @maxLength 32
   */
  password: string;
}

export interface UserResponse {
  /** Unique identifier of the user */
  id: number;
  /** Full name of the user */
  name: string;
  /** Email address of the user */
  email: string;
}

export interface LoginDto {
  /**
   * The email of the user
   * @maxLength 64
   */
  email: string;
  /**
   * The password of the user
   * @minLength 4
   * @maxLength 32
   */
  password: string;
}

export interface JwtResponse {
  /** Short-lived token used to authenticate API requests */
  accessToken: string;
  /** Long-lived token used to obtain new access tokens */
  refreshToken: string;
}

export interface RefreshDto {
  /** The refresh token used to obtain a new access token */
  refreshToken: string;
}

export type CardControllerUploadImageBody = {
  /** Image file to upload */
  file: Blob;
};

export type CardControllerUploadImage201 = {
  imageUrl?: string;
};

