export const onCreatePitch = /* GraphQL */ `
  subscription OnCreatePitch {
    onCreatePitch {
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

export const onUpdatePitch = /* GraphQL */ `
  subscription OnUpdatePitch {
    onUpdatePitch {
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