export interface CriteriaResource {
  _id?: {
    $oid: string;
  }
  metadata?: MetaData;
  criteria: string[];
}

// A BingoCard is a 5x5 matrix of BingoSquares
export interface BingoCardResource {
  _id?: {
    $oid: string;
  }
  metadata?: MetaData;
  prospectName: string;
  tileMatrix: BingoSquare[][];
}

// Index is the index in CriteriaArray
// Checked is whether the square has been marked for this card
export interface BingoSquare {
  index: number;
  checked: boolean;
}

export interface MetaData {
  createdAt: string
  updatedAt: string
}