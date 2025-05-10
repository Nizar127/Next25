import { getDatabase, ref, set } from 'firebase/database';

const ImpressionModal = ({ visible, onClose, pitch }) => {
  const [loading, setLoading] = useState(false);

  const handleRepost = async () => {
    setLoading(true);
    try {
      const db = getDatabase();
      const impressionRef = ref(db, `impressions/${pitch.id}/${auth.currentUser.uid}`);
      
      // Stateful data in Realtime DB
      await set(impressionRef, {
        timestamp: Date.now(),
        originalPitch: pitch.id
      });

      // Stateless log in Firestore
      const { getFirestore, collection, addDoc } = require('firebase/firestore');
      await addDoc(collection(getFirestore(), 'repostLogs'), {
        userId: auth.currentUser.uid,
        pitchId: pitch.id,
        action: 'repost',
        timestamp: new Date().toISOString()
      });

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={visible} onClose={onClose}>
      <Box p={4}>
        <Text fontSize="lg" mb={4}>Repost this pitch?</Text>
        <Button onPress={handleRepost} isLoading={loading}>
          <Text>Confirm Impression</Text>
        </Button>
      </Box>
    </Modal>
  );
};