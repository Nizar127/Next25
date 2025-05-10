export const createPitch = /* GraphQL */ `
  mutation CreatePitch(
    $input: CreatePitchInput!
    $condition: ModelPitchConditionInput
  ) {
    createPitch(input: $input, condition: $condition) {
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

export const updatePitch = /* GraphQL */ `
  mutation UpdatePitch(
    $input: UpdatePitchInput!
    $condition: ModelPitchConditionInput
  ) {
    updatePitch(input: $input, condition: $condition) {
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