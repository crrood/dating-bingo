export interface Entity {
  _id?: {
    $oid: string;
  }
  metadata?: MetaData;
  data: EntityData;
}

export interface EntityData {
  key1: string;
  key2: string;
}

export interface AnotherEntity {
  _id?: {
    $oid: string;
  }
  metadata?: MetaData;
  data: AnotherEntityData;
}

export interface AnotherEntityData {
  key3: string;
  key4: string;
}

export interface MetaData {
  createdAt: string
  updatedAt: string
}