export const AppConstants = {
    // Firebase Collections
    COLLECTIONS: {
      POSTS: 'posts',
      USERS: 'users',
      COMMENTS: 'comments',
      ACTIVITY_LOGS: 'activityLogs',
      ERROR_LOGS: 'errorLogs'
    },
  
    // Storage Paths
    STORAGE: {
      POST_MEDIA: 'posts/media/',
      USER_AVATARS: 'users/avatars/'
    },
  
    // Post Settings
    POST: {
      MAX_MEDIA_SIZE: 10 * 1024 * 1024, // 10MB
      ALLOWED_MEDIA_TYPES: ['image/jpeg', 'image/png', 'video/mp4'],
      MAX_TITLE_LENGTH: 100,
      MAX_DESCRIPTION_LENGTH: 500
    },
  
    // Analytics Events
    EVENTS: {
      POST_CREATED: 'post_created',
      POST_LIKED: 'post_liked',
      POST_VIEWED: 'post_viewed',
      USER_SIGNED_IN: 'user_signed_in'
    },
  
    // UI Constants
    UI: {
      TAB_BAR_HEIGHT: 70,
      FEED_REFRESH_INTERVAL: 30000 // 30 seconds
    },
  
    // Error Messages
    ERRORS: {
      UPLOAD_FAILED: 'Failed to upload media. Please try again.',
      INVALID_FILE_TYPE: 'File type not supported. Please upload JPEG, PNG, or MP4.',
      FILE_TOO_LARGE: 'File is too large. Maximum size is 10MB.'
    }
  };
  
  export const FirestoreIndexes = {
    // Define your Firestore indexes here if needed
    POSTS_BY_DATE: 'posts_by_date_desc',
    USER_POSTS: 'user_posts_asc'
  };
  
  export const RealtimeDBPaths = {
    FEED: 'feed',
    USER_LIKES: 'userLikes',
    POST_STATS: 'postStats'
  };