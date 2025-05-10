import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, ButtonIcon, AddIcon } from '@gluestack-ui/themed';

const CreatePitchButton = ({ onPress }) => {
  return (
    <Button
      onPress={onPress}
      style={styles.button}
      size="lg"
      borderRadius="$full"
      bg="$primary600"
      sx={{
        ':active': {
          bg: '$primary700',
        },
      }}
    >
      <ButtonIcon as={AddIcon} size="xl" color="$white" />
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    marginBottom: 24,
    shadowColor: '$primary600',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default CreatePitchButton;