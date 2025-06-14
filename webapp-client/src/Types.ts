export interface ResourceA {
  _id?: {
    $oid: string;
  }
  metadata?: MetaData;
  data: ResourceAData;
}

export interface ResourceAData {
  key1: string;
  key2: string;
}

export interface ResourceB {
  _id?: {
    $oid: string;
  }
  metadata?: MetaData;
  data: ResourceBData;
}

export interface ResourceBData {
  key3: string;
  key4: string;
}

export interface MetaData {
  createdAt: string
  updatedAt: string
}