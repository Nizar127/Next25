const handleShare = async () => {
    const { getDatabase, ref, get } = require('firebase/database');
    const db = getDatabase();
    
    // Get stateful pitch data
    const pitchRef = ref(db, `pitches/${pitch.id}`);
    const snapshot = await get(pitchRef);
    const pitchData = snapshot.val();
  
    // Generate shareable link
    const link = `https://yourapp.com/pitch/${pitch.id}`;
    
    // Use React Native Share API
    await Share.share({
      message: `Check out this pitch: ${pitchData.title}\n${link}`,
      title: pitchData.title
    });
  
    // Log stateless share action
    const { getFirestore, collection, addDoc } = require('firebase/firestore');
    await addDoc(collection(getFirestore(), 'shareLogs'), {
      userId: auth.currentUser?.uid,
      pitchId: pitch.id,
      timestamp: new Date().toISOString()
    });
  };