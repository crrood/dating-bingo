export interface Resource {
  _id?: {
    $oid: string;
  }
  metadata?: MetaData;
  data: BingoCard | CriteriaArray;
}

export interface MetaData {
  createdAt: string
  updatedAt: string
}

// A BingoCard is a 5x5 matrix of BingoSquares
export interface BingoCard {
  prospectName: string;
  tileMatrix: BingoSquare[][];
}

// Index is the index in CriteriaArray
// Checked is whether the square has been marked for this card
export interface BingoSquare {
  index: number;
  checked: boolean;
}

// List of criteria, shared between all BingoCards
// 0 is the center square, 1-4 are important, 5-24 are less important
export interface CriteriaArray {
  criteria: string[];
}
