export const listPitches = /* GraphQL */ `
  query ListPitches(
    $filter: ModelPitchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPitches(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        category
        mediaKey
        likes
        userId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getPitch = /* GraphQL */ `
  query GetPitch($id: ID!) {
    getPitch(id: $id) {
      id
      title
      description
      category
      mediaKey
      likes
      userId
      createdAt
      updatedAt
    }
  }
`;