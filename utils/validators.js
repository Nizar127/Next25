export const validatePitch = (pitch) => {
    const errors = {};
    
    if (!pitch.title || pitch.title.length < 5) {
      errors.title = 'Title must be at least 5 characters';
    }
    
    if (pitch.description && pitch.description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters';
    }
    
    if (!pitch.mediaUrl) {
      errors.media = 'Media is required';
    }
    
    return errors;
  };
  
  export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  export const validatePassword = (password) => {
    return password.length >= 6;
  };