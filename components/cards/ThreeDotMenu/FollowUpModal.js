const FollowUpModal = ({ visible, onClose, pitch }) => {
    const [updates, setUpdates] = useState([]);
  
    useEffect(() => {
      const fetchUpdates = async () => {
        const db = getDatabase();
        const updatesRef = ref(db, `pitchUpdates/${pitch.id}`);
        onValue(updatesRef, (snapshot) => {
          setUpdates(snapshot.val() ? Object.values(snapshot.val()) : []);
        });
      };
      
      if (visible) fetchUpdates();
    }, [visible]);
  
    const handleFollow = async () => {
      const db = getDatabase();
      const followRef = ref(db, `followers/${pitch.id}/${auth.currentUser.uid}`);
      
      // Stateful follow in Realtime DB
      await set(followRef, {
        timestamp: Date.now(),
        notify: true
      });
  
      // Stateless log
      const { getFirestore, collection, addDoc } = require('firebase/firestore');
      await addDoc(collection(getFirestore(), 'followLogs'), {
        userId: auth.currentUser.uid,
        pitchId: pitch.id,
        action: 'follow',
        timestamp: new Date().toISOString()
      });
    };
  
    return (
      <Modal isOpen={visible} onClose={onClose} size="xl">
        <Box p={4}>
          <Text fontSize="xl" mb={4}>Pitch Updates</Text>
          
          <FlatList
            data={updates}
            renderItem={({ item }) => (
              <Box p={2} borderBottomWidth={1}>
                <Text>{item.message}</Text>
                <Text color="gray.500">{new Date(item.timestamp).toLocaleString()}</Text>
              </Box>
            )}
          />
          
          <Button onPress={handleFollow} mt={4}>
            <Text>Follow for Updates</Text>
          </Button>
        </Box>
      </Modal>
    );
  };